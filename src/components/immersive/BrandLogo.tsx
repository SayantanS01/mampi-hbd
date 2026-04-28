"use client";

import React from "react";
import type { BirthdayTheme } from "./theme-data";

const themeProps: Record<BirthdayTheme, { color: string; orbit: string; glow: string }> = {
  pastel: { color: "#ff85a1", orbit: "rgba(255, 133, 161, 0.3)", glow: "#ffb3c1" },
  luxury: { color: "#d4af37", orbit: "rgba(212, 175, 55, 0.3)", glow: "#f1e5ac" },
  cartoon: { color: "#ff4d4d", orbit: "rgba(255, 77, 77, 0.3)", glow: "#ff9999" },
  galaxy: { color: "#a855f7", orbit: "rgba(168, 85, 247, 0.3)", glow: "#d8b4fe" },
};

export function BrandLogo({ theme, className = "" }: { theme: BirthdayTheme; className?: string }) {
  const props = themeProps[theme] || themeProps.pastel;

  return (
    <div className={`brand-logo-container ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="brand-logo-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <linearGradient id="heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: props.color, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: props.glow, stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Orbit Ring */}
        <ellipse 
          cx="50" cy="50" rx="45" ry="15" 
          fill="none" 
          stroke={props.orbit} 
          strokeWidth="1.5"
          className="logo-orbit"
          transform="rotate(-15 50 50)"
        />

        {/* Small Orbit Particle */}
        <circle cx="50" cy="50" r="2" fill={props.color} className="logo-particle">
          <animateMotion 
            dur="4s" 
            repeatCount="indefinite"
            path="M -45 0 A 45 15 -15 1 1 45 0 A 45 15 -15 1 1 -45 0"
          />
        </circle>

        {/* The Heart */}
        <path 
          d="M50 80 L44 74 C26 58 14 48 14 34 C14 22 22 14 34 14 C41 14 47 17 50 22 C53 17 59 14 66 14 C78 14 86 22 86 34 C86 48 74 58 56 74 Z" 
          fill="url(#heart-gradient)"
          filter="url(#logo-glow)"
          className="logo-heart"
        />
      </svg>

      <style jsx>{`
        .brand-logo-container {
          width: 50px;
          height: 50px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-logo-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }
        .logo-heart {
          transform-origin: center;
          animation: logo-heartbeat 1.5s ease-in-out infinite;
        }
        .logo-orbit {
          transform-origin: center;
          animation: logo-rotate 10s linear infinite;
        }
        @keyframes logo-heartbeat {
          0%, 100% { transform: scale(0.9); }
          50% { transform: scale(1.05); }
        }
        @keyframes logo-rotate {
          from { transform: rotate(-15deg); }
          to { transform: rotate(345deg); }
        }
      `}</style>
    </div>
  );
}
