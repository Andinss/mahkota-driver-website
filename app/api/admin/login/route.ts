/**
 * POST /api/admin/login
 *
 * Authenticates admin user with username and password.
 * - Rate limits login attempts (max 5 per IP per 15 minutes)
 * - Compares credentials against bcrypt hash in config/admin.json
 * - Sets encrypted session cookie on success
 */

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import { getSession } from '@/lib/auth';
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from '@/lib/rate-limit';

interface AdminConfig {
  username: string;
  passwordHash: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  // 1. Get IP from request headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown';

  // 2. Check rate limit
  const rateLimitResult = checkRateLimit(ip);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Terlalu banyak percobaan login. Silakan coba lagi nanti.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimitResult.retryAfter || 900),
        },
      }
    );
  }

  // 3. Parse request body
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Request body tidak valid.' },
      { status: 400 }
    );
  }

  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json(
      { error: 'Username dan password wajib diisi.' },
      { status: 400 }
    );
  }

  // 4. Read admin config
  let adminConfig: AdminConfig;
  try {
    const configPath = path.join(process.cwd(), 'config', 'admin.json');
    const configData = await fs.readFile(configPath, 'utf-8');
    adminConfig = JSON.parse(configData);
  } catch {
    return NextResponse.json(
      { error: 'Konfigurasi server error.' },
      { status: 500 }
    );
  }

  // 5. Compare username and password
  const usernameMatch = username === adminConfig.username;
  const passwordMatch = await bcrypt.compare(password, adminConfig.passwordHash);

  if (!usernameMatch || !passwordMatch) {
    // Record failed attempt for rate limiting
    recordFailedAttempt(ip);
    return NextResponse.json(
      { error: 'Username atau password salah.' },
      { status: 401 }
    );
  }

  // 6. Set session on successful login
  const session = await getSession();
  session.isLoggedIn = true;
  session.username = username;
  await session.save();

  // Reset rate limit on successful login
  resetRateLimit(ip);

  return NextResponse.json(
    { message: 'Login berhasil.', username },
    { status: 200 }
  );
}
