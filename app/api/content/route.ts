import { NextResponse } from 'next/server';
import { readAllContent } from '@/lib/content';

/**
 * GET /api/content
 * Public endpoint — returns all content categories as JSON.
 * Used by the admin dashboard to fetch current content for editing.
 */
export async function GET() {
  try {
    const content = await readAllContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error('Failed to read content:', error);
    return NextResponse.json(
      { error: 'Failed to load content' },
      { status: 500 }
    );
  }
}
