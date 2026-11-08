CREATE TABLE "heartbeats" (
	"id" serial PRIMARY KEY,
	"status" text DEFAULT 'alive' NOT NULL,
	"detail" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "telemetry_snapshots" (
	"id" serial PRIMARY KEY,
	"cycle" integer NOT NULL,
	"gpu_load" real NOT NULL,
	"tpu_load" real NOT NULL,
	"npu_load" real NOT NULL,
	"throughput" integer NOT NULL,
	"latency_ms" integer NOT NULL,
	"active_agents" integer DEFAULT 77 NOT NULL,
	"source" text DEFAULT 'heartbeat' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
