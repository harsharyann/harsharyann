import { NextResponse } from "next/server";
import { checkCredentials, isAuthenticated, AUTH_COOKIE, SECRET_TOKEN } from "@/lib/auth";

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
  return NextResponse.json({ authenticated: authed });
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
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    if (!checkCredentials(username, password)) {
      // Artificial delay (400ms) to prevent high-speed dictionary brute force
      await new Promise((r) => setTimeout(r, 400));

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
          { error: `Invalid credentials. (${remaining} attempt${remaining === 1 ? "" : "s"} remaining before lockout)` },
          { status: 401 }
        );
      }
    }

    // Success: Reset rate limiter for this IP
    failedAttempts.delete(ip);

    const res = NextResponse.json({ success: true, message: "Authenticated successfully" });
    res.cookies.set({
      name: AUTH_COOKIE,
      value: SECRET_TOKEN,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
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
  return res;
}
