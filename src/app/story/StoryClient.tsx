"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StoryClient({ milestones }: { milestones: any[] }) {
  return (
    <main className="page story-page">
      <section className="page-hero compact-hero">
        <p className="eyebrow">Chapter by chapter</p>
        <h1>Our Love Story</h1>
        <p>A soft timeline of how you became my favorite person, my happiness, and the dream I never want to wake up from.</p>
      </section>

      <section className="story-timeline" aria-label="Love story timeline">
        {milestones.map((m, index) => (
          <article className="timeline-item reveal-card" key={m.id} style={{ "--delay": `${index * 0.16}s` } as React.CSSProperties}>
            <div className="timeline-marker">
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="timeline-content glass-panel">
              <p className="timeline-accent">{m.date}</p>
              <h2>{m.title}</h2>
              <p>{m.description}</p>
              {m.imageUrl && (
                <img src={m.imageUrl ?? ""} alt={m.title} className="milestone-image shadow-lg" />
              )}
              <div className="memory-thread" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="story-ending glass-panel">
        <span aria-hidden="true">💖</span>
        <h2>And the story is still becoming more beautiful…</h2>
        <p>Today is your birthday, but somehow I feel like I am the one who received the gift — because life gave me you.</p>
      </section>
    </main>
  );
}
