import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";

export const siteConfig = pgTable("site_config", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("Happy Birthday Mampi ❤️"),
  recipientName: text("recipient_name").notNull().default("Mampi Biswas"),
  heroEyebrow: text("hero_eyebrow").notNull().default(""),
  heroTitle: text("hero_title").notNull().default("Happy Birthday Mampi ❤️"),
  heroSubtitle: text("hero_subtitle").notNull().default("A little universe made just for you…"),
  heroDescription: text("hero_description").notNull().default("Mampi, \ntoday is not just another day… it’s the day the most beautiful soul came into this world. And somehow, fate decided to make you a part of my life.\n\nThis small website is nothing compared to how special you are… but it holds a piece of my heart, just for you.\n\nScroll slowly… feel everything…  \nbecause every page is a memory, every animation is a feeling, and every word… is love."),
  // Game customization
  gameTitle: text("game_title").notNull().default("Catch My Love 💕"),
  gameDescription: text("game_description").notNull().default("Hearts are falling from above… just like my feelings for you. Catch as many as you can before time runs out!"),
  gameWinningMessage: text("game_winning_message").notNull().default("You didn’t just win the game… you’ve already won my heart ❤️"),
  // Surprise customization
  surprisePrelude: text("surprise_prelude").notNull().default("Mampi Biswas…"),
  surpriseQuestion: text("surprise_question").notNull().default(`You are not just someone who came into my life… you are the reason my life feels complete.

Every moment with you makes me realize this is what I’ve been searching for all along.

I don’t just want memories with you… I want a lifetime.

A lifetime of laughter… of growing together… of standing beside each other no matter what comes.

I want you in every version of my future.

So today… I’m asking you something straight from my heart—

Will you assign your life with mine… walk beside me through everything… and stay with me forever?

Will you be mine… always? ❤️`),
  // Music customization
  musicUrl: text("music_url").default("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const milestones = pgTable("milestones", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  order: integer("order").notNull().default(0),
});

export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  category: text("category").default("general"),
  order: integer("order").notNull().default(0),
});

export const letterContent = pgTable("letter_content", {
  id: serial("id").primaryKey(),
  paragraph: text("paragraph").notNull(),
  order: integer("order").notNull().default(0),
});
