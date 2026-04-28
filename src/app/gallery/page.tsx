import { db } from "@/db";
import { galleryItems } from "@/db/schema";
import { asc } from "drizzle-orm";

export default async function GalleryPage() {
  let items = [];
  
  try {
    items = await db.select().from(galleryItems).orderBy(asc(galleryItems.order));
  } catch (error) {
    console.error("Failed to fetch gallery items:", error);
    // Fallback
    items = [
      { id: 1, imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7", caption: "Sweet Moments", category: "special" },
      { id: 2, imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f", caption: "Paris Memories", category: "travel" },
      { id: 3, imageUrl: "https://images.unsplash.com/photo-1522673607200-164883eecd18", caption: "Quiet Evenings", category: "general" },
    ];
  }

  return (
    <div className="gallery-container">
      <header className="gallery-header">
        <h1 className="gallery-title">Memories of Us</h1>
        <p className="gallery-subtitle">A collection of moments that mean the world to me.</p>
      </header>

      <div className="gallery-grid">
        {items.map((item) => (
          <div key={item.id} className="gallery-card glass-panel">
            <div className="image-wrapper">
              <img src={item.imageUrl} alt={item.caption} />
              <div className="overlay">
                <p>{item.caption}</p>
                <span>{item.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
