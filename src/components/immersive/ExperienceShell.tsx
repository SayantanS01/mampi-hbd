"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { CustomCursor } from "./CustomCursor";
import { ThreeDreamscape } from "./ThreeDreamscape";
import { isBirthdayTheme, themeStorageKey, themes } from "./theme-data";
import type { BirthdayTheme } from "./theme-data";
import { BrandLogo } from "./BrandLogo";
import { DynamicFavicon } from "./DynamicFavicon";
import ReactPlayer from "react-player";

// Bypass React 19 TS mismatch for react-player
const Player = ReactPlayer as any;

const navLinks = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/story", label: "Love Story", icon: "💞" },
  { href: "/gallery", label: "Gallery", icon: "🖼️" },
  { href: "/letter", label: "Letter", icon: "💌" },
  { href: "/game", label: "Game", icon: "🎮" },
  { href: "/surprise", label: "Surprise", icon: "🎁" },
];

export function ExperienceShell({ children, musicUrl }: { children: ReactNode; musicUrl?: string }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<BirthdayTheme>("pastel");
  const [loading, setLoading] = useState(true);
  const [musicPlaying, setMusicPlaying] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem(themeStorageKey);
    if (isBirthdayTheme(storedTheme)) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;
    localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1250);
    return () => window.clearTimeout(timer);
  }, []);

  const toggleMusic = useCallback(() => {
    setMusicPlaying((prev) => !prev);
  }, []);

  return (
    <div className="experience-shell" data-theme={theme}>
      <DynamicFavicon theme={theme} />
      <ThreeDreamscape theme={theme} />
      <CustomCursor theme={theme} />
      
      {musicUrl && (
        <div 
          style={{ 
            position: "fixed", 
            bottom: "0", 
            right: "0", 
            width: "200px", 
            height: "200px", 
            overflow: "hidden", 
            opacity: 0.001, 
            pointerEvents: "none", 
            zIndex: -1 
          }}
        >
          <Player
            key={musicUrl}
            url={musicUrl}
            playing={musicPlaying}
            loop
            volume={0.8}
            width="100%"
            height="100%"
            onEnded={() => setMusicPlaying(false)}
            playsinline
            config={{
              youtube: {
                playerVars: { 
                  origin: typeof window !== "undefined" ? window.location.origin : "",
                  modestbranding: 1,
                  controls: 0,
                  autoplay: 0,
                  rel: 0,
                  showinfo: 0
                }
              }
            }}
          />
        </div>
      )}

      <div className={`loading-screen ${loading ? "" : "is-hidden"}`} aria-hidden={!loading}>
        <div className="loader-heart">♥</div>
        <p>Opening Mampi&apos;s magical birthday world…</p>
      </div>

      <header className="site-chrome">
        <Link className="brand-mark" href="/" aria-label="Go to birthday home">
          <BrandLogo theme={theme} className="logo-vibe" />
          <span>
            <strong>Mampi&apos;s World</strong>
            <small>made with love</small>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Birthday pages">
          {navLinks.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link className={`nav-pill ${active ? "is-active" : ""}`} href={link.href} key={link.href}>
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="chrome-controls">
          <div className="theme-switcher" role="group" aria-label="Theme switcher">
            {themes.map((themeOption) => (
              <button
                aria-label={`Switch to ${themeOption.label}`}
                aria-pressed={theme === themeOption.id}
                className={`theme-dot ${theme === themeOption.id ? "is-active" : ""}`}
                data-theme-choice={themeOption.id}
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id)}
                title={themeOption.description}
                type="button"
              >
                <span>{themeOption.icon}</span>
                <em>{themeOption.shortLabel}</em>
              </button>
            ))}
          </div>

          <button className={`music-toggle ${musicPlaying ? "is-playing" : ""}`} onClick={toggleMusic} type="button">
            <span>{musicPlaying ? "♪" : "♫"}</span>
            {musicPlaying ? "Pause Music" : "Play Music"}
          </button>
        </div>
      </header>

      <div className="page-transition" key={pathname}>
        {children}
      </div>

      <footer className="love-footer">
        <span>Every pixel whispers: Happy Birthday, Mampi Biswas ❤️</span>
      </footer>
    </div>
  );
}
