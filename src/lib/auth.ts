import { cookies } from "next/headers";
import crypto from "crypto";

const AUTH_COOKIE = "portfolio_admin_auth";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "Harsharyann_";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "harsh@2026";
const SECRET_TOKEN = process.env.ADMIN_SECRET_TOKEN || "harsh_aryan_portfolio_admin_token_2026";

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Constant-time dummy compare to prevent length timing side-channel
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export function checkCredentials(user: string, pass: string): boolean {
  const normalizedUser = user.trim().toLowerCase();
  const validUsers = [
    "harsharyann_",
    ADMIN_USERNAME.toLowerCase(),
    "harsh",
    "admin",
  ];
  const isUserValid = validUsers.includes(normalizedUser);
  const isPassValid = safeCompare(pass.trim(), ADMIN_PASSWORD.trim());
  return isUserValid && isPassValid;
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  return token ? safeCompare(token, SECRET_TOKEN) : false;
}

export { AUTH_COOKIE, SECRET_TOKEN };
