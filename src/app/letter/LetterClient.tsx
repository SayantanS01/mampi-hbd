"use client";

import { useEffect, useState } from "react";

export default function LetterClient({ paragraphs }: { paragraphs: any[] }) {
  const [visibleIndex, setVisibleIndex] = useState(-1);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleIndex(prev => {
        if (prev < paragraphs.length - 1) return prev + 1;
        clearInterval(timer);
        return prev;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [paragraphs]);

  return (
    <div className="letter-container">
      <div className="letter-paper glass-panel">
        <div className="letter-wax-seal">M</div>
        
        {paragraphs.map((p, index) => (
          <p key={p.id} className={`letter-paragraph ${index <= visibleIndex ? "is-visible" : ""}`}>
            {p.paragraph}
          </p>
        ))}

        <div className={`letter-signature ${visibleIndex === paragraphs.length - 1 ? "is-visible" : ""}`}>
          ❤️
        </div>
      </div>
    </div>
  );
}
