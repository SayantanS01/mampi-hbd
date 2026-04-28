import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { db } from "@/db";
import { siteConfig } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/music folder
    const filename = `bg-music-${Date.now()}.mp3`;
    const uploadDir = path.join(process.cwd(), "public", "music");
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    const publicUrl = `/music/${filename}`;

    // Update site config with new music URL
    const existing = await db.select().from(siteConfig).limit(1);
    if (existing.length > 0) {
      await db.update(siteConfig).set({ musicUrl: publicUrl }).where(eq(siteConfig.id, existing[0].id));
    } else {
      await db.insert(siteConfig).values({ musicUrl: publicUrl });
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin");

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
