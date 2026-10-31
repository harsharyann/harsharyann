import { cookies } from "next/headers";

const AUTH_COOKIE = "portfolio_admin_auth";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "harsh@2026";
const SECRET_TOKEN = "harsh_aryan_portfolio_admin_token_2026";

export function checkCredentials(user: string, pass: string): boolean {
  const validUser = user.trim().toLowerCase() === ADMIN_USERNAME.toLowerCase() || user.trim().toLowerCase() === "harsh";
  const validPass = pass.trim() === ADMIN_PASSWORD;
  return validUser && validPass;
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  return token === SECRET_TOKEN;
}

export { AUTH_COOKIE, SECRET_TOKEN };
