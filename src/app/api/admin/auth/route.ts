import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  checkCredentials,
  isAuthenticated,
  createSessionToken,
  createGatePass,
  verifyGatePass,
  safeCompare,
  AUTH_COOKIE,
  GATE_COOKIE,
  ADMIN_GATE_KEY,
} from "@/lib/auth";

// In-Memory Brute-Force Rate Limiter (IP-based)
const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "local-client";
}

export async function GET() {
  const authed = await isAuthenticated();
  const cookieStore = await cookies();
  const gateToken = cookieStore.get(GATE_COOKIE)?.value;
  const gateUnlocked = authed || verifyGatePass(gateToken);

  return NextResponse.json({
    authenticated: authed,
    gateUnlocked,
  });
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const now = Date.now();

    // Check if IP is currently locked out
    const attemptRecord = failedAttempts.get(ip);
    if (attemptRecord && attemptRecord.lockedUntil > now) {
      const remainingMin = Math.ceil((attemptRecord.lockedUntil - now) / 60000);
      return NextResponse.json(
        { error: `Security lockout: Too many failed login attempts. Try again in ${remainingMin} minute(s).` },
        { status: 429 }
      );
    }

    const body = await req.json();

    // ── ACTION: UNLOCK GATE ONLY ──
    if (body.action === "unlock_gate") {
      const { gateKey } = body;
      if (!gateKey || !safeCompare(gateKey.trim(), ADMIN_GATE_KEY.trim())) {
        return NextResponse.json({ error: "Invalid Access Gate Key" }, { status: 403 });
      }

      const res = NextResponse.json({ success: true, message: "Gate unlocked" });
      res.cookies.set({
        name: GATE_COOKIE,
        value: createGatePass(),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      return res;
    }

    // ── ACTION: 3-FACTOR ADMIN LOGIN ──
    const { username, password, pin } = body;

    if (!username || !password || !pin) {
      return NextResponse.json(
        { error: "Username, Password, and 6-Digit Master Security PIN are all required." },
        { status: 400 }
      );
    }

    if (!checkCredentials(username, password, pin)) {
      // Artificial delay (450ms) to prevent high-speed dictionary brute force
      await new Promise((r) => setTimeout(r, 450));

      const prevCount = attemptRecord && attemptRecord.lockedUntil <= now ? 0 : (attemptRecord?.count || 0);
      const newCount = prevCount + 1;

      if (newCount >= MAX_ATTEMPTS) {
        failedAttempts.set(ip, { count: newCount, lockedUntil: now + LOCKOUT_MS });
        return NextResponse.json(
          { error: "Security lockout: Maximum failed attempts exceeded. Access locked for 15 minutes." },
          { status: 429 }
        );
      } else {
        failedAttempts.set(ip, { count: newCount, lockedUntil: 0 });
        const remaining = MAX_ATTEMPTS - newCount;
        return NextResponse.json(
          { error: `Invalid credentials or Security PIN. (${remaining} attempt${remaining === 1 ? "" : "s"} remaining before lockout)` },
          { status: 401 }
        );
      }
    }

    // Success: Reset rate limiter for this IP
    failedAttempts.delete(ip);

    const sessionToken = createSessionToken(username);
    const gatePass = createGatePass();

    const res = NextResponse.json({ success: true, message: "Authenticated successfully" });

    // Set signed HMAC session cookie (7 days)
    res.cookies.set({
      name: AUTH_COOKIE,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // Set gate cookie (7 days)
    res.cookies.set({
      name: GATE_COOKIE,
      value: gatePass,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("Auth error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true, message: "Logged out" });
  res.cookies.set({
    name: AUTH_COOKIE,
    value: "",
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  res.cookies.set({
    name: GATE_COOKIE,
    value: "",
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return res;
}
