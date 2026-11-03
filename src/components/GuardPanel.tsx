import { useEffect, useState } from 'react'

interface GuardPanelProps {
  tick: number
}

interface RequestLog {
  id: number
  timestamp: string
  type: 'input' | 'output'
  source: string
  destination: string
  payload: string
  size: number
  status: 'accepted' | 'rejected' | 'processed' | 'forwarded'
  latency: number
}

export default function GuardPanel({ tick }: GuardPanelProps) {
  const [logs, setLogs] = useState<RequestLog[]>([])
  const [stats, setStats] = useState({
    totalIn: 0,
    totalOut: 0,
    rejected: 0,
    avgLatency: 0,
    bandwidth: 0,
  })

  useEffect(() => {
    const sources = ['Client-Web', 'API-Gateway', 'IoT-Sensor', 'Mobile-App', 'Batch-Job', 'WebSocket']
    const destinations = ['Superviseur-01', 'Superviseur-02', 'Superviseur-03', 'Superviseur-04']
    const payloads = [
      '{"action":"inference","model":"llm-01","tokens":128}',
      '{"action":"store","key":"context:42","size":2048}',
      '{"action":"query","type":"semantic","top_k":10}',
      '{"action":"compute","op":"matmul","dims":[4096,4096]}',
      '{"action":"stream","channel":"agent_events","format":"sse"}',
      '{"action":"health","check":"all_nodes","timeout":5000}',
    ]

    const initialLogs: RequestLog[] = []
    for (let i = 0; i < 30; i++) {
      const isIn = Math.random() > 0.4
      initialLogs.push({
        id: i,
        timestamp: new Date(Date.now() - i * 2000).toLocaleTimeString(),
        type: isIn ? 'input' : 'output',
        source: isIn ? sources[Math.floor(Math.random() * sources.length)] : 'NeuroHive-Core',
        destination: isIn ? 'Garde-Entrée/Sortie' : destinations[Math.floor(Math.random() * destinations.length)],
        payload: payloads[Math.floor(Math.random() * payloads.length)],
        size: Math.floor(64 + Math.random() * 4096),
        status: Math.random() > 0.05 ? (isIn ? 'forwarded' : 'processed') : 'rejected',
        latency: Math.floor(1 + Math.random() * 20),
      })
    }
    setLogs(initialLogs)
    setStats({
      totalIn: initialLogs.filter(l => l.type === 'input').length,
      totalOut: initialLogs.filter(l => l.type === 'output').length,
      rejected: initialLogs.filter(l => l.status === 'rejected').length,
      avgLatency: initialLogs.reduce((s, l) => s + l.latency, 0) / initialLogs.length,
      bandwidth: initialLogs.reduce((s, l) => s + l.size, 0),
    })
  }, [])

  useEffect(() => {
    const sources = ['Client-Web', 'API-Gateway', 'IoT-Sensor', 'Mobile-App', 'Batch-Job']
    const destinations = ['Superviseur-01', 'Superviseur-02', 'Superviseur-03', 'Superviseur-04']
    const payloads = [
      '{"action":"inference","model":"llm-01","tokens":128}',
      '{"action":"store","key":"context:42","size":2048}',
      '{"action":"query","type":"semantic","top_k":10}',
      '{"action":"compute","op":"matmul","dims":[4096,4096]}',
    ]

    if (Math.random() > 0.3) {
      const isIn = Math.random() > 0.4
      const newLog: RequestLog = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        type: isIn ? 'input' : 'output',
        source: isIn ? sources[Math.floor(Math.random() * sources.length)] : 'NeuroHive-Core',
        destination: isIn ? 'Garde-Entrée/Sortie' : destinations[Math.floor(Math.random() * destinations.length)],
        payload: payloads[Math.floor(Math.random() * payloads.length)],
        size: Math.floor(64 + Math.random() * 4096),
        status: Math.random() > 0.03 ? (isIn ? 'forwarded' : 'processed') : 'rejected',
        latency: Math.floor(1 + Math.random() * 20),
      }

      setLogs(prev => [newLog, ...prev].slice(0, 100))
      setStats(prev => ({
        totalIn: prev.totalIn + (isIn ? 1 : 0),
        totalOut: prev.totalOut + (isIn ? 0 : 1),
        rejected: prev.rejected + (newLog.status === 'rejected' ? 1 : 0),
        avgLatency: (prev.avgLatency * 0.9 + newLog.latency * 0.1),
        bandwidth: prev.bandwidth + newLog.size,
      }))
    }
  }, [tick])

  return (
    <div className="space-y-6">
      {/* Guard Overview */}
      <div className="bg-gradient-to-r from-red-500/10 to-yellow-500/10 border border-red-500/30 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-400 flex items-center justify-center">
            <span className="text-3xl">🛡️</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-400">Garde Unique — Point d'Entrée/Sortie</h2>
            <p className="text-xs text-gray-400">
              Seul point d'accès au système NeuroHive. Toutes les requêtes entrantes et sortantes transitent par ce gardien.
              Validation, rate-limiting, authentification et routage.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-gray-900/50 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{stats.totalIn}</div>
            <div className="text-xs text-gray-400">Entrées</div>
          </div>
          <div className="text-center p-3 bg-gray-900/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{stats.totalOut}</div>
            <div className="text-xs text-gray-400">Sorties</div>
          </div>
          <div className="text-center p-3 bg-gray-900/50 rounded-lg">
            <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
            <div className="text-xs text-gray-400">Rejetées</div>
          </div>
          <div className="text-center p-3 bg-gray-900/50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">{stats.avgLatency.toFixed(1)}ms</div>
            <div className="text-xs text-gray-400">Latence moy.</div>
          </div>
          <div className="text-center p-3 bg-gray-900/50 rounded-lg">
            <div className="text-2xl font-bold text-cyan-400">{(stats.bandwidth / 1024).toFixed(1)}KB</div>
            <div className="text-xs text-gray-400">Bande passante</div>
          </div>
        </div>
      </div>

      {/* Flow Diagram */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-bold text-yellow-400 mb-4">🔄 Flux Entrée → Sortie</h3>
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          <div className="flex-shrink-0 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
            <div className="text-lg">📥</div>
            <div className="text-[10px] text-green-400 font-bold">ENTRÉE</div>
            <div className="text-[9px] text-gray-400">Clients/API</div>
          </div>
          <div className="text-gray-500 animate-pulse">→→→</div>
          <div className="flex-shrink-0 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
            <div className="text-lg">🛡️</div>
            <div className="text-[10px] text-red-400 font-bold">GARDE ×1</div>
            <div className="text-[9px] text-gray-400">Validation</div>
          </div>
          <div className="text-gray-500 animate-pulse">→→→</div>
          <div className="flex-shrink-0 px-4 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center">
            <div className="text-lg">👁️</div>
            <div className="text-[10px] text-yellow-400 font-bold">SUPERVISEURS</div>
            <div className="text-[9px] text-gray-400">Orchestration</div>
          </div>
          <div className="text-gray-500 animate-pulse">→→→</div>
          <div className="flex-shrink-0 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
            <div className="text-lg">⚒️</div>
            <div className="text-[10px] text-green-400 font-bold">AGENTS</div>
            <div className="text-[9px] text-gray-400">Traitement</div>
          </div>
          <div className="text-gray-500 animate-pulse">→→→</div>
          <div className="flex-shrink-0 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
            <div className="text-lg">🛡️</div>
            <div className="text-[10px] text-red-400 font-bold">GARDE ×1</div>
            <div className="text-[9px] text-gray-400">Validation</div>
          </div>
          <div className="text-gray-500 animate-pulse">→→→</div>
          <div className="flex-shrink-0 px-4 py-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
            <div className="text-lg">📤</div>
            <div className="text-[10px] text-blue-400 font-bold">SORTIE</div>
            <div className="text-[9px] text-gray-400">Réponses</div>
          </div>
        </div>
      </div>

      {/* Request Logs */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-bold text-red-400 mb-3">📋 Journal des Requêtes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800">
                <th className="text-left py-2 px-2">Heure</th>
                <th className="text-left py-2 px-2">Type</th>
                <th className="text-left py-2 px-2">Source</th>
                <th className="text-left py-2 px-2">Destination</th>
                <th className="text-left py-2 px-2">Payload</th>
                <th className="text-right py-2 px-2">Taille</th>
                <th className="text-center py-2 px-2">Status</th>
                <th className="text-right py-2 px-2">Latence</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 20).map(log => (
                <tr key={log.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-1.5 px-2 text-gray-400">{log.timestamp}</td>
                  <td className="py-1.5 px-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      log.type === 'input' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {log.type === 'input' ? 'IN' : 'OUT'}
                    </span>
                  </td>
                  <td className="py-1.5 px-2 text-gray-300">{log.source}</td>
                  <td className="py-1.5 px-2 text-gray-300">{log.destination}</td>
                  <td className="py-1.5 px-2 text-gray-500 font-mono max-w-48 truncate">{log.payload}</td>
                  <td className="py-1.5 px-2 text-right text-gray-400">{log.size}B</td>
                  <td className="py-1.5 px-2 text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                      log.status === 'forwarded' ? 'bg-green-500/20 text-green-400' :
                      log.status === 'processed' ? 'bg-blue-500/20 text-blue-400' :
                      log.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-1.5 px-2 text-right text-yellow-400">{log.latency}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
