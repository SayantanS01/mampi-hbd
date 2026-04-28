"use client";

import { useEffect, useRef } from "react";
import type { BirthdayTheme } from "./theme-data";

type FaviconFrame = {
  scale: number;
  opacity: number;
};

const frames: FaviconFrame[] = [
  { scale: 1.0, opacity: 1.0 },
  { scale: 1.15, opacity: 0.9 },
  { scale: 0.95, opacity: 1.0 },
];

const themeColors: Record<BirthdayTheme, string> = {
  pastel: "#ff85a1",
  luxury: "#d4af37",
  cartoon: "#ff4d4d",
  galaxy: "#a855f7",
};

export function DynamicFavicon({ theme }: { theme: BirthdayTheme }) {
  const frameRef = useRef(0);

  useEffect(() => {
    const color = themeColors[theme];
    
    const updateFavicon = () => {
      const frame = frames[frameRef.current];
      const size = 32;
      const center = size / 2;
      
      // Create SVG string for the heartbeat heart
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g transform="translate(${12 - 12 * frame.scale}, ${12 - 12 * frame.scale}) scale(${frame.scale})">
            <path 
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
              fill="${color}"
              style="opacity: ${frame.opacity}"
              filter="url(#glow)"
            />
          </g>
        </svg>
      `;

      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
      link.type = 'image/svg+xml';
      link.rel = 'shortcut icon';
      link.href = url;
      document.getElementsByTagName('head')[0].appendChild(link);
      
      frameRef.current = (frameRef.current + 1) % frames.length;
      
      return () => URL.revokeObjectURL(url);
    };

    const interval = setInterval(updateFavicon, 500);
    updateFavicon(); // Initial update
    
    return () => clearInterval(interval);
  }, [theme]);

  return null; // Side-effect only component
}
