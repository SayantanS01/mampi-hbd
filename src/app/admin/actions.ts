"use server";

import { db } from "@/db";
import { siteConfig, milestones, galleryItems, letterContent } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Site Config
export async function updateSiteConfig(data: any) {
  const { id, updatedAt, ...updateData } = data;
  const existing = await db.select().from(siteConfig).limit(1);
  if (existing.length > 0) {
    await db.update(siteConfig).set(updateData).where(eq(siteConfig.id, existing[0].id));
  } else {
    await db.insert(siteConfig).values(updateData);
  }
  revalidatePath("/", "layout");
}

// Milestones
export async function addMilestone(data: any) {
  await db.insert(milestones).values(data);
  revalidatePath("/story", "layout");
}

export async function deleteMilestone(id: number) {
  await db.delete(milestones).where(eq(milestones.id, id));
  revalidatePath("/story");
}

// Gallery
export async function addGalleryItem(data: any) {
  await db.insert(galleryItems).values(data);
  revalidatePath("/gallery");
}

export async function deleteGalleryItem(id: number) {
  await db.delete(galleryItems).where(eq(galleryItems.id, id));
  revalidatePath("/gallery");
}

// Letter
export async function updateLetter(paragraphs: string[]) {
  await db.delete(letterContent);
  const values = paragraphs.map((p, i) => ({ paragraph: p, order: i }));
  if (values.length > 0) {
    await db.insert(letterContent).values(values);
  }
  revalidatePath("/letter");
}
