import { db } from "@/db";
import { letterContent } from "@/db/schema";
import { asc } from "drizzle-orm";
import LetterClient from "./LetterClient";

export default async function LetterPage() {
  let paragraphs = [];
  
  try {
    paragraphs = await db.select().from(letterContent).orderBy(asc(letterContent.order));
  } catch (error) {
    console.error("Failed to fetch letter content:", error);
    // Fallback
    paragraphs = [
      { id: 1, paragraph: "Dear Mampi," },
      { id: 2, paragraph: "I wanted to write you something special for your birthday, but words often fail to capture how much you truly mean to me." },
      { id: 3, paragraph: "You are the light in my world, the smile that makes everything okay, and the person I want to share every tomorrow with." },
      { id: 4, paragraph: "Happy Birthday, my love. May your day be as beautiful as your soul." },
      { id: 5, paragraph: "Always yours," },
    ];
  }

  return <LetterClient paragraphs={paragraphs} />;
}
