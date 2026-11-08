import type { Config } from "@netlify/functions";
import { desc, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { heartbeats, telemetrySnapshots } from "../../db/schema.js";

// État vivant du système : statut, base de données et dernier battement enregistré.
export default async () => {
  let lastHeartbeat: string | null = null;
  let snapshotsStored = 0;
  let database: "connectée" | "indisponible" = "indisponible";

  try {
    const [latest] = await db
      .select({ createdAt: heartbeats.createdAt })
      .from(heartbeats)
      .orderBy(desc(heartbeats.id))
      .limit(1);
    if (latest?.createdAt) lastHeartbeat = latest.createdAt.toISOString();

    const [row] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(telemetrySnapshots);
    snapshotsStored = row?.n ?? 0;
    database = "connectée";
  } catch {
    // La base est provisionnée à la première connexion ; le système reste
    // actif en mode dégradé tant qu'elle ne répond pas.
  }

  return Response.json({
    system: "neurohive",
    version: "4.1",
    status: "actif",
    database,
    lastHeartbeat,
    snapshotsStored,
    time: new Date().toISOString(),
  });
};

export const config: Config = {
  path: "/api/health",
  method: "GET",
};
