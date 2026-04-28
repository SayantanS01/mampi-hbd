import { db } from "@/db";
import { siteConfig } from "@/db/schema";
import SurpriseClient from "./SurpriseClient";

export const dynamic = "force-dynamic";

export default async function SurprisePage() {
  let config = {
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
    const results = await db.select().from(siteConfig).limit(1);
    if (results.length > 0) {
      config = {
        surprisePrelude: results[0].surprisePrelude || config.surprisePrelude,
        surpriseQuestion: results[0].surpriseQuestion || config.surpriseQuestion,
      };
    }
  } catch (error) {
    console.error("Failed to fetch surprise config:", error);
  }

  return <SurpriseClient config={config} />;
}
