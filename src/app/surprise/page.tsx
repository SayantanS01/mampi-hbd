"use client";

import { useState } from "react";
import confetti from "canvas-confetti";

export default function SurprisePage() {
  const [step, setStep] = useState(0);
  const [answered, setAnswered] = useState(false);

  const handleYes = () => {
    setAnswered(true);
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // Also trigger music swell if ExperienceShell is listening
    window.dispatchEvent(new CustomEvent("mampi:music-swell"));
  };

  return (
    <div className="surprise-container">
      {!answered ? (
        <div className="surprise-box glass-panel">
          {step === 0 && (
            <div className="step">
              <h2>Wait... there&apos;s one more thing. 🎁</h2>
              <p>You&apos;ve seen our story, our memories, and read my heart.</p>
              <button onClick={() => setStep(1)}>What is it? ✨</button>
            </div>
          )}

          {step === 1 && (
            <div className="step">
              <h2>Mampi Biswas...</h2>
              <p>Every day with you is a gift I never expected, and a joy I never want to lose.</p>
              <button onClick={() => setStep(2)}>Continue... ❤️</button>
            </div>
          )}

          {step === 2 && (
            <div className="step proposal">
              <div className="ring-icon">💍</div>
              <h2>Will you make me the happiest person in the world?</h2>
              <p>Will you stay by my side, today, tomorrow, and forever?</p>
              <div className="actions">
                <button className="yes-btn" onClick={handleYes}>YES! A thousand times yes! ❤️</button>
                <button className="no-btn" onMouseEnter={(e: any) => {
                  e.target.style.position = 'absolute';
                  e.target.style.top = Math.random() * 80 + '%';
                  e.target.style.left = Math.random() * 80 + '%';
                }}>No (Wait, catch me!)</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="celebration">
          <h1 className="celebration-title">SHE SAID YES! 🎉</h1>
          <div className="heart-rain">
            {[...Array(20)].map((_, i) => (
              <span key={i} className="floating-heart" style={{
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                fontSize: Math.random() * 30 + 20 + 'px'
              }}>❤️</span>
            ))}
          </div>
          <p className="celebration-note">Happy Birthday, my forever. I love you, Mampi. ❤️</p>
        </div>
      )}

      <style jsx>{`
        .surprise-container {
          padding: 100px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          overflow: hidden;
        }
        .surprise-box {
          max-width: 600px;
          width: 100%;
          padding: 60px;
          text-align: center;
          color: white;
        }
        .step h2 {
          font-size: 2.2rem;
          margin-bottom: 20px;
        }
        .step p {
          font-size: 1.2rem;
          margin-bottom: 40px;
          opacity: 0.9;
        }
        .step button {
          padding: 15px 40px;
          font-size: 1.1rem;
          background: #ff6fae;
          border: none;
          color: white;
          border-radius: 30px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        .step button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(255, 111, 174, 0.5);
        }
        .proposal .ring-icon {
          font-size: 5rem;
          margin-bottom: 20px;
          display: block;
          animation: float 3s ease-in-out infinite;
        }
        .proposal .actions {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-top: 20px;
          position: relative;
          min-height: 100px;
        }
        .yes-btn {
          background: #ff4d94 !important;
        }
        .no-btn {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }
        
        .celebration {
          text-align: center;
          color: white;
          z-index: 5;
        }
        .celebration-title {
          font-size: 5rem;
          margin-bottom: 20px;
          background: linear-gradient(to right, #ff6fae, #ff4d94, #ff6fae);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: rainbow 5s linear infinite;
        }
        .celebration-note {
          font-size: 1.5rem;
          font-style: italic;
        }

        .heart-rain {
          position: fixed;
          inset: 0;
          pointer-events: none;
        }
        .floating-heart {
          position: absolute;
          bottom: -50px;
          animation: floatUp 6s linear infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes floatUp {
          to { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes rainbow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }

        @media (max-width: 600px) {
          .celebration-title { font-size: 3rem; }
          .surprise-box { padding: 30px; }
        }
      `}</style>
    </div>
  );
}
