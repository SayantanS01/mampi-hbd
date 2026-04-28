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

      <style jsx>{`
        .story-container {
          padding: 120px 20px;
          max-width: 1000px;
          margin: 0 auto;
          color: white;
        }
        .story-header {
          text-align: center;
          margin-bottom: 80px;
        }
        .story-title {
          font-size: 3.5rem;
          margin-bottom: 15px;
          background: linear-gradient(to right, #ff6fae, #b68cff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .story-subtitle {
          font-size: 1.2rem;
          opacity: 0.8;
        }
        .timeline {
          position: relative;
          padding: 40px 0;
        }
        .timeline-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.3), transparent);
          transform: translateX(-50%);
        }
        .milestone-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 100px;
          width: 100%;
          position: relative;
        }
        .milestone-content {
          width: 45%;
          padding: 30px;
          position: relative;
        }
        .milestone-item.right {
          flex-direction: row-reverse;
        }
        .milestone-dot {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 16px;
          height: 16px;
          background: #ff6fae;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 15px #ff6fae;
          z-index: 2;
        }
        .milestone-date {
          display: block;
          font-weight: bold;
          color: #ff6fae;
          margin-bottom: 10px;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .milestone-title {
          font-size: 1.8rem;
          margin-bottom: 15px;
        }
        .milestone-desc {
          line-height: 1.6;
          opacity: 0.9;
        }
        .milestone-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 10px;
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .timeline-line {
            left: 20px;
          }
          .milestone-item {
            justify-content: flex-start;
            padding-left: 50px;
          }
          .milestone-item.right {
            flex-direction: row;
          }
          .milestone-content {
            width: 100%;
          }
          .milestone-dot {
            left: 20px;
          }
        }
      `}</style>
    </div>
  );
}
