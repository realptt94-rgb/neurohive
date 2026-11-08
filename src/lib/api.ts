// Client minimal de l'API vivante NeuroHive (fonctions Netlify + base de données).

export interface HealthStatus {
  system: string;
  version: string;
  status: string;
  database: "connectée" | "indisponible";
  lastHeartbeat: string | null;
  snapshotsStored: number;
  time: string;
}

export interface TelemetrySnapshot {
  cycle: number;
  gpuLoad: number;
  tpuLoad: number;
  npuLoad: number;
  throughput: number;
  latencyMs: number;
  activeAgents: number;
  source?: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`API ${res.status} sur ${path}`);
  return (await res.json()) as T;
}

export const getHealth = () => request<HealthStatus>("/api/health");

export const postTelemetry = (snapshot: TelemetrySnapshot) =>
  request("/api/telemetry", {
    method: "POST",
    body: JSON.stringify(snapshot),
  });
