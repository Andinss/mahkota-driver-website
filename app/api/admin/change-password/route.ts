// app/api/admin/change-password/route.ts
// POST /api/admin/change-password — Change admin password

import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  // Check auth
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body as {
      currentPassword?: string;
      newPassword?: string;
    };

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Password lama dan password baru wajib diisi.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password baru minimal 6 karakter.' },
        { status: 400 }
      );
    }

    // Read current admin config
    const configPath = path.join(process.cwd(), 'config', 'admin.json');
    const configContent = await readFile(configPath, 'utf-8');
    const adminConfig = JSON.parse(configContent) as { username: string; passwordHash: string };

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, adminConfig.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Password lama tidak sesuai.' },
        { status: 400 }
      );
    }

    // Hash new password
    const newHash = await bcrypt.hash(newPassword, 10);

    // Save new password hash
    const updatedConfig = { ...adminConfig, passwordHash: newHash };
    await writeFile(configPath, JSON.stringify(updatedConfig, null, 2), 'utf-8');

    return NextResponse.json({ message: 'Password berhasil diubah.' }, { status: 200 });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Gagal mengubah password.' }, { status: 500 });
  }
}
