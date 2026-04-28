import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

type CelebrationPayload = {
  answer?: string;
  score?: number;
  source?: string;
};

export async function POST(request: Request) {
  let payload: CelebrationPayload = {};

  try {
    payload = (await request.json()) as CelebrationPayload;
  } catch {
    payload = {};
  }

  let databaseReachable = true;

  try {
    await db.execute(sql`select 1`);
  } catch {
    databaseReachable = false;
  }

  return Response.json({
    ok: true,
    databaseReachable,
    celebratedAt: new Date().toISOString(),
    received: {
      answer: payload.answer ?? null,
      score: typeof payload.score === "number" ? payload.score : null,
      source: payload.source ?? "mampi-birthday-world",
    },
    message: "Celebration received. This birthday universe is glowing brighter for Mampi.",
  });
}
