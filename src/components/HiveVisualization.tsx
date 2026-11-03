import { useEffect, useState, useRef } from 'react'

interface HiveVisualizationProps {
  tick: number
}

interface Agent {
  id: number
  type: 'worker' | 'math' | 'supervisor' | 'llm' | 'mem0' | 'guard'
  x: number
  y: number
  angle: number
  speed: number
  status: 'active' | 'idle' | 'processing'
}

const AGENT_COLORS: Record<string, string> = {
  worker: '#22c55e',
  math: '#a855f7',
  supervisor: '#f59e0b',
  llm: '#ec4899',
  mem0: '#06b6d4',
  guard: '#ef4444',
}

const AGENT_LABELS: Record<string, string> = {
  worker: 'Ouvrier',
  math: 'Math',
  supervisor: 'Superviseur',
  llm: 'LLM',
  mem0: 'Mem0',
  guard: 'Garde',
}

export default function HiveVisualization({ tick }: HiveVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [connections, setConnections] = useState<[number, number][]>([])

  useEffect(() => {
    // Initialize agents
    const newAgents: Agent[] = []
    const types: Agent['type'][] = ['worker', 'worker', 'worker', 'worker', 'worker', 'worker',
      'worker', 'worker', 'worker', 'worker', 'worker', 'worker',
      'math', 'math', 'math', 'math', 'math', 'math', 'math', 'math',
      'supervisor', 'supervisor', 'supervisor', 'supervisor',
      'llm', 'llm', 'llm', 'llm', 'llm', 'llm', 'llm', 'llm',
      'mem0', 'mem0', 'mem0', 'mem0',
      'guard']

    types.forEach((type, i) => {
      const angle = (i / types.length) * Math.PI * 2
      const radius = type === 'guard' ? 30 : type === 'supervisor' ? 80 : type === 'llm' ? 130 : type === 'mem0' ? 170 : 200
      newAgents.push({
        id: i,
        type,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        angle: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
        status: Math.random() > 0.3 ? 'active' : 'idle',
      })
    })
    setAgents(newAgents)

    // Generate connections
    const conns: [number, number][] = []
    for (let i = 0; i < newAgents.length; i++) {
      for (let j = i + 1; j < newAgents.length; j++) {
        if (Math.random() < 0.05) {
          conns.push([i, j])
        }
      }
    }
    setConnections(conns)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const cx = width / 2
    const cy = height / 2

    ctx.clearRect(0, 0, width, height)

    // Draw hexagonal grid background
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.05)'
    ctx.lineWidth = 0.5
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        const hx = i * 40 + (j % 2) * 20
        const hy = j * 35
        drawHexagon(ctx, hx, hy, 18)
      }
    }

    // Draw concentric rings
    const rings = [30, 80, 130, 170, 210]
    rings.forEach((r, i) => {
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(34, 197, 94, ${0.1 + i * 0.02})`
      ctx.lineWidth = 0.5
      ctx.stroke()
    })

    // Draw connections
    connections.forEach(([a, b]) => {
      if (agents[a] && agents[b]) {
        ctx.beginPath()
        ctx.moveTo(cx + agents[a].x, cy + agents[a].y)
        ctx.lineTo(cx + agents[b].x, cy + agents[b].y)
        ctx.strokeStyle = `rgba(34, 197, 94, ${0.1 + Math.sin(tick * 0.1 + a) * 0.05})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    })

    // Draw data flow particles
    for (let i = 0; i < 20; i++) {
      const angle = (tick * 0.02 + i * 0.3) % (Math.PI * 2)
      const radius = 50 + Math.sin(tick * 0.05 + i) * 100
      const px = cx + Math.cos(angle) * radius
      const py = cy + Math.sin(angle) * radius
      ctx.beginPath()
      ctx.arc(px, py, 2, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(34, 197, 94, ${0.3 + Math.sin(tick * 0.1 + i) * 0.2})`
      ctx.fill()
    }

    // Draw agents
    agents.forEach(agent => {
      const ax = cx + agent.x
      const ay = cy + agent.y
      const color = AGENT_COLORS[agent.type]
      const size = agent.type === 'guard' ? 12 : agent.type === 'supervisor' ? 9 : 6

      // Glow effect
      const gradient = ctx.createRadialGradient(ax, ay, 0, ax, ay, size * 3)
      gradient.addColorStop(0, color + '40')
      gradient.addColorStop(1, 'transparent')
      ctx.beginPath()
      ctx.arc(ax, ay, size * 3, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Agent dot
      ctx.beginPath()
      ctx.arc(ax, ay, size, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()

      // Pulse ring for active agents
      if (agent.status === 'active') {
        const pulseSize = size + Math.sin(tick * 0.2 + agent.id) * 3 + 3
        ctx.beginPath()
        ctx.arc(ax, ay, pulseSize, 0, Math.PI * 2)
        ctx.strokeStyle = color + '60'
        ctx.lineWidth = 1
        ctx.stroke()
      }
    })

    // Center label
    ctx.fillStyle = '#22c55e'
    ctx.font = 'bold 14px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('NEUROHIVE', cx, cy - 5)
    ctx.fillStyle = '#6b7280'
    ctx.font = '10px monospace'
    ctx.fillText('CORE', cx, cy + 10)

  }, [tick, agents, connections])

  function drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6
      const hx = x + size * Math.cos(angle)
      const hy = y + size * Math.sin(angle)
      if (i === 0) ctx.moveTo(hx, hy)
      else ctx.lineTo(hx, hy)
    }
    ctx.closePath()
    ctx.stroke()
  }

  const agentCounts = agents.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Hive Visualization */}
      <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-green-400">🐝 Visualisation de la Ruche</h2>
          <span className="text-xs text-gray-500">Cycle #{tick}</span>
        </div>
        <canvas
          ref={canvasRef}
          width={600}
          height={500}
          className="w-full h-[400px] bg-gray-950/50 rounded-lg border border-gray-800"
        />
        <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-2">
          {Object.entries(AGENT_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
              <span className="text-gray-400">{AGENT_LABELS[type]}</span>
              <span className="text-white font-bold">{agentCounts[type] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Side Panel - Agent Details */}
      <div className="space-y-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-bold text-cyan-400 mb-3">📊 Architecture</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-800/50 rounded-lg border border-red-500/20">
              <div className="text-xs text-red-400 font-bold">🛡️ GARDE ×1</div>
              <div className="text-xs text-gray-400 mt-1">Point d'entrée/sortie unique</div>
              <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-400 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg border border-yellow-500/20">
              <div className="text-xs text-yellow-400 font-bold">👁️ SUPERVISEURS ×4</div>
              <div className="text-xs text-gray-400 mt-1">Orchestration & monitoring</div>
              <div className="mt-2 flex gap-1">
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${60 + Math.sin(tick * 0.1 + i) * 30}%` }}></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg border border-pink-500/20">
              <div className="text-xs text-pink-400 font-bold">🧠 LLM ×8</div>
              <div className="text-xs text-gray-400 mt-1">Modèles de langage distribués</div>
              <div className="mt-2 flex gap-1">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-400 rounded-full" style={{ width: `${40 + Math.sin(tick * 0.15 + i) * 40}%` }}></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg border border-cyan-500/20">
              <div className="text-xs text-cyan-400 font-bold">💾 MEM0 ×4</div>
              <div className="text-xs text-gray-400 mt-1">Mémoire persistante distribuée</div>
              <div className="mt-2 flex gap-1">
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${70 + Math.sin(tick * 0.08 + i) * 20}%` }}></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg border border-green-500/20">
              <div className="text-xs text-green-400 font-bold">⚒️ OUVRIERS ×12</div>
              <div className="text-xs text-gray-400 mt-1">Exécution de tâches</div>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg border border-purple-500/20">
              <div className="text-xs text-purple-400 font-bold">🔢 MATH ×8</div>
              <div className="text-xs text-gray-400 mt-1">Calcul matriciel & tensoriel</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-bold text-green-400 mb-3">⚡ Flux de données</h3>
          <div className="text-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-red-400">→</span>
              <span className="text-gray-300">Entrée → Garde → Superviseur</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">→</span>
              <span className="text-gray-300">Superviseur → Distribution</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">→</span>
              <span className="text-gray-300">Ouvriers/Math → Calcul</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-pink-400">→</span>
              <span className="text-gray-300">LLM → Inférence</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">→</span>
              <span className="text-gray-300">Mem0 → Stockage/Rappel</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-400">←</span>
              <span className="text-gray-300">Résultat → Garde → Sortie</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
