import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ExperienceShell } from "@/components/immersive/ExperienceShell";
import "./globals.css";

import { db } from "@/db";
import { siteConfig } from "@/db/schema";

export const metadata: Metadata = {
  title: "Happy Birthday Mampi ❤️",
  description: "A magical interactive birthday love experience made for Mampi Biswas.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  let musicUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  
  try {
    const config = await db.select().from(siteConfig).limit(1);
    if (config.length > 0) {
      musicUrl = config[0].musicUrl ?? musicUrl;
    }
  } catch (err) {
    console.warn("Layout: Failed to fetch musicUrl.");
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ExperienceShell musicUrl={musicUrl}>{children}</ExperienceShell>
      </body>
    </html>
  );
}
