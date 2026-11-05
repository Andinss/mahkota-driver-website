/**
 * In-memory rate limiter for login endpoint.
 * Tracks failed login attempts per IP address.
 *
 * - Max 5 failed attempts per IP per 15-minute window
 * - Returns HTTP 429 status when limit is exceeded
 * - Automatically resets after the window expires
 */

interface RateLimitEntry {
  count: number;
  resetTime: number; // Unix timestamp in ms
}

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

// Module-level Map persists across requests in the same process
const rateLimitMap = new Map<string, RateLimitEntry>();

/**
 * Check if an IP address is allowed to attempt login.
 * Cleans up expired entries on each check.
 *
 * @param ip - The client IP address
 * @returns `allowed: true` if under the limit, or `allowed: false` with `retryAfter` in seconds
 */
export function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfter?: number;
} {
  const now = Date.now();

  // Clean up expired entries
  for (const [key, entry] of rateLimitMap) {
    if (now >= entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }

  const entry = rateLimitMap.get(ip);

  // No entry or expired — allowed
  if (!entry || now >= entry.resetTime) {
    rateLimitMap.delete(ip);
    return { allowed: true };
  }

  // Under the limit — allowed
  if (entry.count < MAX_ATTEMPTS) {
    return { allowed: true };
  }

  // Over the limit — blocked
  const retryAfterMs = entry.resetTime - now;
  const retryAfter = Math.ceil(retryAfterMs / 1000);

  return { allowed: false, retryAfter };
}

/**
 * Record a failed login attempt for an IP address.
 * Creates a new entry if none exists, or increments the counter.
 *
 * @param ip - The client IP address
 */
export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now >= entry.resetTime) {
    // Start a new window
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
  } else {
    // Increment within existing window
    entry.count += 1;
  }
}

/**
 * Reset the rate limit for an IP address.
 * Useful after a successful login.
 *
 * @param ip - The client IP address
 */
export function resetRateLimit(ip: string): void {
  rateLimitMap.delete(ip);
}
