import type { Config } from "@netlify/functions";
import { desc } from "drizzle-orm";
import { db } from "../../db/index.js";
import { telemetrySnapshots } from "../../db/schema.js";

const clamp = (v: unknown, min: number, max: number, fallback: number) => {
  const n = typeof v === "number" && Number.isFinite(v) ? v : fallback;
  return Math.min(max, Math.max(min, n));
};

// POST /api/telemetry — enregistre un instantané de télémétrie.
// GET /api/telemetry?limit=30 — lit les derniers instantanés stockés.
export default async (req: Request) => {
  if (req.method === "POST") {
    let body: Record<string, unknown> = {};
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return Response.json({ error: "corps JSON invalide" }, { status: 400 });
    }

    const cycle = clamp(body.cycle, 0, Number.MAX_SAFE_INTEGER, 0);
    if (!Number.isInteger(cycle) || cycle < 0) {
      return Response.json({ error: "champ 'cycle' entier requis" }, { status: 400 });
    }

    try {
      const [saved] = await db
        .insert(telemetrySnapshots)
        .values({
          cycle,
          gpuLoad: clamp(body.gpuLoad, 0, 100, 0),
          tpuLoad: clamp(body.tpuLoad, 0, 100, 0),
          npuLoad: clamp(body.npuLoad, 0, 100, 0),
          throughput: Math.round(clamp(body.throughput, 0, 1_000_000, 0)),
          latencyMs: Math.round(clamp(body.latencyMs, 0, 60_000, 0)),
          activeAgents: Math.round(clamp(body.activeAgents, 0, 10_000, 77)),
          source: typeof body.source === "string" ? body.source.slice(0, 32) : "dashboard",
        })
        .returning();
      return Response.json(saved, { status: 201 });
    } catch {
      return Response.json(
        { error: "base de données indisponible, réessayez après provisionnement" },
        { status: 503 },
      );
    }
  }

  if (req.method === "GET") {
    const limit = Math.min(
      100,
      Math.max(1, Number(new URL(req.url).searchParams.get("limit")) || 30),
    );
    try {
      const rows = await db
        .select()
        .from(telemetrySnapshots)
        .orderBy(desc(telemetrySnapshots.id))
        .limit(limit);
      return Response.json(rows);
    } catch {
      return Response.json(
        { error: "base de données indisponible, réessayez après provisionnement" },
        { status: 503 },
      );
    }
  }

  return new Response("Méthode non autorisée", { status: 405 });
};

export const config: Config = {
  path: "/api/telemetry",
  method: ["GET", "POST"],
};
