import { useEffect, useState } from 'react'

interface StatsBarProps {
  tick: number
}

export default function StatsBar({ tick }: StatsBarProps) {
  const [stats, setStats] = useState({
    agents: 64,
    llmInstances: 8,
    mem0Nodes: 4,
    guards: 1,
    gpuLoad: 73,
    tpuLoad: 61,
    npuLoad: 45,
    throughput: 2847,
    latency: 12,
  })

  useEffect(() => {
    setStats(prev => ({
      ...prev,
      gpuLoad: Math.min(99, Math.max(40, prev.gpuLoad + (Math.random() - 0.5) * 5)),
      tpuLoad: Math.min(99, Math.max(30, prev.tpuLoad + (Math.random() - 0.5) * 5)),
      npuLoad: Math.min(99, Math.max(20, prev.npuLoad + (Math.random() - 0.5) * 5)),
      throughput: Math.floor(2000 + Math.random() * 2000),
      latency: Math.floor(8 + Math.random() * 15),
    }))
  }, [tick])

  const statItems = [
    { label: 'Agents', value: stats.agents, color: 'text-green-400', unit: '' },
    { label: 'LLM×8', value: stats.llmInstances, color: 'text-purple-400', unit: '' },
    { label: 'Mem0×4', value: stats.mem0Nodes, color: 'text-cyan-400', unit: '' },
    { label: 'Garde×1', value: stats.guards, color: 'text-yellow-400', unit: '' },
    { label: 'CPU', value: '128', color: 'text-emerald-400', unit: 'cœurs' },
    { label: 'GPU', value: stats.gpuLoad.toFixed(0), color: 'text-red-400', unit: '%' },
    { label: 'TPU', value: stats.tpuLoad.toFixed(0), color: 'text-orange-400', unit: '%' },
    { label: 'NPU', value: stats.npuLoad.toFixed(0), color: 'text-blue-400', unit: '%' },
    { label: 'LPU', value: '<1', color: 'text-yellow-400', unit: 'ms' },
    { label: 'Throughput', value: stats.throughput, color: 'text-emerald-400', unit: 'ops/s' },
    { label: 'Latence', value: stats.latency, color: 'text-pink-400', unit: 'ms' },
  ]

  return (
    <div className="relative z-10 border-b border-gray-800 bg-gray-900/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6 overflow-x-auto">
        {statItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-xs text-gray-500">{item.label}</span>
            <span className={`text-sm font-bold ${item.color}`}>
              {item.value}{item.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
