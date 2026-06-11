// app/api/admin/upload/route.ts
// POST /api/admin/upload — Upload images (testimonial photos, service icons, fleet, general)

import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'svg'];
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/octet-stream'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const UPLOAD_DIRS: Record<string, string> = {
  testimonials: 'public/images/testimonials',
  services: 'public/images/services',
  fleet: 'public/images/fleet',
  general: 'public/images',
};

export async function POST(request: Request) {
  // Check auth
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as string | null;

    if (!file || !file.name) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!category || !UPLOAD_DIRS[category]) {
      return NextResponse.json(
        { error: `Invalid category "${category}". Valid: ${Object.keys(UPLOAD_DIRS).join(', ')}` },
        { status: 400 }
      );
    }

    // Validate file extension (more reliable than MIME type in some environments)
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `File extension ".${ext}" not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate file type (allow application/octet-stream as fallback)
    if (file.type && !ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type "${file.type}" not allowed.` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 5MB.` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), UPLOAD_DIRS[category]);
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const filePath = path.join(uploadDir, safeName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Return the public URL path
    const urlPrefix = category === 'general' ? '/images' : `/images/${category}`;
    const publicUrl = `${urlPrefix}/${safeName}`;

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
