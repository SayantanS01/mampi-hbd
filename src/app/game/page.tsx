"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

type FallingHeart = {
  emoji: string;
  id: number;
  left: number;
  size: number;
  speed: number;
  spin: number;
  top: number;
};

const heartEmojis = ["💖", "💕", "💗", "💘", "❤️", "💝"];
const gameSeconds = 30;
const goalScore = 15;
const winningMessage = "You caught my heart… just like in real life ❤️";

function createHeart(): FallingHeart {
  return {
    emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
    id: Math.floor(Date.now() + Math.random() * 100_000),
    left: 5 + Math.random() * 90,
    size: 28 + Math.random() * 22,
    speed: 1.3 + Math.random() * 1.65,
    spin: -20 + Math.random() * 40,
    top: -12,
  };
}

function submitScore(score: number) {
  void fetch("/api/celebration", {
    body: JSON.stringify({ score, source: "catch-the-love-hearts" }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  }).catch(() => undefined);
}

export default function GamePage() {
  const [hearts, setHearts] = useState<FallingHeart[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameSeconds);
  const [running, setRunning] = useState(false);
  const [played, setPlayed] = useState(false);
  const [message, setMessage] = useState("Catch 15 hearts before the timer ends.");

  const startGame = () => {
    setHearts([]);
    setScore(0);
    setTimeLeft(gameSeconds);
    setMessage("Catch the falling love hearts, Mampi! 💕");
    setPlayed(true);
    setRunning(true);
  };

  const collectHeart = (id: number) => {
    if (!running) {
      return;
    }

    setHearts((current) => current.filter((heart) => heart.id !== id));
    setScore((current) => {
      const nextScore = current + 1;
      if (nextScore >= goalScore) {
        setRunning(false);
        setHearts([]);
        setMessage(winningMessage);
        submitScore(nextScore);
      }
      return nextScore;
    });
  };

  useEffect(() => {
    if (!running) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (!running) {
      return undefined;
    }

    const spawner = window.setInterval(() => {
      setHearts((current) => [...current.slice(-20), createHeart()]);
    }, 430);

    const gravity = window.setInterval(() => {
      setHearts((current) => current.map((heart) => ({ ...heart, top: heart.top + heart.speed })).filter((heart) => heart.top < 112));
    }, 48);

    return () => {
      window.clearInterval(spawner);
      window.clearInterval(gravity);
    };
  }, [running]);

  useEffect(() => {
    if (running && timeLeft === 0) {
      setRunning(false);
      setHearts([]);
      if (score > 0) {
        setMessage(winningMessage);
        submitScore(score);
      } else {
        setMessage("Even if you missed them, my heart has already chosen you ❤️");
      }
    }
  }, [running, score, timeLeft]);

  return (
    <main className="page game-page">
      <section className="page-hero compact-hero">
        <p className="eyebrow">A tiny love game</p>
        <h1>Catch the Love Hearts 💕</h1>
        <p>Click the falling hearts before they drift away. Every collected heart is one more little promise for Mampi.</p>
      </section>

      <section className="game-panel glass-panel" aria-label="Catch the Love Hearts game">
        <div className="game-stats">
          <div>
            <span>Score</span>
            <strong>{score}</strong>
          </div>
          <div>
            <span>Timer</span>
            <strong>{timeLeft}s</strong>
          </div>
          <div>
            <span>Goal</span>
            <strong>{goalScore}</strong>
          </div>
        </div>

        <div className={`game-arena ${running ? "is-running" : ""}`}>
          {hearts.map((heart) => (
            <button
              aria-label="Catch love heart"
              className="falling-heart"
              key={heart.id}
              onClick={() => collectHeart(heart.id)}
              style={
                {
                  "--heart-spin": `${heart.spin}deg`,
                  fontSize: `${heart.size}px`,
                  left: `${heart.left}%`,
                  top: `${heart.top}%`,
                } as CSSProperties
              }
              type="button"
            >
              {heart.emoji}
            </button>
          ))}

          {!running ? (
            <div className="game-overlay">
              <p aria-live="polite">{message}</p>
              <button className="primary-action" onClick={startGame} type="button">
                {played ? "Play Again 💗" : "Start Game 💕"}
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
