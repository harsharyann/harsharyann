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

function isSecureCookie(req: Request): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  const proto = req.headers.get("x-forwarded-proto");
  if (proto && proto.includes("https")) return true;
  const url = req.url || "";
  if (url.startsWith("https://")) return true;
  return false;
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
        secure: isSecureCookie(req),
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      return res;
    }

    // ── ACTION: 3-FACTOR ADMIN LOGIN (PERMANENTLY DISABLED FOR ENHANCED GOOGLE-ONLY SECURITY) ──
    return NextResponse.json(
      {
        error:
          "Password login has been permanently disabled for maximum security. Please log in using Google OAuth with harsharyan.work@gmail.com.",
      },
      { status: 403 }
    );
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
