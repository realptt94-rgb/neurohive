import { useState } from 'react'

export default function TernaryDeployment() {
  const [selectedPlatform, setSelectedPlatform] = useState('gpu')

  const platforms = {
    gpu: {
      name: 'GPU',
      icon: '⚡',
      color: 'text-red-400',
      border: 'border-red-500/30',
      bg: 'bg-red-500/5',
      generations: [
        { name: 'A100 (Ampere)', year: 2020, int8tops: 624, hbm: '2.0 TB/s', decode1b: '~45 ms', decode7b: '~300 ms', power: '300W' },
        { name: 'H100 (Hopper)', year: 2022, int8tops: 3952, hbm: '3.35 TB/s', decode1b: '~15 ms', decode7b: '~100 ms', power: '350W' },
        { name: 'H200 (Hopper)', year: 2024, int8tops: 3952, hbm: '4.8 TB/s', decode1b: '~10 ms', decode7b: '~70 ms', power: '400W' },
        { name: 'B200 (Blackwell)', year: 2024, int8tops: 9000, hbm: '8.0 TB/s', decode1b: '~5 ms', decode7b: '~35 ms', power: '500W' },
      ],
      amd: [
        { name: 'MI250X (CDNA 2)', year: 2021, int8tops: 383, hbm: '3.2 TB/s', decode1b: '~55 ms', power: '500W' },
        { name: 'MI300X (CDNA 3)', year: 2023, int8tops: 2610, hbm: '5.3 TB/s', decode1b: '~20 ms', power: '750W' },
        { name: 'MI350 (CDNA 4)', year: 2025, int8tops: 5000, hbm: '6.0 TB/s', decode1b: '~12 ms', power: '800W' },
      ],
    },
    cpu: {
      name: 'CPU',
      icon: '🧠',
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/5',
      generations: [
        { name: 'Xeon w9-3595X (AMX)', year: 2024, int8tops: 2000, hbm: 'DDR5', decode1b: '~100 ms', decode7b: '~700 ms', power: '350W' },
        { name: 'Xeon 6 Granite Rapids', year: 2024, int8tops: 3000, hbm: 'DDR5', decode1b: '~80 ms', decode7b: '~560 ms', power: '350W' },
        { name: 'EPYC 9755 Turin', year: 2024, int8tops: 1500, hbm: 'DDR5', decode1b: '~130 ms', decode7b: '~900 ms', power: '500W' },
      ],
      arm: [
        { name: 'Apple M2', year: 2022, int8tops: 0, hbm: '100 GB/s', decode1b: '~350 ms', power: '10W' },
        { name: 'Apple M3', year: 2023, int8tops: 0, hbm: '100 GB/s', decode1b: '~300 ms', power: '10W' },
        { name: 'Apple M4', year: 2024, int8tops: 0, hbm: '120 GB/s', decode1b: '~175 ms', power: '12W' },
      ],
    },
    npu: {
      name: 'NPU',
      icon: '📱',
      color: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/5',
      generations: [
        { name: 'Snapdragon 8 Gen 3', year: 2023, int8tops: 45, hbm: 'LPDDR5X', decode1b: '~200 ms', power: '5W' },
        { name: 'Snapdragon 8 Elite', year: 2024, int8tops: 75, hbm: 'LPDDR5X', decode1b: '~100 ms', power: '6W' },
        { name: 'Apple ANE (A17 Pro)', year: 2023, int8tops: 35, hbm: 'Unified', decode1b: '~150 ms', power: '3W' },
        { name: 'Intel Lunar Lake NPU', year: 2024, int8tops: 48, hbm: 'LPDDR5X', decode1b: '~120 ms', power: '5W' },
        { name: 'AMD XDNA 2', year: 2024, int8tops: 50, hbm: 'LPDDR5X', decode1b: '~100 ms', power: '5W' },
        { name: 'Google EdgeTPU v2', year: 2023, int8tops: 13, hbm: 'DDR4', decode1b: '~500 ms', power: '3W' },
      ],
    },
    fpga: {
      name: 'FPGA',
      icon: '🔧',
      color: 'text-orange-400',
      border: 'border-orange-500/30',
      bg: 'bg-orange-500/5',
      generations: [
        { name: 'ZCU104 (64×64 PE @200MHz)', year: 2023, int8tops: 8, hbm: 'DDR4', decode1b: '~50 ms', power: '5W', native: true },
        { name: 'Alveo U250', year: 2022, int8tops: 50, hbm: 'DDR4', decode1b: '~10 ms', power: '25W', native: true },
        { name: 'Alveo V80 (HBM)', year: 2024, int8tops: 200, hbm: 'HBM2', decode1b: '~3 ms', power: '75W', native: true },
      ],
    },
    asic: {
      name: 'ASIC Ternaire',
      icon: '💎',
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/5',
      generations: [
        { name: 'Ternary ASIC v1 (projeté)', year: 2026, int8tops: 0, hbm: 'SRAM', decode1b: '~50 µs', power: '5W', native: true },
      ],
    },
  }

  const current = platforms[selectedPlatform as keyof typeof platforms]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          🧊 Déploiement de Modèles Ternaires
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Les réseaux ternaires ({'{'}-1, 0, +1{'}'}) offrent une réduction de poids de 20× par rapport au FP32.
          Aucun matériel ne supporte nativement l'arithmétique ternaire — sauf les FPGA et ASIC custom.
          Sur les autres plateformes, on émule via unpack → INT8 GEMM.
        </p>

        {/* Ternary encoding visual */}
        <div className="bg-gray-950 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-2">Encodage ternaire : 10 trits par mot de 16 bits</div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-gray-800 rounded text-xs font-mono">
                <span className="text-red-400">-1</span>
                <span className="text-gray-400"> → </span>
                <span className="text-green-400">soustraire</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-gray-800 rounded text-xs font-mono">
                <span className="text-yellow-400">0</span>
                <span className="text-gray-400"> → </span>
                <span className="text-blue-400">ignorer</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-gray-800 rounded text-xs font-mono">
                <span className="text-green-400">+1</span>
                <span className="text-gray-400"> → </span>
                <span className="text-purple-400">additionner</span>
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-400">
            Avantage : <span className="text-cyan-400">200 MB</span> pour 1B de paramètres ternaires vs <span className="text-red-400">4 GB</span> en FP32
          </div>
        </div>
      </div>

      {/* Platform Selector */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(platforms).map(([key, p]) => (
          <button
            key={key}
            onClick={() => setSelectedPlatform(key)}
            className={`px-4 py-2 text-sm rounded-lg border transition-all ${
              selectedPlatform === key
                ? `${p.border} ${p.color} ${p.bg}`
                : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            {p.icon} {p.name}
          </button>
        ))}
      </div>

      {/* Platform Details */}
      <div className={`${current.bg} border ${current.border} rounded-xl p-4`}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{current.icon}</span>
          <div>
            <h3 className={`text-xl font-bold ${current.color}`}>Déploiement sur {current.name}</h3>
            <p className="text-xs text-gray-400">
              {selectedPlatform === 'fpga' || selectedPlatform === 'asic'
                ? '✅ Support natif ternaire (add/sub/skip)'
                : '⚠️ Émulé via unpack → INT8 GEMM'}
            </p>
          </div>
        </div>

        {/* NVIDIA GPUs */}
        {'generations' in current && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-2 text-gray-400">Plateforme</th>
                  <th className="text-center py-2 px-2 text-gray-400">Année</th>
                  <th className="text-center py-2 px-2 text-gray-400">INT8 TOPS</th>
                  <th className="text-center py-2 px-2 text-gray-400">Bande passante</th>
                  <th className="text-center py-2 px-2 text-gray-400">Decode 1B</th>
                  {selectedPlatform !== 'npu' && <th className="text-center py-2 px-2 text-gray-400">Decode 7B</th>}
                  <th className="text-center py-2 px-2 text-gray-400">Puissance</th>
                  {'native' in current.generations[0] && <th className="text-center py-2 px-2 text-gray-400">Natif?</th>}
                </tr>
              </thead>
              <tbody>
                {current.generations.map((gen, i) => (
                  <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className={`py-2 px-2 font-bold ${current.color}`}>{gen.name}</td>
                    <td className="py-2 px-2 text-center text-gray-400">{gen.year}</td>
                    <td className="py-2 px-2 text-center text-white">{gen.int8tops > 0 ? gen.int8tops.toLocaleString() : 'N/A'}</td>
                    <td className="py-2 px-2 text-center text-cyan-400">{gen.hbm}</td>
                    <td className="py-2 px-2 text-center text-green-400">{gen.decode1b}</td>
                    {selectedPlatform !== 'npu' && <td className="py-2 px-2 text-center text-yellow-400">{(gen as any).decode7b || 'N/A'}</td>}
                    <td className="py-2 px-2 text-center text-orange-400">{gen.power}</td>
                    {'native' in current.generations[0] && (
                      <td className="py-2 px-2 text-center">
                        {(gen as any).native ? (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-[10px]">OUI</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-[10px]">NON</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* AMD GPUs */}
        {'amd' in current && (
          <div className="mt-4">
            <h4 className="text-sm font-bold text-gray-300 mb-2">AMD GPUs (ROCm)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-2 text-gray-400">Plateforme</th>
                    <th className="text-center py-2 px-2 text-gray-400">Année</th>
                    <th className="text-center py-2 px-2 text-gray-400">INT8 TOPS</th>
                    <th className="text-center py-2 px-2 text-gray-400">Bande passante</th>
                    <th className="text-center py-2 px-2 text-gray-400">Decode 1B</th>
                    <th className="text-center py-2 px-2 text-gray-400">Puissance</th>
                  </tr>
                </thead>
                <tbody>
                  {current.amd!.map((gen, i) => (
                    <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="py-2 px-2 font-bold text-orange-400">{gen.name}</td>
                      <td className="py-2 px-2 text-center text-gray-400">{gen.year}</td>
                      <td className="py-2 px-2 text-center text-white">{gen.int8tops.toLocaleString()}</td>
                      <td className="py-2 px-2 text-center text-cyan-400">{gen.hbm}</td>
                      <td className="py-2 px-2 text-center text-green-400">{gen.decode1b}</td>
                      <td className="py-2 px-2 text-center text-orange-400">{gen.power}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ARM CPUs */}
        {'arm' in current && (
          <div className="mt-4">
            <h4 className="text-sm font-bold text-gray-300 mb-2">ARM CPUs (Apple Silicon)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-2 text-gray-400">Chip</th>
                    <th className="text-center py-2 px-2 text-gray-400">Année</th>
                    <th className="text-center py-2 px-2 text-gray-400">INT8 ops/cycle</th>
                    <th className="text-center py-2 px-2 text-gray-400">Bande passante</th>
                    <th className="text-center py-2 px-2 text-gray-400">Decode 1B</th>
                    <th className="text-center py-2 px-2 text-gray-400">Puissance</th>
                  </tr>
                </thead>
                <tbody>
                  {current.arm!.map((gen, i) => (
                    <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="py-2 px-2 font-bold text-emerald-400">{gen.name}</td>
                      <td className="py-2 px-2 text-center text-gray-400">{gen.year}</td>
                      <td className="py-2 px-2 text-center text-white">{[16, 16, 32][i] || 'N/A'}</td>
                      <td className="py-2 px-2 text-center text-cyan-400">{gen.hbm}</td>
                      <td className="py-2 px-2 text-center text-green-400">{gen.decode1b}</td>
                      <td className="py-2 px-2 text-center text-orange-400">{gen.power}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Summary Comparison */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-bold text-green-400 mb-3">📊 Résumé : Toutes les Plateformes (Modèle 1B paramètres)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-2 text-gray-400">Plateforme</th>
                <th className="text-center py-2 px-2 text-gray-400">Natif?</th>
                <th className="text-center py-2 px-2 text-gray-400">Decode 1B</th>
                <th className="text-center py-2 px-2 text-gray-400">Puissance</th>
                <th className="text-center py-2 px-2 text-gray-400">Efficacité</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'NVIDIA B200', native: false, decode: '~5 ms', power: '500W', eff: '10 ms/J', color: 'text-red-400' },
                { name: 'NVIDIA H100', native: false, decode: '~15 ms', power: '350W', eff: '4.3 ms/J', color: 'text-red-400' },
                { name: 'NVIDIA A100', native: false, decode: '~45 ms', power: '300W', eff: '1.5 ms/J', color: 'text-red-400' },
                { name: 'AMD MI300X', native: false, decode: '~20 ms', power: '750W', eff: '2.0 ms/J', color: 'text-orange-400' },
                { name: 'Intel Xeon 6', native: false, decode: '~100 ms', power: '350W', eff: '0.29 ms/J', color: 'text-emerald-400' },
                { name: 'Apple M4', native: false, decode: '~175 ms', power: '12W', eff: '5-7 tok/J', color: 'text-emerald-400' },
                { name: 'Snapdragon 8 Elite', native: false, decode: '~100 ms', power: '6W', eff: 'N/A', color: 'text-purple-400' },
                { name: 'Apple ANE', native: false, decode: '~150 ms', power: '3W', eff: 'N/A', color: 'text-purple-400' },
                { name: 'FPGA ZCU104', native: true, decode: '~50 ms', power: '5W', eff: '~10× GPU', color: 'text-orange-400' },
                { name: 'FPGA Alveo U250', native: true, decode: '~10 ms', power: '25W', eff: '~5× GPU', color: 'text-orange-400' },
                { name: 'ASIC Ternaire (projeté)', native: true, decode: '~50 µs', power: '5W', eff: 'OPTIMAL', color: 'text-cyan-400' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className={`py-2 px-2 font-bold ${row.color}`}>{row.name}</td>
                  <td className="py-2 px-2 text-center">
                    {row.native ? (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-[10px]">NATIF</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-[10px]">ÉMULÉ</span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-center text-white">{row.decode}</td>
                  <td className="py-2 px-2 text-center text-orange-400">{row.power}</td>
                  <td className="py-2 px-2 text-center text-cyan-400">{row.eff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900/50 border border-green-500/20 rounded-xl p-4">
          <h3 className="text-sm font-bold text-green-400 mb-3">🔑 Points Clés</h3>
          <ul className="space-y-2 text-xs text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">1.</span>
              <span><strong className="text-orange-400">FPGA</strong> = seule plateforme actuelle avec datapath ternaire natif</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">2.</span>
              <span><strong className="text-red-400">Blackwell B200</strong> réduit l'écart avec un ASIC custom (~5ms vs ~50µs)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">3.</span>
              <span><strong className="text-purple-400">NPU mobiles</strong> permettent l'inférence 1B sur smartphone grâce à la réduction 20×</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">4.</span>
              <span>L'avantage <strong className="text-cyan-400">ASIC ternaire</strong> est maximal sur edge (5W) où chaque opération compte</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-4">
          <h3 className="text-sm font-bold text-cyan-400 mb-3">📐 Stockage Ternaire</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">FP32 (1B params)</span>
              <div className="flex-1 mx-3 h-3 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-400 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <span className="text-red-400 font-bold">4 GB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">INT8 (1B params)</span>
              <div className="flex-1 mx-3 h-3 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <span className="text-yellow-400 font-bold">1 GB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Ternary (1B params)</span>
              <div className="flex-1 mx-3 h-3 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '5%' }}></div>
              </div>
              <span className="text-cyan-400 font-bold">200 MB</span>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-700 text-gray-400">
              Réduction : <span className="text-cyan-400 font-bold">20×</span> vs FP32 | <span className="text-cyan-400 font-bold">5×</span> vs INT8
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
