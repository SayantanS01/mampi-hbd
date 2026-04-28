import { db } from "@/db";
import { galleryItems } from "@/db/schema";
import { asc } from "drizzle-orm";

import GalleryClient from "./GalleryClient";

export default async function GalleryPage() {
  let items = [];
  
  try {
    items = await db.select().from(galleryItems).orderBy(asc(galleryItems.order));
  } catch (error) {
    console.error("Failed to fetch gallery items:", error);
    // Fallback
    items = [
      { id: 1, title: "Sweet Moments", imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7", caption: "Every smile is a treasure", category: "special" },
      { id: 2, title: "Beautiful Days", imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f", caption: "Exploring the world together", category: "travel" },
      { id: 3, title: "Quiet Evenings", imageUrl: "https://images.unsplash.com/photo-1522673607200-164883eecd18", caption: "Peace is found in your presence", category: "general" },
    ];
  }

  return <GalleryClient items={items} />;
}
