import {
  getIronSession,
  type SessionOptions,
  type IronSession,
} from "iron-session";
import { cookies } from "next/headers";

/**
 * Session data interface for admin authentication.
 */
export interface SessionData {
  isLoggedIn: boolean;
  username?: string;
}

/**
 * iron-session configuration options.
 * Uses SESSION_SECRET from environment variables.
 * Cookie is httpOnly, secure in production, sameSite strict, TTL 1 hour.
 */
export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    "fallback-secret-for-development-only-min-32-chars!!",
  cookieName: "mahkota-drive-admin-session",
  ttl: 3600, // 1 hour in seconds
  cookieOptions: {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax" as const,
    path: "/",
  },
};

/**
 * Get the current session from cookies.
 * Must be called within a Route Handler or Server Component.
 */
export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions,
  );
  return session;
}

/**
 * Check if the current request has an authenticated admin session.
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isLoggedIn === true;
}
