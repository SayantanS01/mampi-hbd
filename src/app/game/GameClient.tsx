"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import type { CSSProperties } from "react";

// --- Game 1: Catch My Love ---
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
const catchGoal = 15;

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

// --- Game 2: Memory of Us ---
const memoryPairs = ["🌹", "💍", "🕊️", "🥂", "🧸", "💌", "🌟", "🔥"];
const shuffle = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

// --- Game 3: Find My Hidden Love ---
const hiddenHeartCount = 10;

export default function GameClient({ config }: { config: any }) {
  const [activeGame, setActiveGame] = useState<number | null>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "won">("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameSeconds);

  // Game 1 State
  const [fallingHearts, setFallingHearts] = useState<FallingHeart[]>([]);

  // Game 2 State
  const [cards, setCards] = useState<{ id: number; symbol: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);

  // Game 3 State
  const [hiddenHearts, setHiddenHearts] = useState<{ id: number; x: number; y: number; found: boolean }[]>([]);

  const resetGame = () => {
    setGameState("idle");
    setScore(0);
    setTimeLeft(gameSeconds);
    setFallingHearts([]);
    setCards([]);
    setFlippedIndices([]);
    setHiddenHearts([]);
  };

  const startGame = (gameId: number) => {
    resetGame();
    setActiveGame(gameId);
    setGameState("playing");

    if (gameId === 2) {
      const deck = shuffle([...memoryPairs, ...memoryPairs]).map((symbol, i) => ({
        id: i,
        symbol,
        flipped: false,
        matched: false,
      }));
      setCards(deck);
    } else if (gameId === 3) {
      const hearts = Array.from({ length: hiddenHeartCount }).map((_, i) => ({
        id: i,
        found: false,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
      }));
      setHiddenHearts(hearts);
    }
  };

  // --- Logic for Game 1 ---
  useEffect(() => {
    if (activeGame !== 1 || gameState !== "playing") return;
    const spawner = setInterval(() => {
      setFallingHearts(prev => [...prev.slice(-20), createHeart()]);
    }, 430);
    const gravity = setInterval(() => {
      setFallingHearts(prev => prev.map(h => ({ ...h, top: h.top + h.speed })).filter(h => h.top < 110));
    }, 48);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState("won");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(spawner);
      clearInterval(gravity);
      clearInterval(timer);
    };
  }, [activeGame, gameState]);

  // --- Logic for Game 2 ---
  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].flipped || cards[index].matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].symbol === cards[second].symbol) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setFlippedIndices([]);
        if (newCards.every(c => c.matched)) setGameState("won");
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards(newCards);
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  // --- Logic for Game 3 ---
  const handleFoundHeart = (id: number) => {
    setHiddenHearts(prev => {
      const next = prev.map(h => h.id === id ? { ...h, found: true } : h);
      if (next.every(h => h.found)) setGameState("won");
      return next;
    });
    setScore(s => s + 1);
  };

  return (
    <main className="page game-page">
      <section className="page-hero compact-hero">
        <p className="eyebrow">The Gaming Pavilion</p>
        <h1>Play for My Heart</h1>
        <p>I built these games to show you how much you mean to me. Choose a challenge, Mampi!</p>
      </section>

      {!activeGame ? (
        <section className="game-selection-grid">
          <div className="game-card glass-panel" onClick={() => startGame(1)}>
            <div className="game-icon">💕</div>
            <h3>Catch My Love</h3>
            <p>Hearts are falling just like my feelings for you.</p>
            <button className="primary-action">Play Now</button>
          </div>
          <div className="game-card glass-panel" onClick={() => startGame(2)}>
            <div className="game-icon">💖</div>
            <h3>Memory of Us</h3>
            <p>Match the symbols of our love story.</p>
            <button className="primary-action">Play Now</button>
          </div>
          <div className="game-card glass-panel" onClick={() => startGame(3)}>
            <div className="game-icon">💌</div>
            <h3>Find My Hidden Love</h3>
            <p>Can you find all the love hidden in this world?</p>
            <button className="primary-action">Play Now</button>
          </div>
        </section>
      ) : (
        <section className="game-stage glass-panel">
          <div className="game-header">
            <button className="back-btn" onClick={() => setActiveGame(null)}>← Back to Hub</button>
            <div className="game-title-row">
              <h2>{activeGame === 1 ? "Catch My Love 💕" : activeGame === 2 ? "Memory of Us 💖" : "Find My Hidden Love 💌"}</h2>
            </div>
            {gameState === "playing" && (
               <div className="game-timer">
                 {activeGame === 1 ? `Time: ${timeLeft}s | Score: ${score}` : activeGame === 3 ? `Found: ${score}/${hiddenHeartCount}` : "Find the pairs!"}
               </div>
            )}
          </div>

          <div className="game-content-area">
            {gameState === "idle" && <p>Ready to start?</p>}
            
            {gameState === "playing" && activeGame === 1 && (
              <div className="game-arena">
                {fallingHearts.map(h => (
                  <button key={h.id} className="falling-heart" onClick={() => { setScore(s => s + 1); setFallingHearts(p => p.filter(x => x.id !== h.id)) }} style={{ left: `${h.left}%`, top: `${h.top}%`, fontSize: `${h.size}px`, "--heart-spin": `${h.spin}deg` } as any}>
                    {h.emoji}
                  </button>
                ))}
              </div>
            )}

            {gameState === "playing" && activeGame === 2 && (
              <div className="memory-grid">
                {cards.map((card, i) => (
                  <div key={card.id} className={`memory-card ${card.flipped || card.matched ? "is-flipped" : ""}`} onClick={() => handleCardClick(i)}>
                    <div className="card-inner">
                      <div className="card-front">?</div>
                      <div className="card-back">{card.symbol}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {gameState === "playing" && activeGame === 3 && (
              <div className="hidden-arena">
                <p className="arena-hint">Find {hiddenHeartCount} hidden hearts in the nebula...</p>
                {hiddenHearts.map(h => !h.found && (
                  <button key={h.id} className="hidden-heart" onClick={() => handleFoundHeart(h.id)} style={{ left: `${h.x}%`, top: `${h.y}%` }}>
                    ❤️
                  </button>
                ))}
              </div>
            )}

            {gameState === "won" && (
              <div className="win-screen">
                <div className="win-icon">🏆</div>
                <h2>Congratulations!</h2>
                <p>{activeGame === 1 ? config.gameWinningMessage : activeGame === 2 ? "You remember us perfectly… just like I remember every moment with you ❤️" : "You found all the hidden love… just like you found your way into my heart ❤️"}</p>
                <button className="primary-action" onClick={() => setActiveGame(null)}>Finish Games</button>
              </div>
            )}
          </div>
        </section>
      )}

    </main>
  );
}
