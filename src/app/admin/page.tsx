import { db } from "@/db";
import { siteConfig, milestones, galleryItems, letterContent } from "@/db/schema";
import { asc } from "drizzle-orm";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let initialConfig: any = null;
  let storyMilestones: any[] = [];
  let gallery: any[] = [];
  let letter: any[] = [];

  const defaultConfig = {
    heroEyebrow: "Mampi,",
    heroTitle: "Happy Birthday Mampi ❤️",
    heroSubtitle: "A little universe made just for you…",
    heroDescription: "today is not just another day… it’s the day the most beautiful soul came into this world. And somehow, fate decided to make you a part of my life.\n\nThis small website is nothing compared to how special you are… but it holds a piece of my heart, just for you.\n\nScroll slowly… feel everything…\nbecause every page is a memory, every animation is a feeling, and every word… is love.",
    gameTitle: "Catch My Love 💕",
    gameDescription: "Hearts are falling from above… just like my feelings for you. Catch as many as you can before time runs out!",
    gameWinningMessage: "You didn’t just win the game… you’ve already won my heart ❤️",
    surprisePrelude: "I saved the most important feeling for last.",
    surpriseQuestion: "Will you assign your life with mine… walk beside me through everything… and stay with me forever?",
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  };

  try {
    const config = await db.select().from(siteConfig).limit(1);
    initialConfig = config[0] || defaultConfig;
    storyMilestones = await db.select().from(milestones).orderBy(asc(milestones.order));
    gallery = await db.select().from(galleryItems).orderBy(asc(galleryItems.order));
    letter = await db.select().from(letterContent).orderBy(asc(letterContent.order));
  } catch (error) {
    console.error("AdminPage: Database connection failed.", error);
    initialConfig = defaultConfig;
  }

  return (
    <AdminClient 
      initialConfig={initialConfig}
      initialMilestones={storyMilestones}
      initialGallery={gallery}
      initialLetter={letter}
    />
  );
}
