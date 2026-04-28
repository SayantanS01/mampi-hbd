"use client";

import { useEffect, useMemo, useState } from "react";

export default function LetterClient({ paragraphs }: { paragraphs: any[] }) {
  const content = paragraphs.map(p => p.paragraph).join("\n\n");
  const [visibleCount, setVisibleCount] = useState(0);
  const [runId, setRunId] = useState(0);
  const visibleLetter = useMemo(() => content.slice(0, visibleCount), [visibleCount, content]);
  const complete = visibleCount >= content.length;

  useEffect(() => {
    setVisibleCount(0);
    const interval = window.setInterval(() => {
      setVisibleCount((current) => {
        if (current >= content.length) {
          window.clearInterval(interval);
          return current;
        }
        return current + 1;
      });
    }, 24);

    return () => window.clearInterval(interval);
  }, [runId, content]);

  return (
    <main className="page letter-page">
      <section className="page-hero compact-hero">
        <p className="eyebrow">A letter from my heart</p>
        <h1>For Mampi</h1>
        <p>Let the words appear slowly, like a heartbeat learning how to say forever.</p>
      </section>

      <section className="letter-stage" aria-label="Typewriter love letter">
        <div className="letter-glow" aria-hidden="true" />
        <article className="letter-card glass-panel">
          <div className="letter-stamp">💌</div>
          <pre className="typewriter-text">
            <span>{visibleLetter}</span>
            <span className={`typewriter-cursor ${complete ? "is-soft" : ""}`} aria-hidden="true">
              |
            </span>
          </pre>
          <div className="letter-actions">
            <button className="secondary-action" onClick={() => setRunId((id) => id + 1)} type="button">
              Read Again ✨
            </button>
          </div>
        </article>
      </section>
    </main>
  );
}
