import { useEffect, useState } from 'react'

interface AgentPanelProps {
  tick: number
}

interface AgentInfo {
  id: number
  type: string
  name: string
  status: string
  task: string
  progress: number
  efficiency: number
  messages: number
}

const TASKS_WORKER = [
  'Prétraitement données batch #',
  'Partitionnement tenseur #',
  'Synchronisation gradient #',
  'Compression modèle #',
  'Validation croisée fold #',
  'Augmentation données #',
  'Nettoyage pipeline #',
  'Indexation vecteurs #',
]

const TASKS_MATH = [
  'Multiplication matricielle 4096×4096',
  'Décomposition SVD batch #',
  'Calcul attention heads #',
  'Forward pass layer #',
  'Backpropagation gradient #',
  'Normalisation batch #',
  'Convolution 2D feature map #',
  'Réduction tensorielle axe #',
]

const TASKS_SUPERVISOR = [
  'Orchestration cluster #',
  'Load balancing nœuds',
  'Détection anomalies',
  'Allocation ressources',
  'Monitoring latence',
  'Gestion file d\'attente',
  'Redistribution charges',
  'Health check agents',
]

export default function AgentPanel({ tick }: AgentPanelProps) {
  const [agents, setAgents] = useState<AgentInfo[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const newAgents: AgentInfo[] = []
    let id = 0

    // Workers
    for (let i = 0; i < 12; i++) {
      newAgents.push({
        id: id++,
        type: 'worker',
        name: `Ouvrier-${String(i + 1).padStart(2, '0')}`,
        status: Math.random() > 0.2 ? 'active' : 'idle',
        task: TASKS_WORKER[i % TASKS_WORKER.length] + Math.floor(Math.random() * 100),
        progress: Math.random() * 100,
        efficiency: 70 + Math.random() * 25,
        messages: Math.floor(Math.random() * 500),
      })
    }

    // Math agents
    for (let i = 0; i < 8; i++) {
      newAgents.push({
        id: id++,
        type: 'math',
        name: `Math-${String(i + 1).padStart(2, '0')}`,
        status: Math.random() > 0.15 ? 'active' : 'idle',
        task: TASKS_MATH[i % TASKS_MATH.length],
        progress: Math.random() * 100,
        efficiency: 80 + Math.random() * 18,
        messages: Math.floor(Math.random() * 300),
      })
    }

    // Supervisors
    for (let i = 0; i < 4; i++) {
      newAgents.push({
        id: id++,
        type: 'supervisor',
        name: `Superviseur-${String(i + 1).padStart(2, '0')}`,
        status: 'active',
        task: TASKS_SUPERVISOR[i % TASKS_SUPERVISOR.length],
        progress: Math.random() * 100,
        efficiency: 90 + Math.random() * 10,
        messages: Math.floor(Math.random() * 1000),
      })
    }

    setAgents(newAgents)
  }, [])

  useEffect(() => {
    setAgents(prev => prev.map(a => ({
      ...a,
      progress: Math.min(100, a.progress + Math.random() * 5),
      efficiency: Math.min(99, Math.max(50, a.efficiency + (Math.random() - 0.5) * 3)),
      messages: a.messages + Math.floor(Math.random() * 5),
      status: Math.random() > 0.95 ? (a.status === 'active' ? 'idle' : 'active') : a.status,
    })))

    // Add log
    const logTypes = ['INFO', 'DEBUG', 'WARN', 'OK']
    const logMessages = [
      'Tâche complétée avec succès',
      'Nouveau batch assigné',
      'Synchronisation terminée',
      'Gradient mis à jour',
      'Mémoire libérée',
      'Agent réveillé',
      'Checkpoint sauvegardé',
      'Pipeline redémarré',
    ]
    if (Math.random() > 0.5) {
      const type = logTypes[Math.floor(Math.random() * logTypes.length)]
      const msg = logMessages[Math.floor(Math.random() * logMessages.length)]
      const agent = `Agent-${Math.floor(Math.random() * 24)}`
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] [${type}] ${agent}: ${msg}`, ...prev].slice(0, 50))
    }
  }, [tick])

  const filteredAgents = filter === 'all' ? agents : agents.filter(a => a.type === filter)

  const typeColors: Record<string, string> = {
    worker: 'text-green-400 border-green-500/30 bg-green-500/10',
    math: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    supervisor: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  }

  const typeIcons: Record<string, string> = {
    worker: '⚒️',
    math: '🔢',
    supervisor: '👁️',
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'all', label: 'Tous', count: agents.length },
          { id: 'worker', label: '⚒️ Ouvriers', count: agents.filter(a => a.type === 'worker').length },
          { id: 'math', label: '🔢 Math', count: agents.filter(a => a.type === 'math').length },
          { id: 'supervisor', label: '👁️ Superviseurs', count: agents.filter(a => a.type === 'supervisor').length },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
              filter === f.id
                ? 'border-green-400 text-green-400 bg-green-400/10'
                : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent List */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <h2 className="text-lg font-bold text-green-400 mb-4">🤖 Agents de la Ruche</h2>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {filteredAgents.map(agent => (
              <div
                key={agent.id}
                className={`border rounded-lg p-3 transition-all hover:scale-[1.01] ${typeColors[agent.type]}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>{typeIcons[agent.type]}</span>
                    <span className="text-sm font-bold">{agent.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                    <span className="text-[10px] text-gray-400">{agent.status}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400 truncate mb-2">{agent.task}</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span className="text-gray-500">Progression</span>
                      <span className="text-gray-400">{agent.progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full transition-all"
                        style={{ width: `${agent.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-gray-500">Efficacité</div>
                    <div className="text-xs font-bold text-emerald-400">{agent.efficiency.toFixed(0)}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Logs */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-bold text-cyan-400 mb-3">📋 Logs en temps réel</h3>
          <div className="bg-gray-950 rounded-lg p-3 font-mono text-[10px] max-h-[500px] overflow-y-auto space-y-0.5">
            {logs.map((log, i) => (
              <div key={i} className={`${
                log.includes('[OK]') ? 'text-green-400' :
                log.includes('[WARN]') ? 'text-yellow-400' :
                log.includes('[DEBUG]') ? 'text-gray-500' :
                'text-cyan-400'
              }`}>
                {log}
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-gray-600">En attente de logs...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
