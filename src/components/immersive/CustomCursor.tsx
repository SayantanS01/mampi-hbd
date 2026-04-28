"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { BirthdayTheme } from "./theme-data";

export function CustomCursor({ theme }: { theme: BirthdayTheme }) {
  const [position, setPosition] = useState({ x: -120, y: -120 });
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  const style = {
    "--cursor-x": `${position.x}px`,
    "--cursor-y": `${position.y}px`,
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className={`heart-cursor ${pressed ? "is-pressed" : ""}`}
      data-cursor-theme={theme}
      style={style}
    >
      <span>♥</span>
    </div>
  );
}
