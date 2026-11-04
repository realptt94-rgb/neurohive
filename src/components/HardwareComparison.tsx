import { useState } from 'react'

interface ChipInfo {
  id: string
  name: string
  icon: string
  philosophy: string
  cores: string
  memory: string
  control: string
  bandwidth: string
  determinism: string
  training: string
  power: string
  ecosystem: string
  strengths: string[]
  weaknesses: string[]
  workloads: { task: string; verdict: string; score: number }[]
  color: string
  gradient: string
}

const chips: ChipInfo[] = [
  {
    id: 'cpu',
    name: 'CPU',
    icon: '🧠',
    philosophy: 'Usage général',
    cores: 'Complexe 2-128 cœurs',
    memory: 'L1/L2/L3 + DDR DRAM',
    control: 'Branch prediction + OoOE',
    bandwidth: '~0.5 TB/s',
    determinism: 'Faible',
    training: 'Oui (lentement)',
    power: '50-400W',
    ecosystem: 'Universel',
    strengths: ['Logique à usage général', 'Code avec branches', 'Orchestration système', 'Prétraitement données'],
    weaknesses: ['Maths matricielles parallèles', 'Formation IA à grande échelle', 'Inférence haut débit'],
    workloads: [
      { task: 'Formation LLM 70B+', verdict: 'Non — trop lent', score: 5 },
      { task: 'Inférence LLM', verdict: 'Marginal (<1B uniquement)', score: 15 },
      { task: 'Prétraitement données', verdict: 'Meilleur choix', score: 95 },
      { task: 'Orchestration', verdict: 'Essentiel', score: 100 },
    ],
    color: 'text-emerald-400',
    gradient: 'from-emerald-500/20 to-green-500/5',
  },
  {
    id: 'gpu',
    name: 'GPU',
    icon: '⚡',
    philosophy: 'Calcul parallèle',
    cores: '10K+ cœurs SIMT',
    memory: 'L1/L2 + HBM (off-chip)',
    control: 'Warp scheduler',
    bandwidth: '~8 TB/s (B200)',
    determinism: 'Faible',
    training: 'Meilleur',
    power: '300-1000W',
    ecosystem: 'CUDA (le plus riche)',
    strengths: ['Formation LLM (meilleur)', 'Génération d\'images', 'Fine-tuning', 'Flexibilité totale'],
    weaknesses: ['Consommation élevée', 'Silicium gaspillé en contrôle', 'Pas conçu spécifiquement pour l\'IA'],
    workloads: [
      { task: 'Formation LLM 70B+', verdict: 'Meilleur choix', score: 98 },
      { task: 'Inférence LLM', verdict: 'Bien', score: 85 },
      { task: 'Génération d\'images', verdict: 'Meilleur', score: 99 },
      { task: 'Fine-tuning', verdict: 'Meilleur', score: 97 },
    ],
    color: 'text-red-400',
    gradient: 'from-red-500/20 to-orange-500/5',
  },
  {
    id: 'tpu',
    name: 'TPU',
    icon: '🔷',
    philosophy: 'ASIC Tensor',
    cores: '128×128 réseau systolique',
    memory: 'VMEM + HBM (off-chip)',
    control: 'Compilateur (XLA)',
    bandwidth: '~1.2 TB/s (v4)',
    determinism: 'Haut',
    training: 'Oui (GCP)',
    power: '90-192W',
    ecosystem: 'XLA/JAX/TF',
    strengths: ['Déterminisme compilateur', 'Échelle massive (9216 puces/pod)', 'Efficace sur GCP', 'Moins de silicium de contrôle'],
    weaknesses: ['GCP uniquement', 'Dépendance JAX/XLA', 'Moins flexible que GPU'],
    workloads: [
      { task: 'Formation LLM 70B+', verdict: 'Bien (GCP uniquement)', score: 80 },
      { task: 'Opérations matricielles', verdict: 'Excellent', score: 95 },
      { task: 'Mise à l\'échelle', verdict: 'Meilleur (pods)', score: 98 },
      { task: 'Flexibilité', verdict: 'Limité', score: 40 },
    ],
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-indigo-500/5',
  },
  {
    id: 'npu',
    name: 'NPU',
    icon: '📱',
    philosophy: 'Inférence de contour',
    cores: 'Matrices MAC',
    memory: 'SRAM + LPDDR',
    control: 'Fonction fixe',
    bandwidth: '~100 GB/s',
    determinism: 'Haut',
    training: 'Non',
    power: '4-10W',
    ecosystem: 'SDK vendeurs',
    strengths: ['Ultra faible consommation', 'IA embarquée', 'Traitement caméra temps réel', 'Assistants vocaux locaux'],
    weaknesses: ['Aucune capacité d\'entraînement', 'Dépendance fournisseur', 'Modèles limités'],
    workloads: [
      { task: 'IA embarquée (téléphone)', verdict: 'Meilleur choix', score: 98 },
      { task: 'LLM embarqué', verdict: 'Bien (modèles <7B)', score: 70 },
      { task: 'Traitement caméra', verdict: 'Excellent', score: 99 },
      { task: 'Formation', verdict: 'Impossible', score: 0 },
    ],
    color: 'text-purple-400',
    gradient: 'from-purple-500/20 to-pink-500/5',
  },
  {
    id: 'lpu',
    name: 'LPU',
    icon: '💬',
    philosophy: 'LLM déterministe',
    cores: 'Bandes transporteuses SRAM',
    memory: 'SRAM sur puce uniquement',
    control: 'Compilateur (statique)',
    bandwidth: '~80 TB/s (sur puce)',
    determinism: 'Absolu',
    training: 'Non',
    power: '~150W',
    ecosystem: 'Groq/NVIDIA',
    strengths: ['Latence <1ms déterministe', 'Variance nulle', 'Bande passante 80 TB/s', 'Inférence temps réel'],
    weaknesses: ['Modèles limités (~2GB SRAM)', 'Aucune formation', 'Niche ultra-spécialisée'],
    workloads: [
      { task: 'Agent IA temps réel', verdict: 'Meilleur choix', score: 99 },
      { task: 'Inférence LLM rapide', verdict: 'Excellent', score: 95 },
      { task: 'Streaming tokens', verdict: 'Ultra rapide', score: 98 },
      { task: 'Grands modèles', verdict: 'Limité par SRAM', score: 20 },
    ],
    color: 'text-yellow-400',
    gradient: 'from-yellow-500/20 to-amber-500/5',
  },
]

export default function HardwareComparison() {
  const [selectedChip, setSelectedChip] = useState<string>('gpu')
  const [viewMode, setViewMode] = useState<'overview' | 'detail' | 'spectrum'>('overview')

  const selected = chips.find(c => c.id === selectedChip)!

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          🔬 Architecture du Matériel d'IA
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Analyse approfondie des cinq architectures de processeurs qui alimentent l'IA moderne.
          Aucun ne remplace les autres — les meilleurs systèmes les utilisent conjointement.
        </p>

        {/* Spectrum visualization */}
        <div className="bg-gray-950 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-2 text-center">FLEXIBLE ← → SPÉCIALISÉ</div>
          <div className="flex items-center justify-between relative">
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-yellow-500 opacity-30"></div>
            {chips.map((chip, i) => (
              <button
                key={chip.id}
                onClick={() => { setSelectedChip(chip.id); setViewMode('detail') }}
                className={`relative z-10 flex flex-col items-center gap-1 transition-all hover:scale-110 ${
                  selectedChip === chip.id ? 'scale-125' : ''
                }`}
              >
                <span className="text-2xl">{chip.icon}</span>
                <span className={`text-xs font-bold ${chip.color}`}>{chip.name}</span>
                <div className="text-[9px] text-gray-500 text-center max-w-16">
                  {chip.philosophy}
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-[9px] text-gray-600">
            <span>GENERAL PURPOSE</span>
            <span>SINGLE TASK</span>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2">
        {[
          { id: 'overview' as const, label: '📊 Vue d\'ensemble' },
          { id: 'detail' as const, label: '🔍 Détail' },
          { id: 'spectrum' as const, label: '📈 Comparaison' },
        ].map(v => (
          <button
            key={v.id}
            onClick={() => setViewMode(v.id)}
            className={`px-4 py-2 text-sm rounded-lg border transition-all ${
              viewMode === v.id
                ? 'border-green-400 text-green-400 bg-green-400/10'
                : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {viewMode === 'overview' && <OverviewView chips={chips} onSelect={setSelectedChip} />}
      {viewMode === 'detail' && <DetailView chip={selected} />}
      {viewMode === 'spectrum' && <SpectrumView chips={chips} />}
    </div>
  )
}

function OverviewView({ chips, onSelect }: { chips: ChipInfo[]; onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Architecture Comparison Table */}
      <div className="lg:col-span-3 bg-gray-900/50 border border-gray-800 rounded-xl p-4 overflow-x-auto">
        <h3 className="text-sm font-bold text-green-400 mb-3">📋 Tableau Comparatif Architectural</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-2 px-2 text-gray-400">Aspect</th>
              {chips.map(c => (
                <th key={c.id} className={`text-center py-2 px-2 ${c.color}`}>{c.icon} {c.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { label: 'Philosophie', key: 'philosophy' as const },
              { label: 'Cœurs', key: 'cores' as const },
              { label: 'Mémoire', key: 'memory' as const },
              { label: 'Contrôle', key: 'control' as const },
              { label: 'Bande passante', key: 'bandwidth' as const },
              { label: 'Déterminisme', key: 'determinism' as const },
              { label: 'Entraînement', key: 'training' as const },
              { label: 'Puissance', key: 'power' as const },
              { label: 'Écosystème', key: 'ecosystem' as const },
            ].map(row => (
              <tr key={row.key} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="py-2 px-2 text-gray-400 font-bold">{row.label}</td>
                {chips.map(c => (
                  <td key={c.id} className="py-2 px-2 text-center text-gray-300">{c[row.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chip Cards */}
      {chips.map(chip => (
        <div
          key={chip.id}
          onClick={() => onSelect(chip.id)}
          className={`bg-gradient-to-br ${chip.gradient} border border-gray-700 rounded-xl p-4 cursor-pointer hover:scale-[1.02] transition-all`}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{chip.icon}</span>
            <div>
              <h3 className={`text-lg font-bold ${chip.color}`}>{chip.name}</h3>
              <p className="text-xs text-gray-400">{chip.philosophy}</p>
            </div>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Cœurs</span>
              <span className="text-gray-300">{chip.cores}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Bande passante</span>
              <span className="text-gray-300">{chip.bandwidth}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Puissance</span>
              <span className="text-gray-300">{chip.power}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {chip.strengths.slice(0, 2).map((s, i) => (
              <span key={i} className="text-[9px] px-1.5 py-0.5 bg-green-500/10 text-green-400 rounded">
                ✓ {s}
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* Key Insight */}
      <div className="lg:col-span-3 bg-gradient-to-r from-green-500/5 to-cyan-500/5 border border-green-500/20 rounded-xl p-6">
        <h3 className="text-lg font-bold text-green-400 mb-3">💡 L'Idée Clé</h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          Aucune puce ne l'emporte à elle seule. Les meilleurs systèmes d'IA utilisent une approche hétérogène :
        </p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-4">
          <div className="text-center p-2 bg-gray-900/50 rounded-lg">
            <span className="text-xl">🧠</span>
            <div className="text-xs text-emerald-400 font-bold mt-1">CPU</div>
            <div className="text-[10px] text-gray-400">Orchestre tout</div>
          </div>
          <div className="text-center p-2 bg-gray-900/50 rounded-lg">
            <span className="text-xl">⚡</span>
            <div className="text-xs text-red-400 font-bold mt-1">GPU</div>
            <div className="text-[10px] text-gray-400">Entraînement + inférence lourde</div>
          </div>
          <div className="text-center p-2 bg-gray-900/50 rounded-lg">
            <span className="text-xl">🔷</span>
            <div className="text-xs text-blue-400 font-bold mt-1">TPU</div>
            <div className="text-[10px] text-gray-400">Scale matriciel sur GCP</div>
          </div>
          <div className="text-center p-2 bg-gray-900/50 rounded-lg">
            <span className="text-xl">📱</span>
            <div className="text-xs text-purple-400 font-bold mt-1">NPU</div>
            <div className="text-[10px] text-gray-400">IA périphérique</div>
          </div>
          <div className="text-center p-2 bg-gray-900/50 rounded-lg">
            <span className="text-xl">💬</span>
            <div className="text-xs text-yellow-400 font-bold mt-1">LPU</div>
            <div className="text-[10px] text-gray-400">Inférence temps réel</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailView({ chip }: { chip: ChipInfo }) {
  return (
    <div className="space-y-4">
      {/* Architecture Diagram */}
      <div className={`bg-gradient-to-br ${chip.gradient} border border-gray-700 rounded-xl p-6`}>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{chip.icon}</span>
          <div>
            <h2 className={`text-2xl font-bold ${chip.color}`}>{chip.name}</h2>
            <p className="text-sm text-gray-400">{chip.philosophy}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Cœurs</div>
            <div className={`text-sm font-bold ${chip.color}`}>{chip.cores}</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Mémoire</div>
            <div className={`text-sm font-bold ${chip.color}`}>{chip.memory}</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Contrôle</div>
            <div className={`text-sm font-bold ${chip.color}`}>{chip.control}</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Bande passante</div>
            <div className={`text-sm font-bold ${chip.color}`}>{chip.bandwidth}</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Puissance</div>
            <div className={`text-sm font-bold ${chip.color}`}>{chip.power}</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Écosystème</div>
            <div className={`text-sm font-bold ${chip.color}`}>{chip.ecosystem}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-gray-900/50 border border-green-500/20 rounded-xl p-4">
          <h3 className="text-sm font-bold text-green-400 mb-3">✅ Points Forts</h3>
          <ul className="space-y-2">
            {chip.strengths.map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-green-400">•</span> {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-gray-900/50 border border-red-500/20 rounded-xl p-4">
          <h3 className="text-sm font-bold text-red-400 mb-3">❌ Points Faibles</h3>
          <ul className="space-y-2">
            {chip.weaknesses.map((w, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-red-400">•</span> {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Workload Scores */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-bold text-cyan-400 mb-3">📊 Viabilité des Charges de Travail</h3>
        <div className="space-y-3">
          {chip.workloads.map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-40 text-xs text-gray-400">{w.task}</div>
              <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    w.score > 80 ? 'bg-green-400' : w.score > 50 ? 'bg-yellow-400' : w.score > 20 ? 'bg-orange-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${w.score}%` }}
                ></div>
              </div>
              <div className="w-8 text-xs text-right text-gray-400">{w.score}%</div>
              <div className="w-48 text-xs text-gray-500 hidden md:block">{w.verdict}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Diagram */}
      {chip.id === 'cpu' && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-bold text-emerald-400 mb-3">🏗️ Architecture CPU</h3>
          <pre className="text-[10px] text-gray-400 overflow-x-auto bg-gray-950 rounded-lg p-3">
{`┌──────────────────────────────────────────┐
│           CPU CORE (x1..128)              │
│                                          │
│  Instruction ──► Fetch ──► Decode ──► Execute
│                                          │
│              Branch Predict              │
│                                          │
│  L1 Cache ◄── ALU0  ALU1  ALU2          │
│                                          │
│  L2 Cache ◄── Load/Store Unit           │
└──────────────────────────────────────────┘`}
          </pre>
        </div>
      )}
      {chip.id === 'gpu' && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-bold text-red-400 mb-3">🏗️ Architecture GPU</h3>
          <pre className="text-[10px] text-gray-400 overflow-x-auto bg-gray-950 rounded-lg p-3">
{`┌──────────────────────────────────────────────────┐
│              GPU (10K+ CUDA Cores)                │
│                                                  │
│  ┌─────┐  ┌─────┐  ┌─────┐       ┌──────────┐  │
│  │SM 0 │  │SM 1 │  │SM 2 │  ...  │SM 128    │  │
│  │     │  │     │  │     │       │          │  │
│  │┌───┐│  │┌───┐│  │┌───┐│       │┌────────┐│  │
│  ││32 ││  ││32 ││  ││32 ││       ││Tensor  ││  │
│  ││CUDA│  ││CUDA│  ││CUDA│       ││Cores   ││  │
│  │└───┘│  │└───┘│  │└───┘│       │└────────┘│  │
│  └─────┘  └─────┘  └─────┘       └──────────┘  │
│                                                  │
│  L2 Cache ◄──── HBM (High Bandwidth Memory)     │
└──────────────────────────────────────────────────┘`}
          </pre>
        </div>
      )}
      {chip.id === 'tpu' && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-bold text-blue-400 mb-3">🏗️ Architecture TPU — Réseau Systolique</h3>
          <pre className="text-[10px] text-gray-400 overflow-x-auto bg-gray-950 rounded-lg p-3">
{`┌──────────────────────────────────────────────────┐
│              TPU v4 — Matrix Unit (MXU)           │
│                                                  │
│  Input ──► ┌───┐ ┌───┐ ┌───┐ ┌───┐             │
│            │MAC│→│MAC│→│MAC│→│MAC│──► Output    │
│            └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘             │
│              ↓     ↓     ↓     ↓                 │
│            ┌───┐ ┌───┐ ┌───┐ ┌───┐             │
│            │MAC│→│MAC│→│MAC│→│MAC│──►           │
│            └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘             │
│              ↓     ↓     ↓     ↓                 │
│            128×128 = 16,384 MAC ops/cycle        │
│                                                  │
│  VMEM ◄──── HBM (off-chip)                      │
└──────────────────────────────────────────────────┘`}
          </pre>
        </div>
      )}
    </div>
  )
}

function SpectrumView({ chips }: { chips: ChipInfo[] }) {
  const metrics = [
    { label: 'Flexibilité', values: [100, 80, 30, 20, 10] },
    { label: 'Performance IA', values: [10, 95, 85, 60, 70] },
    { label: 'Efficacité énergétique', values: [30, 40, 70, 95, 80] },
    { label: 'Capacité entraînement', values: [5, 100, 80, 0, 0] },
    { label: 'Latence inférence', values: [20, 60, 70, 80, 100] },
    { label: 'Écosystème', values: [100, 95, 50, 40, 20] },
  ]

  return (
    <div className="space-y-4">
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-bold text-green-400 mb-4">📈 Comparaison Multi-Critères</h3>
        <div className="space-y-4">
          {metrics.map((metric, mi) => (
            <div key={mi}>
              <div className="text-xs text-gray-400 mb-2">{metric.label}</div>
              <div className="space-y-1">
                {chips.map((chip, ci) => (
                  <div key={ci} className="flex items-center gap-2">
                    <span className="w-12 text-xs text-gray-500">{chip.icon} {chip.name}</span>
                    <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${chip.color.replace('text-', 'bg-')} opacity-70`}
                        style={{ width: `${metric.values[ci]}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-xs text-right text-gray-400">{metric.values[ci]}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Use Case Table */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-bold text-cyan-400 mb-3">🎯 Meilleur Processeur par Tâche</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-2 px-2 text-gray-400">Tâche</th>
              <th className="text-left py-2 px-2 text-green-400">Meilleur choix</th>
              <th className="text-left py-2 px-2 text-yellow-400">Finaliste</th>
            </tr>
          </thead>
          <tbody>
            {[
              { task: 'Formation LLM 70B+', best: '⚡ GPU (H100/B200)', runner: '🔷 TPU (GCP)' },
              { task: 'Inférence LLM à grande échelle', best: '⚡ GPU', runner: '💬 LPU (latence critique)' },
              { task: 'IA embarquée (téléphone/PC)', best: '📱 NPU', runner: '🧠 CPU (fallback)' },
              { task: 'Prétraitement données', best: '🧠 CPU', runner: '⚡ GPU (à grande échelle)' },
              { task: 'Agent IA temps réel', best: '💬 LPU', runner: '⚡ GPU' },
              { task: 'Inférence périphérie (IoT)', best: '📱 NPU', runner: '🧠 CPU' },
              { task: 'Opérations matricielles GCP', best: '🔷 TPU', runner: '⚡ GPU' },
              { task: 'Streaming tokens ultra-rapide', best: '💬 LPU', runner: '⚡ GPU' },
            ].map((row, i) => (
              <tr key={i} className="border-b border-gray-800/50">
                <td className="py-2 px-2 text-gray-300">{row.task}</td>
                <td className="py-2 px-2 text-white font-bold">{row.best}</td>
                <td className="py-2 px-2 text-gray-400">{row.runner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Evolution Timeline */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-bold text-purple-400 mb-3">📅 Évolution du Marché IA</h3>
        <div className="space-y-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-gray-500 w-12">2020</span>
            <div className="flex-1 h-6 bg-gray-800 rounded-full overflow-hidden flex">
              <div className="h-full bg-red-400/70 flex items-center justify-center" style={{ width: '86%' }}>GPU 86%</div>
              <div className="h-full bg-blue-400/70 flex items-center justify-center" style={{ width: '14%' }}>Autres</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 w-12">2025</span>
            <div className="flex-1 h-6 bg-gray-800 rounded-full overflow-hidden flex">
              <div className="h-full bg-red-400/70 flex items-center justify-center" style={{ width: '75%' }}>GPU 75%</div>
              <div className="h-full bg-blue-400/70 flex items-center justify-center" style={{ width: '10%' }}>TPU</div>
              <div className="h-full bg-purple-400/70 flex items-center justify-center" style={{ width: '8%' }}>NPU</div>
              <div className="h-full bg-yellow-400/70 flex items-center justify-center" style={{ width: '7%' }}>LPU+ASIC</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 w-12">2026</span>
            <div className="flex-1 h-6 bg-gray-800 rounded-full overflow-hidden flex">
              <div className="h-full bg-red-400/70 flex items-center justify-center" style={{ width: '65%' }}>GPU 65%</div>
              <div className="h-full bg-blue-400/70 flex items-center justify-center" style={{ width: '12%' }}>TPU</div>
              <div className="h-full bg-purple-400/70 flex items-center justify-center" style={{ width: '12%' }}>NPU</div>
              <div className="h-full bg-yellow-400/70 flex items-center justify-center" style={{ width: '11%' }}>LPU+ASIC</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
