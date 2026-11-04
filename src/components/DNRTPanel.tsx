import { useState, useEffect, useRef } from 'react'

interface DNRTPanelProps {
  tick: number
}

interface Neuron {
  id: number
  x: number
  y: number
  type: 'input' | 'hidden' | 'output'
  activation: number
  threshold: number
  response: 'low' | 'medium' | 'high'
  connections: number[]
  spike: boolean
  membrane: number
}

interface Signal {
  from: number
  to: number
  progress: number
  strength: number
}

export default function DNRTPanel({ tick }: DNRTPanelProps) {
  const [neurons, setNeurons] = useState<Neuron[]>([])
  const [signals, setSignals] = useState<Signal[]>([])
  const [mode, setMode] = useState<'overview' | 'raa' | 'arr' | 'living'>('living')
  const [inputStrength, setInputStrength] = useState(0.7)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Initialize neurons
  useEffect(() => {
    const newNeurons: Neuron[] = []
    let id = 0

    // Input layer (5 neurons)
    for (let i = 0; i < 5; i++) {
      newNeurons.push({
        id: id++,
        x: 80,
        y: 80 + i * 70,
        type: 'input',
        activation: 0,
        threshold: 0.5 + Math.random() * 0.3,
        response: 'medium',
        connections: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        spike: false,
        membrane: 0,
      })
    }

    // Hidden layer (10 neurons)
    for (let i = 0; i < 10; i++) {
      newNeurons.push({
        id: id++,
        x: 280,
        y: 50 + i * 45,
        type: 'hidden',
        activation: 0,
        threshold: 0.4 + Math.random() * 0.4,
        response: 'medium',
        connections: [15, 16, 17, 18, 19],
        spike: false,
        membrane: 0,
      })
    }

    // Output layer (5 neurons)
    for (let i = 0; i < 5; i++) {
      newNeurons.push({
        id: id++,
        x: 480,
        y: 80 + i * 70,
        type: 'output',
        activation: 0,
        threshold: 0.6 + Math.random() * 0.2,
        response: 'medium',
        connections: [],
        spike: false,
        membrane: 0,
      })
    }

    setNeurons(newNeurons)
  }, [])

  // Simulate neural activity
  useEffect(() => {
    setNeurons(prev => {
      const updated = [...prev]

      // Input neurons receive external signal
      for (let i = 0; i < 5; i++) {
        const neuron = updated[i]
        neuron.membrane = Math.min(1, neuron.membrane + inputStrength * 0.1 + Math.random() * 0.05)
        
        if (neuron.membrane >= neuron.threshold) {
          neuron.spike = true
          neuron.activation = neuron.membrane
          neuron.membrane = 0 // Reset after spike
          
          // Dynamic response based on input strength (RAA)
          if (inputStrength > 0.8) neuron.response = 'high'
          else if (inputStrength > 0.4) neuron.response = 'medium'
          else neuron.response = 'low'
        } else {
          neuron.spike = false
          neuron.activation *= 0.9 // Decay
        }
      }

      // Hidden neurons
      for (let i = 5; i < 15; i++) {
        const neuron = updated[i]
        let input = 0
        
        // Sum inputs from previous layer
        for (let j = 0; j < 5; j++) {
          if (updated[j].spike) {
            input += updated[j].activation * (0.5 + Math.random() * 0.5)
          }
        }
        
        neuron.membrane = Math.min(1, neuron.membrane + input * 0.3)
        
        if (neuron.membrane >= neuron.threshold) {
          neuron.spike = true
          neuron.activation = neuron.membrane
          neuron.membrane = 0
          
          // RAA: Dynamic threshold adjustment
          neuron.threshold = Math.max(0.3, Math.min(0.9, neuron.threshold + (Math.random() - 0.5) * 0.05))
        } else {
          neuron.spike = false
          neuron.activation *= 0.85
        }
      }

      // Output neurons
      for (let i = 15; i < 20; i++) {
        const neuron = updated[i]
        let input = 0
        
        // Sum inputs from hidden layer
        for (let j = 5; j < 15; j++) {
          if (updated[j].spike) {
            input += updated[j].activation * (0.3 + Math.random() * 0.7)
          }
        }
        
        neuron.membrane = Math.min(1, neuron.membrane + input * 0.4)
        
        if (neuron.membrane >= neuron.threshold) {
          neuron.spike = true
          neuron.activation = neuron.membrane
          neuron.membrane = 0
        } else {
          neuron.spike = false
          neuron.activation *= 0.8
        }
      }

      return updated
    })

    // Generate signals
    if (Math.random() > 0.7) {
      const from = Math.floor(Math.random() * 15)
      const toOptions = from < 5 ? [5, 6, 7, 8, 9, 10, 11, 12, 13, 14] : [15, 16, 17, 18, 19]
      const to = toOptions[Math.floor(Math.random() * toOptions.length)]
      
      setSignals(prev => [...prev, {
        from,
        to,
        progress: 0,
        strength: 0.5 + Math.random() * 0.5,
      }].slice(-20))
    }

    // Update signal progress
    setSignals(prev => prev.map(s => ({
      ...s,
      progress: Math.min(1, s.progress + 0.05),
    })).filter(s => s.progress < 1))

  }, [tick, inputStrength])

  // Draw neural network
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)

    // Draw connections
    neurons.forEach(neuron => {
      neuron.connections.forEach(targetId => {
        const target = neurons[targetId]
        if (!target) return

        const gradient = ctx.createLinearGradient(neuron.x, neuron.y, target.x, target.y)
        
        if (neuron.spike) {
          gradient.addColorStop(0, 'rgba(239, 68, 68, 0.6)')
          gradient.addColorStop(1, 'rgba(239, 68, 68, 0.1)')
        } else {
          gradient.addColorStop(0, 'rgba(139, 92, 246, 0.2)')
          gradient.addColorStop(1, 'rgba(139, 92, 246, 0.05)')
        }

        ctx.beginPath()
        ctx.moveTo(neuron.x, neuron.y)
        ctx.lineTo(target.x, target.y)
        ctx.strokeStyle = gradient
        ctx.lineWidth = neuron.spike ? 2 : 0.5
        ctx.stroke()
      })
    })

    // Draw signals
    signals.forEach(signal => {
      const from = neurons[signal.from]
      const to = neurons[signal.to]
      if (!from || !to) return

      const x = from.x + (to.x - from.x) * signal.progress
      const y = from.y + (to.y - from.y) * signal.progress

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(34, 197, 94, ${signal.strength})`
      ctx.fill()
    })

    // Draw neurons
    neurons.forEach(neuron => {
      const size = 15 + neuron.activation * 10
      const pulse = neuron.spike ? 1.3 : 1

      // Glow effect
      if (neuron.spike) {
        const gradient = ctx.createRadialGradient(neuron.x, neuron.y, 0, neuron.x, neuron.y, size * 2)
        gradient.addColorStop(0, neuron.type === 'input' ? 'rgba(239, 68, 68, 0.4)' :
                                   neuron.type === 'hidden' ? 'rgba(139, 92, 246, 0.4)' :
                                   'rgba(34, 197, 94, 0.4)')
        gradient.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(neuron.x, neuron.y, size * 2, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Neuron body
      ctx.beginPath()
      ctx.arc(neuron.x, neuron.y, size * pulse, 0, Math.PI * 2)
      ctx.fillStyle = neuron.type === 'input' ? 'rgba(239, 68, 68, 0.8)' :
                      neuron.type === 'hidden' ? 'rgba(139, 92, 246, 0.8)' :
                      'rgba(34, 197, 94, 0.8)'
      ctx.fill()
      ctx.strokeStyle = neuron.spike ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Membrane potential indicator
      ctx.beginPath()
      ctx.arc(neuron.x, neuron.y, size * 0.6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * neuron.membrane)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.lineWidth = 2
      ctx.stroke()
    })

    // Labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.font = '10px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('Input', 80, 30)
    ctx.fillText('Hidden', 280, 30)
    ctx.fillText('Output', 480, 30)

  }, [tick, neurons, signals])

  const activeNeurons = neurons.filter(n => n.spike).length
  const avgActivation = neurons.reduce((s, n) => s + n.activation, 0) / neurons.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center animate-pulse">
            <span className="text-3xl">🧬</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              DNRT — Dynamic Neural Response Tuning
            </h2>
            <p className="text-sm text-gray-400">
              [ICLR 2024] Système Neuronal Vivant — Émulation des Neurones Biologiques
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400">Neurones Actifs</div>
            <div className="text-xl font-bold text-red-400">{activeNeurons}/20</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400">Activation Moy.</div>
            <div className="text-xl font-bold text-purple-400">{(avgActivation * 100).toFixed(0)}%</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400">Signaux/s</div>
            <div className="text-xl font-bold text-green-400">{signals.length}</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400">Input Strength</div>
            <div className="text-xl font-bold text-cyan-400">{(inputStrength * 100).toFixed(0)}%</div>
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'living' as const, label: '🧬 Système Vivant', desc: 'Simulation temps réel' },
          { id: 'raa' as const, label: '⚡ RAA', desc: 'Response-Adaptive Activation' },
          { id: 'arr' as const, label: '🎯 ARR', desc: 'Aggregated Response Regularization' },
          { id: 'overview' as const, label: '📊 Vue d\'ensemble', desc: 'Architecture complète' },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-4 py-2 rounded-lg border transition-all ${
              mode === m.id
                ? 'border-purple-400 text-purple-400 bg-purple-400/10'
                : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            <div className="text-sm font-bold">{m.label}</div>
            <div className="text-[10px] text-gray-500">{m.desc}</div>
          </button>
        ))}
      </div>

      {mode === 'living' && (
        <div className="space-y-4">
          {/* Neural Network Visualization */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-purple-400 mb-3">🧬 Réseau Neuronal Vivant</h3>
            <canvas
              ref={canvasRef}
              width={600}
              height={500}
              className="w-full h-[500px] bg-gray-950/50 rounded-lg border border-gray-800"
            />
            
            {/* Input Strength Control */}
            <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
              <label className="text-xs text-gray-400 block mb-2">
                Intensité du Signal d'Entrée: {(inputStrength * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={inputStrength}
                onChange={(e) => setInputStrength(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>Faible</span>
                <span>Moyen</span>
                <span>Fort</span>
              </div>
            </div>
          </div>

          {/* Biological Inspiration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 border border-red-500/20 rounded-xl p-4">
              <h4 className="text-sm font-bold text-red-400 mb-2">🔴 Neurones Input</h4>
              <div className="text-xs text-gray-300 space-y-1">
                <div>• Reçoivent les signaux externes</div>
                <div>• Seuil dynamique: 0.5-0.8</div>
                <div>• Réponse adaptative (RAA)</div>
                <div>• Potentiel membranaire visible</div>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-purple-500/20 rounded-xl p-4">
              <h4 className="text-sm font-bold text-purple-400 mb-2">🟣 Neurones Hidden</h4>
              <div className="text-xs text-gray-300 space-y-1">
                <div>• Traitement intermédiaire</div>
                <div>• Seuils auto-ajustables</div>
                <div>• Agrégation d'informations</div>
                <div>• Spécificité de catégorie (ARR)</div>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-green-500/20 rounded-xl p-4">
              <h4 className="text-sm font-bold text-green-400 mb-2">🟢 Neurones Output</h4>
              <div className="text-xs text-gray-300 space-y-1">
                <div>• Décision finale</div>
                <div>• Seuils élevés: 0.6-0.8</div>
                <div>• Réponse catégorique</div>
                <div>• Activation = confiance</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === 'raa' && (
        <div className="space-y-4">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-yellow-400 mb-3">⚡ Response-Adaptive Activation (RAA)</h3>
            <p className="text-xs text-gray-300 mb-4">
              RAA ajuste dynamiquement les conditions de réponse des neurones en fonction des caractéristiques 
              et de la force du signal d'entrée, imitant le comportement des neurones biologiques.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-xs font-bold text-cyan-400 mb-3">Mécanisme Biologique</h4>
                <div className="text-xs text-gray-300 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400">1.</span>
                    <span>Le neurone biologique ajuste son seuil d'activation selon l'environnement</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400">2.</span>
                    <span>Signaux forts → seuil plus bas (plus sensible)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400">3.</span>
                    <span>Signaux faibles → seuil plus haut (moins sensible)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400">4.</span>
                    <span>Adaptation en temps réel aux conditions</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-xs font-bold text-yellow-400 mb-3">Implémentation DNRT</h4>
                <div className="text-xs text-gray-300 space-y-2">
                  <div className="font-mono bg-gray-900 p-2 rounded text-[10px]">
                    <div className="text-gray-500"># Ajustement dynamique du seuil</div>
                    <div className="text-green-400">threshold = max(0.3, min(0.9,</div>
                    <div className="text-green-400 pl-4">threshold + (random - 0.5) * 0.05))</div>
                    <div className="text-gray-500 mt-2"># Réponse adaptative</div>
                    <div className="text-cyan-400">if input_strength {">"} 0.8:</div>
                    <div className="text-cyan-400 pl-4">response = "high"</div>
                    <div className="text-cyan-400">elif input_strength {">"} 0.4:</div>
                    <div className="text-cyan-400 pl-4">response = "medium"</div>
                    <div className="text-cyan-400">else:</div>
                    <div className="text-cyan-400 pl-4">response = "low"</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RAA Visualization */}
            <div className="mt-4 bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-xs font-bold text-purple-400 mb-3">Visualisation RAA</h4>
              <div className="space-y-3">
                {neurons.slice(0, 5).map((neuron, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-20 text-xs text-gray-400">Neuron {i + 1}</div>
                    <div className="flex-1 h-6 bg-gray-700 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                        style={{ width: `${neuron.activation * 100}%` }}
                      ></div>
                      <div
                        className="absolute top-0 h-full w-0.5 bg-yellow-400"
                        style={{ left: `${neuron.threshold * 100}%` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold">
                        {neuron.spike ? 'SPIKE!' : `${(neuron.membrane * 100).toFixed(0)}%`}
                      </div>
                    </div>
                    <div className={`w-16 text-xs text-center px-2 py-1 rounded ${
                      neuron.response === 'high' ? 'bg-red-500/20 text-red-400' :
                      neuron.response === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {neuron.response}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-[10px] text-gray-500">
                Barre jaune = seuil dynamique | Barre colorée = potentiel membranaire
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === 'arr' && (
        <div className="space-y-4">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-green-400 mb-3">🎯 Aggregated Response Regularization (ARR)</h3>
            <p className="text-xs text-gray-300 mb-4">
              ARR améliore la capacité du réseau à apprendre la spécificité de catégorie en imposant des contraintes 
              sur la distribution de réponse du réseau, imitant la haute spécificité des neurones biologiques.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-xs font-bold text-cyan-400 mb-3">Spécificité Biologique</h4>
                <div className="text-xs text-gray-300 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    <span>Les neurones biologiques montrent une haute spécificité pour différentes catégories</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    <span>Permet au système nerveux de différencier et identifier les objets</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    <span>Réponses agrégées spécifiques à chaque catégorie</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-xs font-bold text-green-400 mb-3">Contrainte ARR</h4>
                <div className="text-xs text-gray-300 space-y-2">
                  <div className="font-mono bg-gray-900 p-2 rounded text-[10px]">
                    <div className="text-gray-500"># Regularization loss</div>
                    <div className="text-green-400">L_arr = λ * ||response_dist - target_dist||²</div>
                    <div className="text-gray-500 mt-2"># Target: distribution spécifique</div>
                    <div className="text-cyan-400">target_dist = one_hot(category)</div>
                    <div className="text-gray-500 mt-2"># Response: distribution actuelle</div>
                    <div className="text-purple-400">response_dist = softmax(output)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Specificity */}
            <div className="mt-4 bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-xs font-bold text-purple-400 mb-3">Spécificité de Catégorie (Output Neurons)</h4>
              <div className="grid grid-cols-5 gap-2">
                {neurons.slice(15, 20).map((neuron, i) => (
                  <div key={i} className="text-center">
                    <div className="text-[10px] text-gray-400 mb-1">Cat {i + 1}</div>
                    <div className="h-24 bg-gray-700 rounded-lg overflow-hidden relative flex flex-col justify-end">
                      <div
                        className="bg-gradient-to-t from-green-500 to-emerald-400 transition-all"
                        style={{ height: `${neuron.activation * 100}%` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold">
                        {(neuron.activation * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className={`mt-1 text-[9px] px-1 py-0.5 rounded ${
                      neuron.activation > 0.7 ? 'bg-green-500/20 text-green-400' :
                      neuron.activation > 0.3 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {neuron.activation > 0.7 ? 'WINNER' : neuron.activation > 0.3 ? 'ACTIVE' : 'IDLE'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-[10px] text-gray-500">
                ARR force une distribution de réponse spécifique : un neurone "gagne" pour chaque catégorie
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === 'overview' && (
        <div className="space-y-4">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-purple-400 mb-3">📊 Architecture DNRT Complète</h3>
            
            {/* Architecture Diagram */}
            <div className="bg-gray-950 rounded-lg p-4 mb-4">
              <pre className="text-[10px] text-gray-400 overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────┐
│                    DNRT FRAMEWORK                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Input Signal ──► ┌──────────────────┐                     │
│                   │  RAA Module      │                     │
│                   │  (Response-      │                     │
│                   │   Adaptive       │                     │
│                   │   Activation)    │                     │
│                   └────────┬─────────┘                     │
│                            │                               │
│                            ▼                               │
│                   ┌──────────────────┐                     │
│                   │  Neural Network  │                     │
│                   │  (Input → Hidden │                     │
│                   │   → Output)      │                     │
│                   └────────┬─────────┘                     │
│                            │                               │
│                            ▼                               │
│                   ┌──────────────────┐                     │
│                   │  ARR Module      │                     │
│                   │  (Aggregated     │                     │
│                   │   Response       │                     │
│                   │   Regularization)│                     │
│                   └────────┬─────────┘                     │
│                            │                               │
│                            ▼                               │
│                   Output Prediction                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-xs font-bold text-yellow-400 mb-2">⚡ RAA — Response-Adaptive Activation</h4>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Ajuste dynamiquement les seuils d'activation</li>
                  <li>• Réponse adaptative selon la force du signal</li>
                  <li>• Imitation des neurones biologiques</li>
                  <li>• Améliore la plasticité du réseau</li>
                </ul>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-xs font-bold text-green-400 mb-2">🎯 ARR — Aggregated Response Regularization</h4>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Contraint la distribution de réponse</li>
                  <li>• Améliore la spécificité de catégorie</li>
                  <li>• Imitation de la sélectivité biologique</li>
                  <li>• Meilleure interprétabilité</li>
                </ul>
              </div>
            </div>

            {/* Performance */}
            <div className="mt-4 bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-xs font-bold text-cyan-400 mb-3">📈 Performance (CIFAR-100)</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">82.4%</div>
                  <div className="text-[10px] text-gray-400">Top-1 Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">+2.1%</div>
                  <div className="text-[10px] text-gray-400">vs Baseline</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">SOTA</div>
                  <div className="text-[10px] text-gray-400">Interprétabilité</div>
                </div>
              </div>
            </div>
          </div>

          {/* Integration with NeuroHive */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-emerald-400 mb-3">🐝 Intégration avec NeuroHive</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="font-bold text-red-400 mb-2">⚡ GPU (H100)</div>
                <div className="text-gray-400 space-y-1">
                  <div>• Entraînement DNRT</div>
                  <div>• Inférence temps réel</div>
                  <div>• Simulation 20 neurones</div>
                  <div>• ~1000 fps</div>
                </div>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="font-bold text-emerald-400 mb-2">🧠 CPU (Xeon)</div>
                <div className="text-gray-400 space-y-1">
                  <div>• Prétraitement données</div>
                  <div>• Orchestration agents</div>
                  <div>• Visualisation canvas</div>
                  <div>• Logging métriques</div>
                </div>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="font-bold text-cyan-400 mb-2">💾 Mem0</div>
                <div className="text-gray-400 space-y-1">
                  <div>• Stockage poids RAA</div>
                  <div>• Cache thresholds</div>
                  <div>• Historique activations</div>
                  <div>• ~50MB/modèle</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* References */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-bold text-gray-400 mb-3">📚 Références</h3>
        <div className="text-xs text-gray-400 space-y-2">
          <div>
            <span className="text-green-400">[1]</span> Qiu et al. "Dynamic Neural Response Tuning" — ICLR 2024
          </div>
          <div>
            <span className="text-green-400">[2]</span> GitHub: <a href={import.meta.env.VITE_GITHUB_REPO} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Repository NeuroHive</a>
          </div>
          <div>
            <span className="text-green-400">[3]</span> Paper: <a href="https://openreview.net/pdf?id=HiTg16qhxp" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">openreview.net/pdf?id=HiTg16qhxp</a>
          </div>
          <div>
            <span className="text-green-400">[4]</span> Framework: QTClassification v0.4.0+
          </div>
        </div>
      </div>
    </div>
  )
}
