import { db } from "@/db";
import { siteConfig } from "@/db/schema";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const promises = [
    "A tiny universe made just for your smile.",
    "Themes that change the mood like magic.",
    "A journey from memories to forever.",
  ];

  let config = {
    heroEyebrow: "Mampi,",
    heroTitle: "Happy Birthday Mampi ❤️",
    heroSubtitle: "A little universe made just for you…",
    heroDescription: "today is not just another day… it’s the day the most beautiful soul came into this world. And somehow, fate decided to make you a part of my life.\n\nThis small website is nothing compared to how special you are… but it holds a piece of my heart, just for you.\n\nScroll slowly… feel everything…\nbecause every page is a memory, every animation is a feeling, and every word… is love.",
  };

  try {
    const results = await db.select().from(siteConfig).limit(1);
    if (results.length > 0) {
      config = {
        heroEyebrow: results[0].heroEyebrow || config.heroEyebrow,
        heroTitle: results[0].heroTitle || config.heroTitle,
        heroSubtitle: results[0].heroSubtitle || config.heroSubtitle,
        heroDescription: results[0].heroDescription || config.heroDescription,
      };
    }
  } catch (error) {
    console.error("Failed to fetch site config:", error);
  }

  return (
    <main className="page home-page">
      <section className="hero-grid" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">{config.heroEyebrow}</p>
          <h1 className="hero-title" id="home-title">
            {config.heroTitle} <span>❤️</span>
          </h1>
          <p className="hero-subtitle">{config.heroSubtitle}</p>
          <p className="hero-description">
            {config.heroDescription}
          </p>
 
          <div className="hero-actions" aria-label="Start experience">
            <Link className="primary-action" href="/story">
              Begin Our Story 💞
            </Link>
            <Link className="secondary-action" href="/surprise">
              Keep a Secret 🎁
            </Link>
          </div>
 
          <div className="promise-row">
            {promises.map((promise) => (
              <div className="promise-card" key={promise}>
                <span>✦</span>
                <p>{promise}</p>
              </div>
            ))}
          </div>
        </div>
 
        <div className="hero-3d-stage" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="heart-planet">
            <span>♥</span>
          </div>
          <span className="floating-symbol symbol-one">💕</span>
          <span className="floating-symbol symbol-two">✨</span>
          <span className="floating-symbol symbol-three">💍</span>
          <span className="floating-symbol symbol-four">🌙</span>
        </div>
      </section>
 
      <section className="home-note glass-panel">
        <p>
          Use the theme switcher anytime — romantic pastel, dark luxury, cute cartoon, or dreamy galaxy — and turn on the music when you want the moment to feel even more magical.
        </p>
      </section>
    </main>
  );
}
