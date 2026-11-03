import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  verifySessionToken,
  verifyGatePass,
  createGatePass,
  AUTH_COOKIE,
  GATE_COOKIE,
  ADMIN_GATE_KEY,
} from "@/lib/auth";

function isSecureRequest(request: NextRequest): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  const proto = request.headers.get("x-forwarded-proto");
  if (proto && proto.includes("https")) return true;
  return request.nextUrl.protocol === "https:";
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Only apply to /admin and /admin/*
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // 1. Check if user already holds a valid signed session token
  const authCookie = request.cookies.get(AUTH_COOKIE)?.value;
  const isAuth = verifySessionToken(authCookie).valid;
  if (isAuth) {
    return NextResponse.next();
  }

  // 2. Check secret gate query parameter: /admin?key=socius2026 or ?gate=socius2026
  const keyParam = searchParams.get("key") || searchParams.get("gate");
  if (keyParam && keyParam.trim() === ADMIN_GATE_KEY.trim()) {
    // Secret gate unlocked! Strip the key parameter from the URL to keep address bar clean
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete("key");
    cleanUrl.searchParams.delete("gate");

    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set({
      name: GATE_COOKIE,
      value: createGatePass(),
      httpOnly: true,
      secure: isSecureRequest(request),
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days gate pass
      path: "/",
    });
    return response;
  }

  // 3. Check if user already has a valid gate pass cookie
  const gateCookie = request.cookies.get(GATE_COOKIE)?.value;
  if (verifyGatePass(gateCookie)) {
    return NextResponse.next();
  }

  // 4. Unauthorized visitor attempting to scan or probe /admin without gate key:
  // Decoy rewrite to 404 Not Found so bots/scanners believe /admin does not exist
  const notFoundUrl = new URL("/_not-found", request.url);
  return NextResponse.rewrite(notFoundUrl, { status: 404 });
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
