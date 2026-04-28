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

      <style jsx>{`
        .gallery-container {
          padding: 120px 20px;
          max-width: 1200px;
          margin: 0 auto;
          color: white;
        }
        .gallery-header {
          text-align: center;
          margin-bottom: 60px;
        }
        .gallery-title {
          font-size: 3.5rem;
          margin-bottom: 15px;
          background: linear-gradient(to right, #ff6fae, #b68cff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
        }
        .gallery-card {
          padding: 10px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .gallery-card:hover {
          transform: scale(1.03);
          box-shadow: 0 10px 30px rgba(255, 111, 174, 0.3);
        }
        .image-wrapper {
          position: relative;
          width: 100%;
          padding-top: 100%; /* 1:1 Aspect Ratio */
          overflow: hidden;
          border-radius: 8px;
        }
        .image-wrapper img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .gallery-card:hover img {
          transform: scale(1.1);
        }
        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 20px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .gallery-card:hover .overlay {
          opacity: 1;
        }
        .overlay p {
          font-weight: bold;
          font-size: 1.1rem;
          margin-bottom: 5px;
        }
        .overlay span {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #ff6fae;
        }
      `}</style>
    </div>
  );
}
