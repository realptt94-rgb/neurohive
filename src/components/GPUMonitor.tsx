import { useEffect, useState, useRef } from 'react'

interface GPUMonitorProps {
  tick: number
}

interface GPUDevice {
  id: number
  name: string
  uuid: string
  temperature: number
  fanSpeed: number
  utilization: number
  memoryUsed: number
  memoryTotal: number
  memoryFree: number
  powerDraw: number
  powerLimit: number
  pcieGen: number
  pcieWidth: number
  clocks: { graphics: number; sm: number; memory: number; video: number }
  processes: ProcessInfo[]
  history: { time: number; util: number; mem: number; temp: number; power: number }[]
}

interface ProcessInfo {
  pid: number
  name: string
  type: 'C' | 'G' | 'C+G'
  memory: number
  gpuUtil: number
}

export default function GPUMonitor({ tick }: GPUMonitorProps) {
  const [gpus, setGpus] = useState<GPUDevice[]>([])
  const [viewMode, setViewMode] = useState<'dashboard' | 'detail' | 'processes'>('dashboard')
  const [selectedGPU, setSelectedGPU] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const gpuConfigs = [
      { name: 'NVIDIA H100 80GB HBM3', mem: 80, power: 700, pcie: 5 },
      { name: 'NVIDIA H100 80GB HBM3', mem: 80, power: 700, pcie: 5 },
      { name: 'NVIDIA A100 80GB PCIe', mem: 80, power: 300, pcie: 4 },
      { name: 'NVIDIA A100 80GB PCIe', mem: 80, power: 300, pcie: 4 },
      { name: 'NVIDIA RTX 4090', mem: 24, power: 450, pcie: 4 },
      { name: 'AMD MI300X', mem: 192, power: 750, pcie: 5 },
      { name: 'Google TPU v4', mem: 32, power: 192, pcie: 4 },
      { name: 'Intel NPU (Lunar Lake)', mem: 0, power: 5, pcie: 0 },
    ]

    const devices: GPUDevice[] = gpuConfigs.map((config, i) => ({
      id: i,
      name: config.name,
      uuid: `GPU-${i}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      temperature: 45 + Math.random() * 35,
      fanSpeed: 30 + Math.random() * 50,
      utilization: 20 + Math.random() * 70,
      memoryUsed: config.mem * (0.3 + Math.random() * 0.5),
      memoryTotal: config.mem,
      memoryFree: config.mem * (0.2 + Math.random() * 0.4),
      powerDraw: config.power * (0.3 + Math.random() * 0.5),
      powerLimit: config.power,
      pcieGen: config.pcie,
      pcieWidth: config.pcie > 0 ? 16 : 0,
      clocks: {
        graphics: 1200 + Math.floor(Math.random() * 800),
        sm: 1100 + Math.floor(Math.random() * 900),
        memory: 800 + Math.floor(Math.random() * 600),
        video: 800 + Math.floor(Math.random() * 400),
      },
      processes: [
        { pid: 1000 + i * 10, name: 'neurohive-worker', type: 'C' as const, memory: 1000 + Math.random() * 5000, gpuUtil: 40 + Math.random() * 50 },
        { pid: 2000 + i * 10, name: 'llm-inference', type: 'C+G' as const, memory: 2000 + Math.random() * 10000, gpuUtil: 60 + Math.random() * 30 },
        ...(Math.random() > 0.5 ? [{ pid: 3000 + i * 10, name: 'tensorboard', type: 'G' as const, memory: 200 + Math.random() * 500, gpuUtil: 5 }] : []),
      ],
      history: Array.from({ length: 60 }, (_, j) => ({
        time: j,
        util: 30 + Math.random() * 60,
        mem: 40 + Math.random() * 40,
        temp: 50 + Math.random() * 25,
        power: 30 + Math.random() * 50,
      })),
    }))

    setGpus(devices)
  }, [])

  useEffect(() => {
    setGpus(prev => prev.map(gpu => {
      const newUtil = Math.min(100, Math.max(0, gpu.utilization + (Math.random() - 0.5) * 10))
      const newTemp = Math.min(95, Math.max(30, gpu.temperature + (Math.random() - 0.5) * 3))
      const newMem = Math.min(gpu.memoryTotal, Math.max(0, gpu.memoryUsed + (Math.random() - 0.5) * 2))
      const newPower = Math.min(gpu.powerLimit, Math.max(0, gpu.powerDraw + (Math.random() - 0.5) * 30))

      const newHistory = [...gpu.history.slice(1), {
        time: gpu.history[gpu.history.length - 1].time + 1,
        util: newUtil,
        mem: (newMem / gpu.memoryTotal) * 100,
        temp: newTemp,
        power: (newPower / gpu.powerLimit) * 100,
      }]

      return {
        ...gpu,
        utilization: newUtil,
        temperature: newTemp,
        memoryUsed: newMem,
        memoryFree: gpu.memoryTotal - newMem,
        powerDraw: newPower,
        fanSpeed: Math.min(100, Math.max(20, gpu.fanSpeed + (Math.random() - 0.5) * 5)),
        clocks: {
          graphics: gpu.clocks.graphics + Math.floor((Math.random() - 0.5) * 50),
          sm: gpu.clocks.sm + Math.floor((Math.random() - 0.5) * 50),
          memory: gpu.clocks.memory + Math.floor((Math.random() - 0.5) * 30),
          video: gpu.clocks.video,
        },
        history: newHistory,
      }
    }))
  }, [tick])

  // Draw history graph
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const gpu = gpus[selectedGPU]
    if (!gpu) return

    ctx.clearRect(0, 0, width, height)

    // Background
    ctx.fillStyle = 'rgba(3, 7, 18, 0.8)'
    ctx.fillRect(0, 0, width, height)

    // Grid
    ctx.strokeStyle = 'rgba(75, 85, 99, 0.3)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Draw lines
    const drawLine = (data: number[], color: string) => {
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = 1.5
      data.forEach((val, i) => {
        const x = (i / (data.length - 1)) * width
        const y = height - (val / 100) * height
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()

      // Fill area
      ctx.lineTo(width, height)
      ctx.lineTo(0, height)
      ctx.closePath()
      ctx.fillStyle = color.replace(')', ', 0.1)').replace('rgb', 'rgba')
      ctx.fill()
    }

    drawLine(gpu.history.map(h => h.util), 'rgb(34, 197, 94)')
    drawLine(gpu.history.map(h => h.mem), 'rgb(6, 182, 212)')
    drawLine(gpu.history.map(h => h.temp), 'rgb(239, 68, 68)')
    drawLine(gpu.history.map(h => h.power), 'rgb(245, 158, 11)')

    // Labels
    ctx.font = '9px monospace'
    ctx.fillStyle = '#22c55e'
    ctx.fillText('GPU Util', 5, 12)
    ctx.fillStyle = '#06b6d4'
    ctx.fillText('Memory', 60, 12)
    ctx.fillStyle = '#ef4444'
    ctx.fillText('Temp', 110, 12)
    ctx.fillStyle = '#f59e0b'
    ctx.fillText('Power', 145, 12)

  }, [tick, selectedGPU, gpus])

  const totalPower = gpus.reduce((s, g) => s + g.powerDraw, 0)
  const totalMem = gpus.reduce((s, g) => s + g.memoryTotal, 0)
  const usedMem = gpus.reduce((s, g) => s + g.memoryUsed, 0)
  const avgUtil = gpus.reduce((s, g) => s + g.utilization, 0) / gpus.length
  const avgTemp = gpus.reduce((s, g) => s + g.temperature, 0) / gpus.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-green-400">📊 GPU Monitor — Style nvitop</h2>
          <div className="flex gap-2">
            {[
              { id: 'dashboard' as const, label: '📊 Dashboard' },
              { id: 'detail' as const, label: '🔍 Détail' },
              { id: 'processes' as const, label: '📋 Processus' },
            ].map(v => (
              <button
                key={v.id}
                onClick={() => setViewMode(v.id)}
                className={`px-3 py-1 text-xs rounded border ${
                  viewMode === v.id ? 'border-green-400 text-green-400 bg-green-400/10' : 'border-gray-700 text-gray-400'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-green-400">{gpus.length}</div>
            <div className="text-xs text-gray-400">Accélérateurs</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-cyan-400">{avgUtil.toFixed(0)}%</div>
            <div className="text-xs text-gray-400">Util. moyenne</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-yellow-400">{usedMem.toFixed(0)}/{totalMem.toFixed(0)} GB</div>
            <div className="text-xs text-gray-400">VRAM utilisée</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-red-400">{avgTemp.toFixed(0)}°C</div>
            <div className="text-xs text-gray-400">Temp. moyenne</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-orange-400">{(totalPower / 1000).toFixed(1)} kW</div>
            <div className="text-xs text-gray-400">Puissance totale</div>
          </div>
        </div>
      </div>

      {viewMode === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {gpus.map((gpu, i) => (
            <div
              key={i}
              onClick={() => { setSelectedGPU(i); setViewMode('detail') }}
              className={`border rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.02] ${
                gpu.temperature > 80 ? 'border-red-500/40 bg-red-500/5' :
                gpu.utilization > 80 ? 'border-yellow-500/40 bg-yellow-500/5' :
                'border-gray-700 bg-gray-900/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-green-400">GPU {i}</span>
                <div className={`w-2 h-2 rounded-full ${
                  gpu.utilization > 80 ? 'bg-red-400 animate-pulse' :
                  gpu.utilization > 50 ? 'bg-yellow-400' : 'bg-green-400'
                }`}></div>
              </div>
              <div className="text-[10px] text-gray-400 truncate mb-2">{gpu.name}</div>

              {/* Utilization */}
              <div className="mb-2">
                <div className="flex justify-between text-[9px] mb-0.5">
                  <span className="text-gray-500">Util</span>
                  <span className="text-green-400">{gpu.utilization.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 rounded-full transition-all" style={{ width: `${gpu.utilization}%` }}></div>
                </div>
              </div>

              {/* Memory */}
              <div className="mb-2">
                <div className="flex justify-between text-[9px] mb-0.5">
                  <span className="text-gray-500">VRAM</span>
                  <span className="text-cyan-400">{gpu.memoryUsed.toFixed(1)}/{gpu.memoryTotal}GB</span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full transition-all" style={{ width: `${(gpu.memoryUsed / gpu.memoryTotal) * 100}%` }}></div>
                </div>
              </div>

              {/* Temp & Power */}
              <div className="flex justify-between text-[9px]">
                <span className={gpu.temperature > 80 ? 'text-red-400' : 'text-gray-400'}>
                  🌡️ {gpu.temperature.toFixed(0)}°C
                </span>
                <span className="text-orange-400">
                  ⚡ {gpu.powerDraw.toFixed(0)}W
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'detail' && gpus[selectedGPU] && (
        <div className="space-y-4">
          {/* History Graph */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-bold ${gpus[selectedGPU].temperature > 80 ? 'text-red-400' : 'text-green-400'}`}>
                📈 Historique — {gpus[selectedGPU].name} (GPU {selectedGPU})
              </h3>
              <span className="text-xs text-gray-500">60 dernières secondes</span>
            </div>
            <canvas
              ref={canvasRef}
              width={800}
              height={200}
              className="w-full h-[200px] bg-gray-950 rounded-lg border border-gray-800"
            />
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-cyan-400 mb-3">🔧 Informations Matériel</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-gray-400">Nom</span><span className="text-white">{gpus[selectedGPU].name}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">UUID</span><span className="text-gray-300 font-mono">{gpus[selectedGPU].uuid}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">PCIe</span><span className="text-white">Gen {gpus[selectedGPU].pcieGen} x{gpus[selectedGPU].pcieWidth}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Mémoire</span><span className="text-cyan-400">{gpus[selectedGPU].memoryTotal} GB</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Limite puissance</span><span className="text-orange-400">{gpus[selectedGPU].powerLimit}W</span></div>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-yellow-400 mb-3">⏱️ Fréquences</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-gray-400">Graphics</span><span className="text-white">{gpus[selectedGPU].clocks.graphics} MHz</span></div>
                <div className="flex justify-between"><span className="text-gray-400">SM</span><span className="text-white">{gpus[selectedGPU].clocks.sm} MHz</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Memory</span><span className="text-white">{gpus[selectedGPU].clocks.memory} MHz</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Video</span><span className="text-white">{gpus[selectedGPU].clocks.video} MHz</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Ventilateur</span><span className="text-white">{gpus[selectedGPU].fanSpeed.toFixed(0)}%</span></div>
              </div>
            </div>
          </div>

          {/* Processes on this GPU */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-purple-400 mb-3">📋 Processus sur GPU {selectedGPU}</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-2 text-gray-400">PID</th>
                  <th className="text-left py-2 px-2 text-gray-400">Processus</th>
                  <th className="text-center py-2 px-2 text-gray-400">Type</th>
                  <th className="text-right py-2 px-2 text-gray-400">Mémoire</th>
                  <th className="text-right py-2 px-2 text-gray-400">GPU Util</th>
                </tr>
              </thead>
              <tbody>
                {gpus[selectedGPU].processes.map((proc, i) => (
                  <tr key={i} className="border-b border-gray-800/50">
                    <td className="py-2 px-2 text-gray-400 font-mono">{proc.pid}</td>
                    <td className="py-2 px-2 text-white">{proc.name}</td>
                    <td className="py-2 px-2 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                        proc.type === 'C' ? 'bg-blue-500/20 text-blue-400' :
                        proc.type === 'G' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-pink-500/20 text-pink-400'
                      }`}>{proc.type}</span>
                    </td>
                    <td className="py-2 px-2 text-right text-cyan-400">{proc.memory.toFixed(0)} MB</td>
                    <td className="py-2 px-2 text-right text-green-400">{proc.gpuUtil.toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'processes' && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-bold text-purple-400 mb-3">📋 Tous les Processus GPU</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-2 text-gray-400">GPU</th>
                <th className="text-left py-2 px-2 text-gray-400">PID</th>
                <th className="text-left py-2 px-2 text-gray-400">Processus</th>
                <th className="text-center py-2 px-2 text-gray-400">Type</th>
                <th className="text-right py-2 px-2 text-gray-400">Mémoire</th>
                <th className="text-right py-2 px-2 text-gray-400">GPU Util</th>
              </tr>
            </thead>
            <tbody>
              {gpus.flatMap((gpu, gi) =>
                gpu.processes.map((proc, pi) => (
                  <tr key={`${gi}-${pi}`} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="py-2 px-2 text-green-400 font-bold">GPU {gi}</td>
                    <td className="py-2 px-2 text-gray-400 font-mono">{proc.pid}</td>
                    <td className="py-2 px-2 text-white">{proc.name}</td>
                    <td className="py-2 px-2 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                        proc.type === 'C' ? 'bg-blue-500/20 text-blue-400' :
                        proc.type === 'G' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-pink-500/20 text-pink-400'
                      }`}>{proc.type}</span>
                    </td>
                    <td className="py-2 px-2 text-right text-cyan-400">{proc.memory.toFixed(0)} MB</td>
                    <td className="py-2 px-2 text-right text-green-400">{proc.gpuUtil.toFixed(0)}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Exporter Info */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-bold text-emerald-400 mb-3">🔌 Intégration Monitoring</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="font-bold text-green-400 mb-2">nvitop</div>
            <div className="text-gray-400 space-y-1">
              <div>• Monitoring temps réel</div>
              <div>• Top-like interface</div>
              <div>• Processus par GPU</div>
              <div>• Historique graphiques</div>
            </div>
          </div>
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="font-bold text-blue-400 mb-2">nvidia_gpu_exporter</div>
            <div className="text-gray-400 space-y-1">
              <div>• Métriques Prometheus</div>
              <div>• Export vers Grafana</div>
              <div>• Alerting thresholds</div>
              <div>• Multi-GPU support</div>
            </div>
          </div>
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="font-bold text-purple-400 mb-2">gpu-hot</div>
            <div className="text-gray-400 space-y-1">
              <div>• Détection thermal throttling</div>
              <div>• Optimisation ventilation</div>
              <div>• Alertes température</div>
              <div>• Logging historique</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
