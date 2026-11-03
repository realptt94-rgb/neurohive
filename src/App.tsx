import { useState, useEffect } from 'react'
import HiveVisualization from './components/HiveVisualization'
import ProcessorGrid from './components/ProcessorGrid'
import AgentPanel from './components/AgentPanel'
import MemoryPanel from './components/MemoryPanel'
import GuardPanel from './components/GuardPanel'
import NetworkFlow from './components/NetworkFlow'
import HardwareComparison from './components/HardwareComparison'
import TernaryDeployment from './components/TernaryDeployment'
import GPUMonitor from './components/GPUMonitor'
import StatsBar from './components/StatsBar'

function App() {
  const [activeTab, setActiveTab] = useState('hive')
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const tabs = [
    { id: 'hive', label: '🐝 Ruche' },
    { id: 'hardware', label: '🔬 Matériel IA' },
    { id: 'processors', label: '⚡ Processeurs' },
    { id: 'gpu-monitor', label: '📊 GPU Monitor' },
    { id: 'ternary', label: '🧊 Ternaire' },
    { id: 'agents', label: '🤖 Agents' },
    { id: 'memory', label: '🧠 Mémoire' },
    { id: 'guards', label: '🛡️ Gardes' },
    { id: 'network', label: '🌐 Réseau' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white font-mono overflow-hidden">
      {/* Background animated grid */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0,255,136,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-green-500/30 bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center animate-pulse">
              <span className="text-xl">🐝</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                NeuroHive
              </h1>
              <p className="text-xs text-gray-400">Ruche d'IA Distribuée • CPU+GPU+TPU+NPU+LPU • Modèles Ternaires</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <div className="text-xs text-gray-500">CYCLE</div>
              <div className="text-green-400 font-bold">{tick.toLocaleString()}</div>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-ping"></div>
            <div className="text-xs text-green-400">ACTIF</div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <StatsBar tick={tick} />

      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-green-400 text-green-400 bg-green-400/5'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-[1600px] mx-auto px-4 py-6">
        {activeTab === 'hive' && <HiveVisualization tick={tick} />}
        {activeTab === 'hardware' && <HardwareComparison />}
        {activeTab === 'processors' && <ProcessorGrid tick={tick} />}
        {activeTab === 'gpu-monitor' && <GPUMonitor tick={tick} />}
        {activeTab === 'ternary' && <TernaryDeployment />}
        {activeTab === 'agents' && <AgentPanel tick={tick} />}
        {activeTab === 'memory' && <MemoryPanel tick={tick} />}
        {activeTab === 'guards' && <GuardPanel tick={tick} />}
        {activeTab === 'network' && <NetworkFlow tick={tick} />}
      </main>
    </div>
  )
}

export default App
