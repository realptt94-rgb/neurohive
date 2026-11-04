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
import NeuronsPanel from './components/NeuronsPanel'
import DNRTPanel from './components/DNRTPanel'
import CognitiveArchitecture from './components/CognitiveArchitecture'
import NeuronalEnsembles from './components/NeuronalEnsembles'
import MorphoAnalysis from './components/MorphoAnalysis'
import NVIDIAIntegration from './components/NVIDIAIntegration'
import StatsBar from './components/StatsBar'
import { NeuroHiveProvider, useNeuroHive } from './context/NeuroHiveContext'

function ConnectionStatus() {
  const { isConnected } = useNeuroHive();
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
      <span className={`text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
        {isConnected ? 'CONNECTÉ' : 'DÉCONNECTÉ'}
      </span>
    </div>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('cognitive')
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const tabs = [
    { id: 'nvidia', label: '🤖 NVIDIA AI', category: 'core' },
    { id: 'cognitive', label: '🧠 Architecture Cognitive', category: 'core' },
    { id: 'ensembles', label: '🎯 Ensembles Neuronaux', category: 'core' },
    { id: 'morpho', label: '🌳 Morphologie', category: 'core' },
    { id: 'dnrt', label: '🧬 DNRT Vivant', category: 'neuro' },
    { id: 'neurons', label: '📹 NEURONS fMRI', category: 'neuro' },
    { id: 'hive', label: '🐝 Ruche IA', category: 'system' },
    { id: 'hardware', label: '🔬 Matériel IA', category: 'system' },
    { id: 'processors', label: '⚡ Processeurs', category: 'system' },
    { id: 'gpu-monitor', label: '📊 GPU Monitor', category: 'system' },
    { id: 'ternary', label: '🧊 Ternaire', category: 'system' },
    { id: 'agents', label: '🤖 Agents', category: 'system' },
    { id: 'memory', label: '💾 Mémoire', category: 'system' },
    { id: 'guards', label: '🛡️ Gardes', category: 'system' },
    { id: 'network', label: '🌐 Réseau', category: 'system' },
  ]

  const categories = [
    { id: 'core', label: '🎯 Core Cognitive', color: 'from-emerald-500 to-cyan-500' },
    { id: 'neuro', label: '🧬 Neurosciences', color: 'from-purple-500 to-pink-500' },
    { id: 'system', label: '⚙️ Système IA', color: 'from-blue-500 to-indigo-500' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Background animated grid */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-[1800px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-purple-500 flex items-center justify-center animate-pulse-glow">
                <span className="text-2xl">🧠</span>
              </div>
              <div>
              <h1 className="text-3xl font-bold gradient-text">
                NeuroHive v5.0
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Système Autonome • NVIDIA AI Intégré • Architecture Cognitive • 100% Indépendant
              </p>              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden md:block">
                <div className="text-xs text-slate-500 uppercase tracking-wider">Cycle</div>
                <div className="text-emerald-400 font-bold text-lg">{tick.toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                <div className="text-sm text-emerald-400 font-semibold">ACTIF</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <StatsBar tick={tick} />

      {/* Navigation */}
      <nav className="relative z-10 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0">
        <div className="max-w-[1800px] mx-auto px-6">
          {categories.map(category => (
            <div key={category.id} className="py-3">
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-1 w-8 rounded bg-gradient-to-r ${category.color}`}></div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {category.label}
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {tabs.filter(tab => tab.category === category.id).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-2.5 text-sm whitespace-nowrap rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-[1800px] mx-auto px-6 py-8">
        <div className="animate-fade-in">
          {activeTab === 'nvidia' && <NVIDIAIntegration />}
          {activeTab === 'cognitive' && <CognitiveArchitecture />}
          {activeTab === 'ensembles' && <NeuronalEnsembles />}
          {activeTab === 'morpho' && <MorphoAnalysis />}
          {activeTab === 'dnrt' && <DNRTPanel tick={tick} />}
          {activeTab === 'neurons' && <NeuronsPanel tick={tick} />}
          {activeTab === 'hive' && <HiveVisualization tick={tick} />}
          {activeTab === 'hardware' && <HardwareComparison />}
          {activeTab === 'processors' && <ProcessorGrid tick={tick} />}
          {activeTab === 'gpu-monitor' && <GPUMonitor tick={tick} />}
          {activeTab === 'ternary' && <TernaryDeployment />}
          {activeTab === 'agents' && <AgentPanel tick={tick} />}
          {activeTab === 'memory' && <MemoryPanel tick={tick} />}
          {activeTab === 'guards' && <GuardPanel tick={tick} />}
          {activeTab === 'network' && <NetworkFlow tick={tick} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-950/80 backdrop-blur-xl mt-12">
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <div>
              NeuroHive v5.0 — Système Autonome avec NVIDIA AI Intégré
            </div>
            <div className="flex items-center gap-4">
              <ConnectionStatus />
              <span>NVIDIA Nemotron • Llama Guard • RFDiffusion • 100% Autonome</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <NeuroHiveProvider>
      <AppContent />
    </NeuroHiveProvider>
  )
}

export default App
