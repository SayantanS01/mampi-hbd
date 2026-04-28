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
    heroEyebrow: "For the girl who makes every day softer",
    heroTitle: "Happy Birthday Mampi",
    heroSubtitle: "A little world made just for you",
    heroDescription: "Step into a glowing love story full of floating hearts, memories, music, surprises, and one question that comes straight from my heart.",
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
