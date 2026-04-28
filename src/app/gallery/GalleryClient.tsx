"use client";

import { useState } from "react";
import type { CSSProperties, MouseEvent } from "react";

function tiltCard(event: MouseEvent<HTMLButtonElement>) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const rotateY = ((x / rect.width) - 0.5) * 13;
  const rotateX = (0.5 - y / rect.height) * 13;
  card.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
  card.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
}

function resetTilt(event: MouseEvent<HTMLButtonElement>) {
  event.currentTarget.style.setProperty("--tilt-x", "0deg");
  event.currentTarget.style.setProperty("--tilt-y", "0deg");
}

export default function GalleryClient({ items }: { items: any[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex === null ? null : items[selectedIndex];

  return (
    <main className="page gallery-page">
      <section className="page-hero compact-hero">
        <p className="eyebrow">A little museum of us</p>
        <h1>Memory Gallery</h1>
        <p>Tap any floating polaroid to open it. Every card is a memory we share.</p>
      </section>

      <section className="gallery-grid" aria-label="Photo placeholders">
        {items.map((item, index) => (
          <button
            className="polaroid-card"
            key={item.id}
            onClick={() => setSelectedIndex(index)}
            onMouseLeave={resetTilt}
            onMouseMove={tiltCard}
            style={{ 
              "--photo-gradient": "linear-gradient(135deg, #ffd6e8, #c8a8ff)", 
              "--tilt-x": "0deg", 
              "--tilt-y": "0deg" 
            } as CSSProperties}
            type="button"
          >
            <span className="photo-placeholder" role="img" aria-label={`${item.title} photo`}>
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <span className="photo-shine" />
                  <strong>{index + 1}</strong>
                </>
              )}
            </span>
            <span className="polaroid-caption">
              <strong>{item.title}</strong>
              <small>{item.caption}</small>
            </span>
          </button>
        ))}
      </section>

      {selected ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${selected.title} preview`} onClick={() => setSelectedIndex(null)}>
          <div className="lightbox-card" onClick={(event) => event.stopPropagation()} style={{ "--photo-gradient": "linear-gradient(135deg, #ffd6e8, #c8a8ff)" } as CSSProperties}>
            <button className="lightbox-close" onClick={() => setSelectedIndex(null)} type="button" aria-label="Close gallery preview">
              ×
            </button>
            <div className="lightbox-photo">
              {selected.imageUrl ? (
                <img src={selected.imageUrl} alt={selected.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <span>Photo Placeholder</span>
              )}
            </div>
            <h2>{selected.title}</h2>
            <p>{selected.caption}</p>
          </div>
        </div>
      ) : null}
    </main>
  );
}
