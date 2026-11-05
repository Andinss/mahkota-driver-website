import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { readdir } from "fs/promises";
import path from "path";

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const iconsDir = path.join(process.cwd(), "public/images/services");
    const files = await readdir(iconsDir);

    const icons = files
      .filter(
        (f) => f.endsWith(".svg") || f.endsWith(".png") || f.endsWith(".webp"),
      )
      .map((f) => ({
        name: f.replace(/\.[^.]+$/, ""),
        url: `/images/services/${f}`,
      }));

    return NextResponse.json({ icons }, { status: 200 });
  } catch {
    return NextResponse.json({ icons: [] }, { status: 200 });
  }
}
