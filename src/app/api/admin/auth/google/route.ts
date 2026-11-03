import { NextResponse } from "next/server";
import {
  createSessionToken,
  createGatePass,
  AUTH_COOKIE,
  GATE_COOKIE,
} from "@/lib/auth";

// Allowed Google Accounts for Harsh Aryan
const ALLOWED_EMAILS = [
  (process.env.ADMIN_ALLOWED_GOOGLE_EMAIL || "harsharyan.work@gmail.com").toLowerCase().trim(),
  "harsharyan.work@gmail.com",
];

function isSecureCookie(req: Request): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  const proto = req.headers.get("x-forwarded-proto");
  if (proto && proto.includes("https")) return true;
  const url = req.url || "";
  if (url.startsWith("https://")) return true;
  return false;
}

export async function POST(req: Request) {
  try {
    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json({ error: "Missing Google ID token" }, { status: 400 });
    }

    // Verify token with Google's official OAuth tokeninfo API
    const googleRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
      { cache: "no-store" }
    );

    if (!googleRes.ok) {
      return NextResponse.json(
        { error: "Invalid or expired Google authentication token" },
        { status: 401 }
      );
    }

    const payload = await googleRes.json();
    const email = (payload.email || "").toLowerCase().trim();
    const emailVerified = payload.email_verified === "true" || payload.email_verified === true;

    if (!emailVerified) {
      return NextResponse.json(
        { error: "Unverified Google account. Please verify your email with Google first." },
        { status: 403 }
      );
    }

    // Strict Authorization Check: Only Harsh Aryan's specific Google account is allowed!
    const isAuthorized = ALLOWED_EMAILS.some((allowed) => allowed === email);

    if (!isAuthorized) {
      console.warn(`Unauthorized login attempt from Google account: ${email}`);
      return NextResponse.json(
        {
          error: `Access Denied: '${email}' is not authorized. Only Harsh Aryan's verified Google account has access to this Admin Console.`,
        },
        { status: 403 }
      );
    }

    // Authentication Success: Create signed HMAC session
    const username = payload.name || email.split("@")[0] || "Harsh Aryan";
    const sessionToken = createSessionToken(username);
    const gatePass = createGatePass();

    const response = NextResponse.json({
      success: true,
      message: `Welcome, ${payload.name || "Harsh"}!`,
      user: {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      },
    });

    // Set signed HMAC session cookie (7 days)
    response.cookies.set({
      name: AUTH_COOKIE,
      value: sessionToken,
      httpOnly: true,
      secure: isSecureCookie(req),
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // Set gate cookie (7 days)
    response.cookies.set({
      name: GATE_COOKIE,
      value: gatePass,
      httpOnly: true,
      secure: isSecureCookie(req),
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Google Auth Error:", err);
    return NextResponse.json(
      { error: "Server error during Google authentication" },
      { status: 500 }
    );
  }
}
