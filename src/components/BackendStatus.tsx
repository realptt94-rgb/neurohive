import { useEffect, useState } from "react";
import { getHealth, type HealthStatus } from "../lib/api";

// Pastille d'état du système : interroge l'API vivante et affiche
// si le backend (et sa base de données) répondent ou non.
export default function BackendStatus() {
  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const status = await getHealth();
        if (alive) setHealth(status);
      } catch {
        if (alive) setHealth(null);
      }
    };
    poll();
    const id = setInterval(poll, 30000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  if (!health) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-500/10 border border-slate-500/30" title="API injoignable — affichage simulé localement">
        <div className="w-2 h-2 rounded-full bg-slate-400"></div>
        <div className="text-sm text-slate-300 font-semibold">SIMULATION</div>
      </div>
    );
  }

  const dbOnline = health.database === "connectée";
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
        dbOnline
          ? "bg-emerald-500/10 border-emerald-500/30"
          : "bg-amber-500/10 border-amber-500/30"
      }`}
      title={
        dbOnline
          ? `Backend en ligne • ${health.snapshotsStored} instantanés stockés`
          : "Backend en ligne • base de données en cours de provisionnement"
      }
    >
      <div className={`w-2 h-2 rounded-full animate-ping ${dbOnline ? "bg-emerald-400" : "bg-amber-400"}`}></div>
      <div className={`text-sm font-semibold ${dbOnline ? "text-emerald-400" : "text-amber-400"}`}>
        {dbOnline ? "ACTIF • API + DB" : "ACTIF • API"}
      </div>
    </div>
  );
}
