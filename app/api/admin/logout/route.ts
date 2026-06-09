import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

/**
 * POST /api/admin/logout
 * Destroys the admin session and returns 200 on success.
 * Requirements: 9.7
 */
export async function POST() {
  try {
    const session = await getSession();
    session.destroy();

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
