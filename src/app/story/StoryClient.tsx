"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StoryClient({ milestones }: { milestones: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const items = containerRef.current.querySelectorAll(".milestone-item");
    
    items.forEach((item, index) => {
      const isEven = index % 2 === 0;
      
      gsap.fromTo(item, 
        { 
          opacity: 0, 
          x: isEven ? -100 : 100 
        }, 
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            end: "top 20%",
            scrub: true,
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [milestones]);

  return (
    <div className="story-container" ref={containerRef}>
      <header className="story-header">
        <h1 className="story-title">Our Love Story</h1>
        <p className="story-subtitle">Every moment with you is a treasure I keep forever.</p>
      </header>

      <div className="timeline">
        <div className="timeline-line"></div>
        {milestones.map((m, index) => (
          <div key={m.id} className={`milestone-item ${index % 2 === 0 ? "left" : "right"}`}>
            <div className="milestone-content glass-panel">
              <span className="milestone-date">{m.date}</span>
              <h3 className="milestone-title">{m.title}</h3>
              <p className="milestone-desc">{m.description}</p>
              {m.imageUrl && <img src={m.imageUrl} alt={m.title} className="milestone-image" />}
            </div>
            <div className="milestone-dot"></div>
          </div>
        ))}
      </div>

    </div>
  );
}
