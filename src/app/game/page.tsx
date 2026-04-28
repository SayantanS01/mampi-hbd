import { db } from "@/db";
import { siteConfig } from "@/db/schema";
import GameClient from "./GameClient";

export const dynamic = "force-dynamic";

export default async function GamePage() {
  let config = {
    gameTitle: "Catch My Love 💕",
    gameDescription: "Hearts are falling from above… just like my feelings for you. Catch as many as you can before time runs out!",
    gameWinningMessage: "You didn’t just win the game… you’ve already won my heart ❤️",
  };

  try {
    const results = await db.select().from(siteConfig).limit(1);
    if (results.length > 0) {
      config = {
        gameTitle: results[0].gameTitle || config.gameTitle,
        gameDescription: results[0].gameDescription || config.gameDescription,
        gameWinningMessage: results[0].gameWinningMessage || config.gameWinningMessage,
      };
    }
  } catch (error) {
    console.error("Failed to fetch game config:", error);
  }

  return <GameClient config={config} />;
}
