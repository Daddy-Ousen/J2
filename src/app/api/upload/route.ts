import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate mime type
    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a JPG, PNG, WEBP, or AVIF image." },
        { status: 400 }
      );
    }

    // Size limit: 15MB
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum allowed size is 15MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);

    // Auto-compress and resize using sharp to ensure blazing fast mobile performance
    try {
      buffer = await sharp(buffer)
        .resize({ width: 900, withoutEnlargement: true, fit: "inside" })
        .jpeg({ quality: 80, mozjpeg: true, progressive: true })
        .toBuffer();
    } catch (sharpErr) {
      console.warn("Sharp compression fallback:", sharpErr);
    }

    const base64DataUrl = `data:image/jpeg;base64,${buffer.toString("base64")}`;

    // Sanitize filename
    const originalName = file.name || "jersey_photo.jpg";
    const extension = path.extname(originalName) || ".jpg";
    const baseName = path
      .basename(originalName, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .slice(0, 30);

    const fileName = `kit_${Date.now()}_${baseName}${extension}`;

    // Attempt saving to local filesystem if available (development)
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${fileName}`,
        fileName,
        size: file.size,
      });
    } catch (fsErr) {
      // In serverless / read-only runtimes (e.g. Vercel Lambda), return the Base64 Data URL directly
      console.log("Serverless read-only filesystem detected, serving Base64 Data URL:", fsErr);
      return NextResponse.json({
        success: true,
        url: base64DataUrl,
        fileName,
        size: file.size,
      });
    }
  } catch (error: any) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process uploaded image" },
      { status: 500 }
    );
  }
}
