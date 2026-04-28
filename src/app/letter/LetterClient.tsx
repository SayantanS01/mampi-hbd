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

      <style jsx>{`
        .letter-container {
          padding: 150px 20px;
          display: flex;
          justify-content: center;
          color: white;
          min-height: 100vh;
        }
        .letter-paper {
          max-width: 700px;
          width: 100%;
          padding: 60px;
          position: relative;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .letter-wax-seal {
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 50px;
          background: #ff6fae;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: serif;
          font-weight: bold;
          font-size: 1.5rem;
          box-shadow: 0 4px 15px rgba(255, 111, 174, 0.5);
        }
        .letter-paragraph {
          font-size: 1.2rem;
          line-height: 1.8;
          margin-bottom: 25px;
          opacity: 0;
          transform: translateY(10px);
          transition: all 1s ease;
          font-family: "Georgia", serif;
          font-style: italic;
        }
        .letter-paragraph.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .letter-signature {
          text-align: center;
          font-size: 2rem;
          margin-top: 40px;
          opacity: 0;
          transition: opacity 2s ease;
        }
        .letter-signature.is-visible {
          opacity: 1;
        }

        @media (max-width: 600px) {
          .letter-paper {
            padding: 30px;
          }
          .letter-paragraph {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}
