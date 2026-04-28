import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ExperienceShell } from "@/components/immersive/ExperienceShell";
import "./globals.css";
import "./components.css";

export const metadata: Metadata = {
  title: "Happy Birthday Mampi ❤️",
  description: "A magical interactive birthday love experience made for Mampi Biswas.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ExperienceShell>{children}</ExperienceShell>
      </body>
    </html>
  );
}
