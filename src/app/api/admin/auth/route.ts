import { NextResponse } from "next/server";
import { checkCredentials, isAuthenticated, AUTH_COOKIE, SECRET_TOKEN } from "@/lib/auth";

export async function GET() {
  const authed = await isAuthenticated();
  return NextResponse.json({ authenticated: authed });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    if (!checkCredentials(username, password)) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ success: true, message: "Authenticated successfully" });
    res.cookies.set({
      name: AUTH_COOKIE,
      value: SECRET_TOKEN,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
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
