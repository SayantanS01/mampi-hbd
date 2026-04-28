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
      { 
        id: 1, 
        date: "Memory 01", 
        title: "The First Time I Saw You", 
        description: "I still remember that moment like it just happened yesterday... It wasn’t just seeing you… it was feeling something shift inside me...", 
        imageUrl: "" 
      },
      { 
        id: 2, 
        date: "Memory 02", 
        title: "When You Became My Happiness", 
        description: "Slowly, without even realizing it… you became a part of my everyday thoughts...", 
        imageUrl: "" 
      },
      { 
        id: 3, 
        date: "Memory 03", 
        title: "Moments I’ll Never Forget", 
        description: "It’s not just the big moments… it’s the small ones that stay forever...", 
        imageUrl: "" 
      },
    ];
  }

  return <StoryClient milestones={storyMilestones} />;
}
