import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { heartbeats } from "../../db/schema.js";

// Battement de cœur horaire : prouve que le système est actif et alimente
// l'indicateur « ACTIF » du tableau de bord via /api/health.
export default async () => {
  await db.insert(heartbeats).values({
    status: "alive",
    detail: "planned heartbeat",
  });
};

export const config: Config = {
  schedule: "@hourly",
};
