import { pgTable, serial, text, timestamp, integer, real } from "drizzle-orm/pg-core";

// Instantanés de télémétrie du système NeuroHive (un par cycle rapporté).
export const telemetrySnapshots = pgTable("telemetry_snapshots", {
  id: serial().primaryKey(),
  cycle: integer().notNull(),
  gpuLoad: real("gpu_load").notNull(),
  tpuLoad: real("tpu_load").notNull(),
  npuLoad: real("npu_load").notNull(),
  throughput: integer().notNull(),
  latencyMs: integer("latency_ms").notNull(),
  activeAgents: integer("active_agents").notNull().default(77),
  source: text().notNull().default("heartbeat"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Battements de cœur du système (preuves d'activité, écrits par la tâche planifiée).
export const heartbeats = pgTable("heartbeats", {
  id: serial().primaryKey(),
  status: text().notNull().default("alive"),
  detail: text().notNull().default(""),
  createdAt: timestamp("created_at").defaultNow(),
});
