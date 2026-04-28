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

    </div>
  );
}
