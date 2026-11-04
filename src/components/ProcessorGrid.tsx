import { useEffect, useState } from 'react'

interface ProcessorGridProps {
  tick: number
}

interface Processor {
  id: number
  type: 'GPU' | 'TPU' | 'NPU' | 'ASIC'
  name: string
  load: number
  temp: number
  memory: number
  cores: number
  active: boolean
  machine: string
}

export default function ProcessorGrid({ tick }: ProcessorGridProps) {
  const [processors, setProcessors] = useState<Processor[]>([])

  useEffect(() => {
    const machines = ['Machine-A', 'Machine-B', 'Machine-C', 'Machine-D', 'Machine-E', 'Machine-F', 'Machine-G', 'Machine-H']
    const types: Processor['type'][] = ['GPU', 'TPU', 'NPU', 'ASIC']
    const names: Record<string, string[]> = {
      GPU: ['NVIDIA H100', 'AMD MI300X', 'NVIDIA B200', 'Intel Gaudi3'],
      TPU: ['Google TPU v5p', 'Google TPU v6', 'AWS Trainium2', 'Azure Maia'],
      NPU: ['Intel NPU', 'Qualcomm Hexagon', 'Apple Neural', 'Huawei Ascend'],
      ASIC: ['NeuroHive-α', 'NeuroHive-β', 'NeuroHive-γ', 'NeuroHive-δ'],
    }

    const procs: Processor[] = []
    for (let i = 0; i < 32; i++) {
      const type = types[i % 4]
      procs.push({
        id: i,
        type,
        name: names[type][i % 4],
        load: 30 + Math.random() * 60,
        temp: 45 + Math.random() * 30,
        memory: 40 + Math.random() * 50,
        cores: [80, 128, 64, 256][i % 4],
        active: Math.random() > 0.05,
        machine: machines[i % 8],
      })
    }
    setProcessors(procs)
  }, [])

  useEffect(() => {
    setProcessors(prev => prev.map(p => ({
      ...p,
      load: Math.min(99, Math.max(10, p.load + (Math.random() - 0.5) * 8)),
      temp: Math.min(95, Math.max(35, p.temp + (Math.random() - 0.5) * 3)),
      memory: Math.min(98, Math.max(20, p.memory + (Math.random() - 0.5) * 5)),
    })))
  }, [tick])

  const typeColors: Record<string, { bg: string; text: string; border: string }> = {
    GPU: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
    TPU: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
    NPU: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
    ASIC: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  }

  const summary = {
    GPU: processors.filter(p => p.type === 'GPU'),
    TPU: processors.filter(p => p.type === 'TPU'),
    NPU: processors.filter(p => p.type === 'NPU'),
    ASIC: processors.filter(p => p.type === 'ASIC'),
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(summary).map(([type, procs]) => {
          const colors = typeColors[type]
          const avgLoad = procs.reduce((s, p) => s + p.load, 0) / procs.length
          const avgTemp = procs.reduce((s, p) => s + p.temp, 0) / procs.length
          const totalCores = procs.reduce((s, p) => s + p.cores, 0)
          return (
            <div key={type} className={`${colors.bg} border ${colors.border} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-lg font-bold ${colors.text}`}>{type}</span>
                <span className="text-xs text-gray-400">{procs.length} unités</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Charge moy.</span>
                  <span className={colors.text}>{avgLoad.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Temp moy.</span>
                  <span className={avgTemp > 75 ? 'text-red-400' : colors.text}>{avgTemp.toFixed(1)}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Cœurs totaux</span>
                  <span className="text-white font-bold">{totalCores}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Processor Grid */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <h2 className="text-lg font-bold text-green-400 mb-4">⚡ Grille de Processeurs Cognitifs</h2>
        <p className="text-xs text-gray-400 mb-4">
          32 processeurs spécialisés répartis sur 8 machines à faible consommation.
          Chaque processeur exécute en continu des modèles d'apprentissage profond et du calcul matriciel.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {processors.map(proc => {
            const colors = typeColors[proc.type]
            return (
              <div
                key={proc.id}
                className={`${colors.bg} border ${colors.border} rounded-lg p-2 transition-all hover:scale-105 cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold ${colors.text}`}>{proc.type}</span>
                  <div className={`w-2 h-2 rounded-full ${proc.active ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`}></div>
                </div>
                <div className="text-[9px] text-gray-400 truncate">{proc.name}</div>
                <div className="text-[9px] text-gray-500">{proc.machine}</div>
                <div className="mt-1 space-y-0.5">
                  <div className="flex items-center gap-1">
                    <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          proc.load > 80 ? 'bg-red-400' : proc.load > 60 ? 'bg-yellow-400' : 'bg-green-400'
                        }`}
                        style={{ width: `${proc.load}%` }}
                      ></div>
                    </div>
                    <span className="text-[8px] text-gray-500">{proc.load.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          proc.temp > 80 ? 'bg-red-400' : 'bg-cyan-400'
                        }`}
                        style={{ width: `${(proc.temp / 100) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-[8px] text-gray-500">{proc.temp.toFixed(0)}°</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Power Consumption */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-bold text-emerald-400 mb-3">🔋 Consommation Énergétique</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(summary).map(([type, procs]) => {
            const colors = typeColors[type]
            const avgPower = procs.reduce((s, p) => s + (p.load / 100) * [350, 200, 15, 50][['GPU','TPU','NPU','ASIC'].indexOf(type)], 0)
            return (
              <div key={type} className="text-center">
                <div className={`text-2xl font-bold ${colors.text}`}>{avgPower.toFixed(0)}W</div>
                <div className="text-xs text-gray-400">{type} total</div>
                <div className="text-[10px] text-gray-500">{(avgPower / procs.length).toFixed(1)}W/unité</div>
              </div>
            )
          })}
          <div className="col-span-2 md:col-span-4 text-center pt-2 border-t border-gray-800">
            <span className="text-xs text-gray-400">Consommation totale estimée: </span>
            <span className="text-lg font-bold text-emerald-400">
              {Object.entries(summary).reduce((total, [type, procs]) =>
                total + procs.reduce((s, p) => s + (p.load / 100) * [350, 200, 15, 50][['GPU','TPU','NPU','ASIC'].indexOf(type)], 0), 0
              ).toFixed(0)}W
            </span>
            <span className="text-xs text-gray-500 ml-2">(optimisé faible consommation)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
