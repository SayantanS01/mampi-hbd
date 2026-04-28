import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";

export const siteConfig = pgTable("site_config", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("Happy Birthday Mampi ❤️"),
  recipientName: text("recipient_name").notNull().default("Mampi Biswas"),
  heroEyebrow: text("hero_eyebrow").notNull().default("For the girl who makes every day softer"),
  heroTitle: text("hero_title").notNull().default("Happy Birthday Mampi"),
  heroSubtitle: text("hero_subtitle").notNull().default("A little world made just for you"),
  heroDescription: text("hero_description").notNull().default("Step into a glowing love story full of floating hearts, memories, music, surprises, and one question that comes straight from my heart."),
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
