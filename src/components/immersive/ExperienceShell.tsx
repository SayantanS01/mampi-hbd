"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
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

const noteSets: Record<BirthdayTheme, number[]> = {
  pastel: [261.63, 329.63, 392, 523.25, 659.25, 783.99],
  luxury: [220, 277.18, 329.63, 440, 554.37, 659.25],
  cartoon: [293.66, 349.23, 392, 493.88, 587.33, 698.46],
  galaxy: [246.94, 311.13, 369.99, 493.88, 622.25, 739.99],
};

type WindowWithWebkitAudio = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

function getAudioConstructor() {
  const audioWindow = window as WindowWithWebkitAudio;
  return audioWindow.AudioContext ?? audioWindow.webkitAudioContext ?? null;
}

function playChime(context: AudioContext, destination: GainNode, theme: BirthdayTheme) {
  const notes = noteSets[theme];
  const frequency = notes[Math.floor(Math.random() * notes.length)];
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const harmony = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = theme === "luxury" ? "triangle" : "sine";
  harmony.type = theme === "cartoon" ? "square" : "sine";
  oscillator.frequency.setValueAtTime(frequency, now);
  harmony.frequency.setValueAtTime(frequency * (theme === "galaxy" ? 1.5 : 2), now);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(theme === "luxury" ? 1600 : 2400, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(theme === "cartoon" ? 0.08 : 0.055, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.85);

  oscillator.connect(gain);
  harmony.connect(gain);
  gain.connect(filter);
  filter.connect(destination);

  oscillator.start(now);
  harmony.start(now + 0.025);
  oscillator.stop(now + 1.9);
  harmony.stop(now + 1.9);

  oscillator.onended = () => {
    gain.disconnect();
    filter.disconnect();
  };
}

function startPad(context: AudioContext, destination: GainNode, theme: BirthdayTheme) {
  const now = context.currentTime;

  return noteSets[theme].slice(0, 3).map((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = index % 2 === 0 ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(frequency / 2, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.012 + index * 0.004, now + 1.6);
    oscillator.connect(gain);
    gain.connect(destination);
    oscillator.start(now + index * 0.12);
    return oscillator;
  });
}

export function ExperienceShell({ children, musicUrl }: { children: ReactNode; musicUrl?: string }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<BirthdayTheme>("pastel");
  const [loading, setLoading] = useState(true);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);
  const padRef = useRef<OscillatorNode[]>([]);
  const themeRef = useRef<BirthdayTheme>("pastel");
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem(themeStorageKey);
    if (isBirthdayTheme(storedTheme)) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    themeRef.current = theme;
    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;
    localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1250);
    return () => window.clearTimeout(timer);
  }, []);

  const ensureAudio = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioConstructor = getAudioConstructor();
      if (!AudioConstructor) {
        return null;
      }
      audioContextRef.current = new AudioConstructor();
    }

    if (!masterGainRef.current) {
      const masterGain = audioContextRef.current.createGain();
      masterGain.gain.setValueAtTime(0.0001, audioContextRef.current.currentTime);
      masterGain.connect(audioContextRef.current.destination);
      masterGainRef.current = masterGain;
    }

    return audioContextRef.current;
  }, []);

  const stopPad = useCallback(() => {
    padRef.current.forEach((oscillator) => {
      try {
        oscillator.stop();
      } catch {
        // The oscillator may already be stopped; this is safe to ignore.
      }
      oscillator.disconnect();
    });
    padRef.current = [];
  }, []);

  const stopMusic = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const context = audioContextRef.current;
    const masterGain = masterGainRef.current;

    if (context && masterGain && context.state !== "closed") {
      const now = context.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setTargetAtTime(0.0001, now, 0.25);
      window.setTimeout(() => {
        stopPad();
        if (context.state === "running") {
          void context.suspend();
        }
      }, 550);
    } else {
      stopPad();
    }

    setMusicPlaying(false);
  }, [stopPad]);

  const beginMusic = useCallback(
    (swell = false) => {
      const context = ensureAudio();
      const masterGain = masterGainRef.current;

      if (!context || !masterGain || context.state === "closed") {
        return;
      }

      void context.resume();

      const now = context.currentTime;
      const targetVolume = swell ? 0.34 : 0.17;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setTargetAtTime(targetVolume, now, 0.55);

      if (padRef.current.length === 0) {
        padRef.current = startPad(context, masterGain, themeRef.current);
      }

      if (intervalRef.current === null) {
        intervalRef.current = window.setInterval(() => {
          const activeContext = audioContextRef.current;
          const activeGain = masterGainRef.current;
          if (activeContext && activeGain && activeContext.state !== "closed") {
            playChime(activeContext, activeGain, themeRef.current);
          }
        }, themeRef.current === "cartoon" ? 760 : 940);
      }

      playChime(context, masterGain, themeRef.current);
      setMusicPlaying(true);

      if (swell) {
        window.setTimeout(() => {
          if (audioContextRef.current && masterGainRef.current && audioContextRef.current.state !== "closed") {
            masterGainRef.current.gain.setTargetAtTime(0.2, audioContextRef.current.currentTime, 1.1);
          }
        }, 5400);
      }
    },
    [ensureAudio],
  );

  useEffect(() => {
    const handler = () => beginMusic(true);
    window.addEventListener("mampi:music-swell", handler);
    return () => window.removeEventListener("mampi:music-swell", handler);
  }, [beginMusic]);

  useEffect(() => {
    return () => stopMusic();
  }, [stopMusic]);

  return (
    <div className="experience-shell" data-theme={theme}>
      <DynamicFavicon theme={theme} />
      <ThreeDreamscape theme={theme} />
      <CustomCursor theme={theme} />
      
      {musicUrl && !musicUrl.includes("spotify.com") && (
        <div style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", opacity: 0, pointerEvents: "none", zIndex: -1 }}>
          <Player
            key={musicUrl}
            url={musicUrl}
            playing={musicPlaying}
            loop
            volume={0.6}
            width="200px"
            height="200px"
            onEnded={() => setMusicPlaying(false)}
            onError={(e: any) => console.error("Music Player Error:", e)}
            playsinline
            config={{
              youtube: {
                playerVars: { 
                  origin: typeof window !== "undefined" ? window.location.origin : "",
                  modestbranding: 1,
                  controls: 0
                }
              } as any
            }}
          />
        </div>
      )}
      
      {musicUrl && musicUrl.includes("spotify.com") && musicPlaying && (
        <div className="spotify-widget-container" style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 99, textAlign: "right" }}>
          <iframe 
            src={musicUrl.replace("open.spotify.com", "open.spotify.com/embed").split("?")[0]} 
            width="300" 
            height="80" 
            frameBorder="0" 
            allow="encrypted-media; autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            style={{ borderRadius: "14px", boxShadow: "0 18px 50px rgba(0,0,0,0.4)", marginBottom: "8px" }}
          />
          <p style={{ fontSize: "10px", opacity: 0.7, color: "var(--text-color)", margin: 0, paddingRight: "8px" }}>
            Note: Click Play on the Spotify widget to start music 🎵
          </p>
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

          <button className={`music-toggle ${musicPlaying ? "is-playing" : ""}`} onClick={() => (musicPlaying ? stopMusic() : beginMusic())} type="button">
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
