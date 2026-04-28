"use client";

import { useEffect, useRef, useState } from "react";

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!gameStarted || gameOver || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;
    let hearts: any[] = [];
    let playerX = canvas.width / 2;

    const spawnHeart = () => {
      hearts.push({
        x: Math.random() * (canvas.width - 30) + 15,
        y: -20,
        speed: 2 + Math.random() * 3,
        size: 15 + Math.random() * 15,
      });
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn hearts
      if (Math.random() < 0.05) spawnHeart();

      // Draw & Update Hearts
      hearts.forEach((h, i) => {
        h.y += h.speed;
        
        // Draw heart shape
        ctx.fillStyle = "#ff6fae";
        ctx.beginPath();
        const topCurveHeight = h.size * 0.3;
        ctx.moveTo(h.x, h.y + topCurveHeight);
        ctx.bezierCurveTo(h.x, h.y, h.x - h.size / 2, h.y, h.x - h.size / 2, h.y + topCurveHeight);
        ctx.bezierCurveTo(h.x - h.size / 2, h.y + (h.size + topCurveHeight) / 2, h.x, h.y + (h.size + topCurveHeight) / 2, h.x, h.y + h.size);
        ctx.bezierCurveTo(h.x, h.y + (h.size + topCurveHeight) / 2, h.x + h.size / 2, h.y + (h.size + topCurveHeight) / 2, h.x + h.size / 2, h.y + topCurveHeight);
        ctx.bezierCurveTo(h.x + h.size / 2, h.y, h.x, h.y, h.x, h.y + topCurveHeight);
        ctx.fill();

        // Collision check
        if (h.y + h.size > canvas.height - 40 && Math.abs(h.x - playerX) < 40) {
          setScore(s => s + 1);
          hearts.splice(i, 1);
        } else if (h.y > canvas.height) {
          hearts.splice(i, 1);
        }
      });

      // Draw Player (Catcher)
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.beginPath();
      ctx.roundRect(playerX - 40, canvas.height - 30, 80, 20, 10);
      ctx.fill();

      animationFrame = requestAnimationFrame(update);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      playerX = e.clientX - rect.left;
      if (playerX < 40) playerX = 40;
      if (playerX > canvas.width - 40) playerX = canvas.width - 40;
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrame = requestAnimationFrame(update);

    // Timer for game over
    const gameTimer = setTimeout(() => {
      setGameOver(true);
    }, 30000);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(gameTimer);
    };
  }, [gameStarted, gameOver]);

  return (
    <div className="game-container">
      <div className="game-box glass-panel">
        {!gameStarted ? (
          <div className="game-overlay">
            <h1>Catch the Love Hearts 💕</h1>
            <p>Catch as many falling hearts as you can in 30 seconds!</p>
            <button onClick={() => setGameStarted(true)}>Start Game</button>
          </div>
        ) : gameOver ? (
          <div className="game-overlay">
            <h1>Game Over!</h1>
            <p>You caught {score} hearts for Mampi!</p>
            <button onClick={() => { setGameStarted(true); setGameOver(false); setScore(0); }}>Play Again</button>
          </div>
        ) : (
          <>
            <div className="game-ui">
              <span>Score: {score}</span>
              <span>Keep catching!</span>
            </div>
            <canvas ref={canvasRef} width={600} height={400} />
          </>
        )}
      </div>

      <style jsx>{`
        .game-container {
          padding: 150px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        .game-box {
          position: relative;
          width: 600px;
          height: 400px;
          background: rgba(0, 0, 0, 0.4);
          overflow: hidden;
        }
        canvas {
          display: block;
        }
        .game-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: white;
          padding: 40px;
          background: rgba(0, 0, 0, 0.6);
          z-index: 10;
        }
        .game-overlay h1 {
          font-size: 2.5rem;
          margin-bottom: 20px;
          color: #ff6fae;
        }
        .game-overlay p {
          margin-bottom: 30px;
          font-size: 1.2rem;
        }
        .game-overlay button {
          padding: 15px 30px;
          font-size: 1.1rem;
          background: #ff6fae;
          border: none;
          color: white;
          border-radius: 30px;
          cursor: pointer;
          font-weight: bold;
          transition: transform 0.2s ease;
        }
        .game-overlay button:hover {
          transform: scale(1.1);
        }
        .game-ui {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          display: flex;
          justify-content: space-between;
          color: white;
          font-weight: bold;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
