import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { isValidCategory, writeCategory } from "@/lib/content";
import { validateCategory } from "@/lib/validation";

/**
 * Recursively trim all string values in an object/array.
 * Sanitizes input by removing leading/trailing whitespace.
 */
function sanitizeStrings(data: unknown): unknown {
  if (typeof data === "string") {
    return data.trim();
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeStrings);
  }
  if (data !== null && typeof data === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(
      data as Record<string, unknown>,
    )) {
      result[key] = sanitizeStrings(value);
    }
    return result;
  }
  return data;
}

/**
 * PUT /api/admin/content/[category]
 * Protected endpoint — requires admin session.
 * Validates category param, validates body with Zod, sanitizes strings, writes to JSON file.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ category: string }> },
) {
  // 1. Check authentication
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Validate category param
  const { category } = await params;

  if (!isValidCategory(category)) {
    return NextResponse.json(
      {
        error: `Invalid category: "${category}". Valid categories: statistics, testimonials, services, registration, contact, fleet, faq, terms, privacy`,
      },
      { status: 400 },
    );
  }

  // 3. Parse request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // 4. Sanitize strings (trim whitespace)
  const sanitizedBody = sanitizeStrings(body);

  // 5. Validate body with Zod schema for this category
  const validationResult = validateCategory(category, sanitizedBody);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: validationResult.error.issues,
      },
      { status: 400 },
    );
  }

  // 6. Write validated data to JSON file
  try {
    await writeCategory(category, sanitizedBody);
    // Halaman publik membaca data saat build/cache; paksa dibuat ulang agar perubahan langsung tampil.
    revalidatePath("/", "layout");
    return NextResponse.json(
      { message: `Content for "${category}" updated successfully` },
      { status: 200 },
    );
  } catch (error) {
    console.error(`Failed to write category "${category}":`, error);
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 },
    );
  }
}
