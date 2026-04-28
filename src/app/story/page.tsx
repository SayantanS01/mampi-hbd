import { db } from "@/db";
import { milestones } from "@/db/schema";
import { asc } from "drizzle-orm";
import StoryClient from "./StoryClient";

export const dynamic = "force-dynamic";

export default async function StoryPage() {
  let storyMilestones = [];
  
  try {
    storyMilestones = await db.select().from(milestones).orderBy(asc(milestones.order));
  } catch (error) {
    console.error("Failed to fetch milestones:", error);
    // Fallback if DB is not ready
    storyMilestones = [
      { id: 1, date: "The Beginning", title: "When We First Met", description: "A moment that changed everything. The world felt softer, and my heart knew it found its home.", imageUrl: "" },
      { id: 2, date: "First Date", title: "Magic in the Air", description: "Laughter, long walks, and the realization that you are the most special person I've ever known.", imageUrl: "" },
    ];
  }

  return <StoryClient milestones={storyMilestones} />;
}
