import { useEffect, useState } from 'react'

interface MemoryPanelProps {
  tick: number
}

interface MemoryNode {
  id: number
  name: string
  type: 'mem0' | 'llm'
  capacity: number
  used: number
  entries: number
  hitRate: number
  latency: number
  status: 'active' | 'syncing' | 'idle'
}

interface MemoryEntry {
  id: number
  key: string
  value: string
  timestamp: number
  accessCount: number
  node: number
}

export default function MemoryPanel({ tick }: MemoryPanelProps) {
  const [nodes, setNodes] = useState<MemoryNode[]>([])
  const [entries, setEntries] = useState<MemoryEntry[]>([])
  const [selectedNode, setSelectedNode] = useState<number>(0)

  useEffect(() => {
    const mem0Nodes: MemoryNode[] = [
      { id: 0, name: 'Mem0-Alpha', type: 'mem0', capacity: 100, used: 67, entries: 14523, hitRate: 94.2, latency: 2.1, status: 'active' },
      { id: 1, name: 'Mem0-Beta', type: 'mem0', capacity: 100, used: 45, entries: 8901, hitRate: 91.8, latency: 1.8, status: 'active' },
      { id: 2, name: 'Mem0-Gamma', type: 'mem0', capacity: 100, used: 82, entries: 21034, hitRate: 96.1, latency: 3.2, status: 'syncing' },
      { id: 3, name: 'Mem0-Delta', type: 'mem0', capacity: 100, used: 31, entries: 5672, hitRate: 88.5, latency: 1.5, status: 'active' },
    ]

    const llmNodes: MemoryNode[] = [
      { id: 4, name: 'LLM-01 (70B)', type: 'llm', capacity: 140, used: 98, entries: 0, hitRate: 0, latency: 45, status: 'active' },
      { id: 5, name: 'LLM-02 (70B)', type: 'llm', capacity: 140, used: 112, entries: 0, hitRate: 0, latency: 52, status: 'active' },
      { id: 6, name: 'LLM-03 (13B)', type: 'llm', capacity: 26, used: 18, entries: 0, hitRate: 0, latency: 12, status: 'active' },
      { id: 7, name: 'LLM-04 (13B)', type: 'llm', capacity: 26, used: 21, entries: 0, hitRate: 0, latency: 15, status: 'active' },
      { id: 8, name: 'LLM-05 (7B)', type: 'llm', capacity: 14, used: 9, entries: 0, hitRate: 0, latency: 8, status: 'idle' },
      { id: 9, name: 'LLM-06 (7B)', type: 'llm', capacity: 14, used: 11, entries: 0, hitRate: 0, latency: 9, status: 'active' },
      { id: 10, name: 'LLM-07 (3B)', type: 'llm', capacity: 6, used: 4, entries: 0, hitRate: 0, latency: 5, status: 'active' },
      { id: 11, name: 'LLM-08 (3B)', type: 'llm', capacity: 6, used: 5, entries: 0, hitRate: 0, latency: 6, status: 'active' },
    ]

    setNodes([...mem0Nodes, ...llmNodes])

    // Generate sample entries
    const sampleEntries: MemoryEntry[] = []
    const keys = ['context:task_42', 'embedding:user_query_7', 'gradient:layer_12', 'state:agent_worker_03',
      'cache:attention_head_5', 'buffer:batch_89', 'vector:semantic_234', 'token:sequence_567']
    for (let i = 0; i < 20; i++) {
      sampleEntries.push({
        id: i,
        key: keys[i % keys.length] + '_' + Math.floor(Math.random() * 100),
        value: `[${(Math.random() * 2 - 1).toFixed(4)}, ${(Math.random() * 2 - 1).toFixed(4)}, ...]`,
        timestamp: Date.now() - Math.floor(Math.random() * 60000),
        accessCount: Math.floor(Math.random() * 100),
        node: Math.floor(Math.random() * 4),
      })
    }
    setEntries(sampleEntries)
  }, [])

  useEffect(() => {
    setNodes(prev => prev.map(n => ({
      ...n,
      used: n.type === 'mem0'
        ? Math.min(99, Math.max(10, n.used + (Math.random() - 0.5) * 3))
        : Math.min(n.capacity, Math.max(1, n.used + (Math.random() - 0.5) * 2)),
      hitRate: Math.min(99, Math.max(80, n.hitRate + (Math.random() - 0.5) * 2)),
      latency: Math.max(1, n.latency + (Math.random() - 0.5) * 0.5),
    })))
  }, [tick])

  const mem0Nodes = nodes.filter(n => n.type === 'mem0')
  const llmNodes = nodes.filter(n => n.type === 'llm')

  return (
    <div className="space-y-6">
      {/* Mem0 Section */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-cyan-400">💾 Mem0 — Mémoire Persistante ×4</h2>
          <span className="text-xs text-gray-500">Distribution vectorielle</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mem0Nodes.map(node => (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node.id)}
              className={`border rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                selectedNode === node.id ? 'border-cyan-400 bg-cyan-400/5' : 'border-cyan-500/20 bg-cyan-500/5'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-cyan-400">{node.name}</span>
                <div className={`w-2 h-2 rounded-full ${
                  node.status === 'active' ? 'bg-green-400' :
                  node.status === 'syncing' ? 'bg-yellow-400 animate-pulse' : 'bg-gray-500'
                }`}></div>
              </div>

              {/* Capacity bar */}
              <div className="mb-3">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-gray-400">Capacité</span>
                  <span className="text-cyan-400">{node.used.toFixed(0)}/{node.capacity} GB</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all"
                    style={{ width: `${(node.used / node.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-gray-500">Entrées</span>
                  <div className="text-white font-bold">{node.entries.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-500">Hit Rate</span>
                  <div className="text-green-400 font-bold">{node.hitRate.toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-gray-500">Latence</span>
                  <div className="text-yellow-400 font-bold">{node.latency.toFixed(1)}ms</div>
                </div>
                <div>
                  <span className="text-gray-500">Status</span>
                  <div className="text-gray-300 font-bold">{node.status}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Memory entries viewer */}
        <div className="mt-4 bg-gray-950 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-2">Entrées récentes (Mem0-Alpha)</div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {entries.filter(e => e.node === selectedNode).slice(0, 8).map(entry => (
              <div key={entry.id} className="flex items-center gap-3 text-[10px] font-mono">
                <span className="text-cyan-400 w-40 truncate">{entry.key}</span>
                <span className="text-gray-500 flex-1 truncate">{entry.value}</span>
                <span className="text-gray-600">{entry.accessCount}x</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LLM Section */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-pink-400">🧠 LLM — Modèles de Langue ×8</h2>
          <span className="text-xs text-gray-500">Inférence distribuée</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {llmNodes.map(node => (
            <div key={node.id} className="border border-pink-500/20 bg-pink-500/5 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-pink-400">{node.name}</span>
                <div className={`w-2 h-2 rounded-full ${
                  node.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
                }`}></div>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-gray-400">VRAM</span>
                  <span className="text-pink-400">{node.used}/{node.capacity} GB</span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
                    style={{ width: `${(node.used / node.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-[10px] text-gray-400">
                Latence: <span className="text-yellow-400 font-bold">{node.latency.toFixed(0)}ms</span>
              </div>
            </div>
          ))}
        </div>

        {/* LLM Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-pink-400">
              {(llmNodes.reduce((s, n) => s + n.capacity, 0))} GB
            </div>
            <div className="text-xs text-gray-400">VRAM Total</div>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">
              {(llmNodes.reduce((s, n) => s + n.used, 0) / llmNodes.reduce((s, n) => s + n.capacity, 0) * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-400">Utilisation</div>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">
              {(llmNodes.reduce((s, n) => s + n.latency, 0) / llmNodes.length).toFixed(0)}ms
            </div>
            <div className="text-xs text-gray-400">Latence moy.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
