"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

type RevealState = "waiting" | "building" | "revealed";
type CelebrationState = "none" | "yes" | "forever";

const confettiPieces = Array.from({ length: 96 }, (_, index) => ({
  delay: ((index * 47) % 900) / 1000,
  hue: (index * 29) % 360,
  id: index,
  rotation: (index * 71) % 360,
  size: 7 + ((index * 13) % 12),
  x: ((index * 37) % 121) - 60,
  y: -18 - ((index * 19) % 70),
}));

function sendAnswer(answer: "yes" | "forever") {
  void fetch("/api/celebration", {
    body: JSON.stringify({ answer, source: "proposal-page" }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  }).catch(() => undefined);
}

export default function SurpriseClient({ config }: { config: any }) {
  const [revealState, setRevealState] = useState<RevealState>("waiting");
  const [celebration, setCelebration] = useState<CelebrationState>("none");
  const [burstId, setBurstId] = useState(0);

  const startSurprise = () => {
    window.dispatchEvent(new Event("mampi:music-swell"));
    setRevealState("building");
    setCelebration("none");
    setBurstId((current) => current + 1);
    window.setTimeout(() => setRevealState("revealed"), 1750);
  };

  const answerProposal = (answer: "yes" | "forever") => {
    window.dispatchEvent(new Event("mampi:music-swell"));
    setCelebration(answer);
    setBurstId((current) => current + 1);
    sendAnswer(answer);
  };

  return (
    <main className={`page surprise-page reveal-${revealState} celebration-${celebration}`}>
      <section className="page-hero compact-hero">
        <p className="eyebrow">The secret ending</p>
        <h1>Surprise for Mampi</h1>
        <p>One click opens the moment this whole birthday world has been leading toward.</p>
      </section>

      <section className="surprise-stage glass-panel" aria-label="Proposal surprise">
        {revealState !== "waiting" ? (
          <div className="confetti-field" key={burstId} aria-hidden="true">
            {confettiPieces.map((piece) => (
              <span
                className="confetti-piece"
                key={piece.id}
                style={
                  {
                    "--confetti-delay": `${piece.delay}s`,
                    "--confetti-hue": piece.hue,
                    "--confetti-rotation": `${piece.rotation}deg`,
                    "--confetti-size": `${piece.size}px`,
                    "--confetti-x": `${piece.x}vw`,
                    "--confetti-y": `${piece.y}vh`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        ) : null}

        {revealState === "waiting" ? (
          <div className="surprise-prelude">
            <div className="secret-lock" aria-hidden="true">💝</div>
            <h2>{config.surprisePrelude}</h2>
            <p>When you are ready, open the secret. The page will darken, the music will rise, and my heart will say what it has been holding.</p>
            <button className="hidden-surprise-button" onClick={startSurprise} type="button">
              Click for a surprise
            </button>
          </div>
        ) : null}

        {revealState === "building" ? (
          <div className="surprise-build" aria-live="polite">
            <div className="pulse-ring" />
            <div className="pulse-ring delay-one" />
            <div className="pulse-ring delay-two" />
            <p>Something beautiful is opening…</p>
          </div>
        ) : null}

        {revealState === "revealed" ? (
          <article className="proposal-card">
            <div className="proposal-glow" aria-hidden="true" />
            <p className="proposal-kicker">My forever question</p>
            <pre className="proposal-text">{config.surpriseQuestion}</pre>
            <div className="proposal-actions" aria-label="Proposal answers">
              <button className="yes-button" onClick={() => answerProposal("yes")} type="button">
                YES 💍
              </button>
              <button className="forever-button" onClick={() => answerProposal("forever")} type="button">
                FOREVER YES ❤️
              </button>
            </div>
            {celebration !== "none" ? (
              <div className="accepted-banner" aria-live="polite">
                <span>{celebration === "forever" ? "🌟" : "💍"}</span>
                {celebration === "forever" ? "Forever yes made the whole universe celebrate ❤️" : "Yes — my heart is celebrating with yours ❤️"}
              </div>
            ) : null}
          </article>
        ) : null}
      </section>
    </main>
  );
}
