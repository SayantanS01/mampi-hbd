import { db } from "@/db";
import { galleryItems } from "@/db/schema";
import { asc } from "drizzle-orm";

import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  let items = [];
  
  try {
    items = await db.select().from(galleryItems).orderBy(asc(galleryItems.order));
  } catch (error) {
    console.error("Failed to fetch gallery items:", error);
    // Fallback
    items = [
      { id: 1, title: "Memory 01", imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7", caption: "Every smile is a treasure", category: "special" },
      { id: 2, title: "Memory 02", imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f", caption: "Exploring the world together", category: "travel" },
      { id: 3, title: "Memory 03", imageUrl: "https://images.unsplash.com/photo-1522673607200-164883eecd18", caption: "Peace is found in your presence", category: "general" },
      { id: 4, title: "Memory 04", imageUrl: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47", caption: "Warmth of your hand in mine", category: "special" },
      { id: 5, title: "Memory 05", imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa3386c946", caption: "The day felt like a dream", category: "travel" },
      { id: 6, title: "Memory 06", imageUrl: "https://images.unsplash.com/photo-1464347744102-11db6282f854", caption: "Forever starting today", category: "general" },
    ];
  }

  return <GalleryClient items={items} />;
}
