import 'dotenv/config';
import { db } from "../db";
import { siteConfig, milestones, letterContent } from "../db/schema";
import { eq } from "drizzle-orm";

async function run() {
  console.log("Updating database content...");

  // Update Site Config
  const siteData = {
    heroEyebrow: "",
    heroTitle: "Happy Birthday Mampi ❤️",
    heroSubtitle: "A little universe made just for you…",
    heroDescription: "Mampi, \ntoday is not just another day… it’s the day the most beautiful soul came into this world. And somehow, fate decided to make you a part of my life.\n\nThis small website is nothing compared to how special you are… but it holds a piece of my heart, just for you.\n\nScroll slowly… feel everything…  \nbecause every page is a memory, every animation is a feeling, and every word… is love.",
    gameTitle: "Catch My Love 💕",
    gameDescription: "Hearts are falling from above… just like my feelings for you. Catch as many as you can before time runs out!",
    gameWinningMessage: "You didn’t just win the game… you’ve already won my heart ❤️",
    surprisePrelude: "Mampi Biswas…",
    surpriseQuestion: `You are not just someone who came into my life… you are the reason my life feels complete.

Every moment with you makes me realize this is what I’ve been searching for all along.

I don’t just want memories with you… I want a lifetime.

A lifetime of laughter… of growing together… of standing beside each other no matter what comes.

I want you in every version of my future.

So today… I’m asking you something straight from my heart—

Will you assign your life with mine… walk beside me through everything… and stay with me forever?

Will you be mine… always? ❤️`,
  };

  try {
    const existing = await db.select().from(siteConfig).limit(1);
    if (existing.length > 0) {
      await db.update(siteConfig).set(siteData).where(eq(siteConfig.id, existing[0].id));
      console.log("✅ Updated site config.");
    } else {
      await db.insert(siteConfig).values(siteData);
      console.log("✅ Inserted site config.");
    }

    // Update Milestones
    await db.delete(milestones);
    await db.insert(milestones).values([
      { 
        date: "Memory 01", 
        title: "The First Time I Saw You", 
        description: "I still remember that moment like it just happened yesterday... It wasn’t just seeing you… it was feeling something shift inside me...", 
        order: 1
      },
      { 
        date: "Memory 02", 
        title: "When You Became My Happiness", 
        description: "Slowly, without even realizing it… you became a part of my everyday thoughts...", 
        order: 2
      },
      { 
        date: "Memory 03", 
        title: "Moments I’ll Never Forget", 
        description: "It’s not just the big moments… it’s the small ones that stay forever...", 
        order: 3
      },
    ]);
    console.log("✅ Updated milestones.");

    // Update Letter
    await db.delete(letterContent);
    await db.insert(letterContent).values([
      { paragraph: "My dearest Mampi,", order: 1 },
      { paragraph: "I don’t think words will ever truly be enough to describe what you mean to me… but today, I want to try.", order: 2 },
      { paragraph: "You came into my life so quietly… yet changed everything so deeply.", order: 3 },
      { paragraph: "Before you, life was just moving forward. But after you… life started feeling warm, meaningful, and full of something I didn’t even know I was missing.", order: 4 },
      { paragraph: "You are not just someone I love… you are the person who makes everything make sense.", order: 5 },
      { paragraph: "Your smile has this way of fixing things without even trying. Your presence brings peace in a way nothing else can. And your love… it feels like home.", order: 6 },
      { paragraph: "I don’t just love you for who you are… I love you for how you make me feel—safe, understood, and truly alive.", order: 7 },
      { paragraph: "On your birthday, I just want you to know this… You are the most precious part of my life.", order: 8 },
      { paragraph: "And no matter what happens, no matter where life takes us… I will always choose you.", order: 9 },
      { paragraph: "Again and again. Without hesitation.", order: 10 },
      { paragraph: "Forever yours ❤️", order: 11 },
    ]);
    console.log("✅ Updated letter content.");

    console.log("\n🚀 All content forced to update in the database!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to update database:", err);
    process.exit(1);
  }
}

run();
