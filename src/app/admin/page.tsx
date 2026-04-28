import { db } from "@/db";
import { siteConfig, milestones, galleryItems, letterContent } from "@/db/schema";
import { asc } from "drizzle-orm";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const config = await db.select().from(siteConfig).limit(1);
  const storyMilestones = await db.select().from(milestones).orderBy(asc(milestones.order));
  const gallery = await db.select().from(galleryItems).orderBy(asc(galleryItems.order));
  const letter = await db.select().from(letterContent).orderBy(asc(letterContent.order));

  const defaultConfig = {
    heroEyebrow: "Mampi,",
    heroTitle: "Happy Birthday Mampi ❤️",
    heroSubtitle: "A little universe made just for you…",
    heroDescription: "today is not just another day… it’s the day the most beautiful soul came into this world. And somehow, fate decided to make you a part of my life.\n\nThis small website is nothing compared to how special you are… but it holds a piece of my heart, just for you.\n\nScroll slowly… feel everything…\nbecause every page is a memory, every animation is a feeling, and every word… is love.",
  };

  return (
    <AdminClient 
      initialConfig={config[0] ?? defaultConfig}
      initialMilestones={storyMilestones}
      initialGallery={gallery}
      initialLetter={letter}
    />
  );
}
