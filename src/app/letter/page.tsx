import { db } from "@/db";
import { letterContent } from "@/db/schema";
import { asc } from "drizzle-orm";
import LetterClient from "./LetterClient";

export const dynamic = "force-dynamic";

export default async function LetterPage() {
  let paragraphs = [];
  
  try {
    paragraphs = await db.select().from(letterContent).orderBy(asc(letterContent.order));
  } catch (error) {
    console.error("Failed to fetch letter content:", error);
    // Fallback
    paragraphs = [
      { id: 1, paragraph: "My dearest Mampi," },
      { id: 2, paragraph: "I don’t think words will ever truly be enough to describe what you mean to me… but today, I want to try." },
      { id: 3, paragraph: "You came into my life so quietly… yet changed everything so deeply." },
      { id: 4, paragraph: "Before you, life was just moving forward. But after you… life started feeling warm, meaningful, and full of something I didn’t even know I was missing." },
      { id: 5, paragraph: "You are not just someone I love… you are the person who makes everything make sense." },
      { id: 6, paragraph: "Your smile has this way of fixing things without even trying. Your presence brings peace in a way nothing else can. And your love… it feels like home." },
      { id: 7, paragraph: "I don’t just love you for who you are… I love you for how you make me feel—safe, understood, and truly alive." },
      { id: 8, paragraph: "On your birthday, I just want you to know this… You are the most precious part of my life." },
      { id: 9, paragraph: "And no matter what happens, no matter where life takes us… I will always choose you." },
      { id: 10, paragraph: "Again and again. Without hesitation." },
      { id: 11, paragraph: "Forever yours ❤️" },
    ];
  }

  return <LetterClient paragraphs={paragraphs} />;
}
