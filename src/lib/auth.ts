import { cookies } from "next/headers";
import crypto from "crypto";

export const AUTH_COOKIE = "portfolio_admin_auth";
export const GATE_COOKIE = "portfolio_admin_gate";

export const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || "").trim();
export const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || "").trim();
export const ADMIN_PIN = (process.env.ADMIN_PIN || "").trim();
export const ADMIN_GATE_KEY = (process.env.ADMIN_GATE_KEY || "socius").trim();
export const SECRET_KEY = (process.env.ADMIN_SECRET_KEY || "socius_runtime_hmac_secret_key_default").trim();

/**
 * Timing-safe string comparison to prevent timing attacks
 */
export function safeCompare(a: string, b: string): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Constant-time dummy compare to prevent length timing side-channel
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Check 3-factor credentials: Username + Password + 6-Digit Master Security PIN
 * Requires environment variables to be set in .env.local or hosting dashboard.
 */
export function checkCredentials(user: string, pass: string, pin: string): boolean {
  if (!user || !pass || !pin) return false;

  // If credentials are not configured in environment variables, reject login for safety
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !ADMIN_PIN) {
    console.error("CRITICAL: Admin credentials are not set in environment variables (.env.local or Hosting dashboard).");
    return false;
  }

  const normalizedUser = user.trim().toLowerCase();
  const expectedUser = ADMIN_USERNAME.toLowerCase();

  const isUserValid = safeCompare(normalizedUser, expectedUser);
  const isPassValid = safeCompare(pass.trim(), ADMIN_PASSWORD);
  const isPinValid = safeCompare(pin.trim(), ADMIN_PIN);

  return isUserValid && isPassValid && isPinValid;
}

export interface SessionPayload {
  u: string; // username
  iat: number; // issued at (ms)
  exp: number; // expires at (ms)
  nonce: string; // unique cryptographic nonce
}

/**
 * Generate a dynamic HMAC-SHA256 signed session token (7-day validity)
 */
export function createSessionToken(username: string): string {
  const payload: SessionPayload = {
    u: username.trim().toLowerCase(),
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    nonce: crypto.randomBytes(16).toString("hex"),
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(payloadStr);
  const signature = hmac.digest("base64url");
  return `${payloadStr}.${signature}`;
}

/**
 * Verify HMAC signature and expiration of a dynamic session token
 */
export function verifySessionToken(token: string | undefined): { valid: boolean; username?: string } {
  if (!token || typeof token !== "string") return { valid: false };
  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false };

  const [payloadStr, signature] = parts;
  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(payloadStr);
  const expectedSig = hmac.digest("base64url");

  if (!safeCompare(signature, expectedSig)) {
    return { valid: false };
  }

  try {
    const json = Buffer.from(payloadStr, "base64url").toString("utf-8");
    const payload: SessionPayload = JSON.parse(json);
    if (!payload.exp || Date.now() > payload.exp) {
      return { valid: false };
    }
    return { valid: true, username: payload.u };
  } catch {
    return { valid: false };
  }
}

/**
 * Create a cryptographic gate pass token
 */
export function createGatePass(): string {
  return crypto.createHmac("sha256", SECRET_KEY).update(ADMIN_GATE_KEY).digest("base64url");
}

/**
 * Verify whether a gate pass token matches
 */
export function verifyGatePass(token: string | undefined): boolean {
  if (!token || typeof token !== "string") return false;
  const expected = createGatePass();
  return safeCompare(token, expected);
}

/**
 * Check if the current incoming request has a valid signed session cookie
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  return verifySessionToken(token).valid;
}
