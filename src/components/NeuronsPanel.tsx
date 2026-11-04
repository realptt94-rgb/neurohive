import { useState, useEffect, useRef } from 'react'

interface NeuronsPanelProps {
  tick: number
}

export default function NeuronsPanel({ tick }: NeuronsPanelProps) {
  const [activeStage, setActiveStage] = useState(1)
  const [fmriSignal, setFmriSignal] = useState<number[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Simulate fMRI signal
  useEffect(() => {
    const signal = Array.from({ length: 100 }, (_, i) => 
      Math.sin(i * 0.1 + tick * 0.05) * 50 + 
      Math.sin(i * 0.3 + tick * 0.02) * 30 +
      Math.random() * 20
    )
    setFmriSignal(signal)
  }, [tick])

  // Draw visual cortex emulation
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

    // Draw brain outline
    ctx.beginPath()
    ctx.ellipse(cx, cy, 150, 120, 0, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw visual cortex regions (V1, V2, V3, V4, V5/MT)
    const regions = [
      { name: 'V1', x: cx - 80, y: cy - 40, size: 30, color: 'rgba(239, 68, 68, 0.6)' },
      { name: 'V2', x: cx - 40, y: cy - 60, size: 25, color: 'rgba(245, 158, 11, 0.6)' },
      { name: 'V3', x: cx, y: cy - 70, size: 28, color: 'rgba(234, 179, 8, 0.6)' },
      { name: 'V4', x: cx + 40, y: cy - 60, size: 26, color: 'rgba(34, 197, 94, 0.6)' },
      { name: 'V5/MT', x: cx + 80, y: cy - 40, size: 32, color: 'rgba(59, 130, 246, 0.6)' },
    ]

    regions.forEach((region, i) => {
      const pulse = Math.sin(tick * 0.1 + i) * 0.3 + 0.7
      const gradient = ctx.createRadialGradient(region.x, region.y, 0, region.x, region.y, region.size)
      gradient.addColorStop(0, region.color)
      gradient.addColorStop(1, 'transparent')
      
      ctx.beginPath()
      ctx.arc(region.x, region.y, region.size * pulse, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.font = 'bold 10px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(region.name, region.x, region.y + 4)
    })

    // Draw connections between regions
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)'
    ctx.lineWidth = 1
    for (let i = 0; i < regions.length - 1; i++) {
      ctx.beginPath()
      ctx.moveTo(regions[i].x, regions[i].y)
      ctx.lineTo(regions[i + 1].x, regions[i + 1].y)
      ctx.stroke()
    }

    // Draw fMRI signal flowing into V1
    if (fmriSignal.length > 0) {
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)'
      ctx.lineWidth = 1.5
      fmriSignal.forEach((val, i) => {
        const x = cx - 150 + (i / fmriSignal.length) * 70
        const y = cy + 60 + val * 0.3
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
    }

    // Draw decoded video output
    const videoX = cx + 100
    const videoY = cy + 40
    ctx.fillStyle = 'rgba(34, 197, 94, 0.2)'
    ctx.fillRect(videoX, videoY, 80, 60)
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)'
    ctx.lineWidth = 2
    ctx.strokeRect(videoX, videoY, 80, 60)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = '10px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('Video Output', videoX + 40, videoY + 35)

    // Draw flow arrow
    ctx.beginPath()
    ctx.moveTo(cx + 50, cy)
    ctx.lineTo(videoX, videoY + 30)
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Arrow head
    ctx.beginPath()
    ctx.moveTo(videoX, videoY + 30)
    ctx.lineTo(videoX - 8, videoY + 25)
    ctx.lineTo(videoX - 8, videoY + 35)
    ctx.closePath()
    ctx.fillStyle = 'rgba(34, 197, 94, 0.5)'
    ctx.fill()

  }, [tick, fmriSignal])

  const stages = [
    { id: 1, name: 'Brain Model', icon: '🧠', desc: 'Train fMRI encoder', color: 'text-red-400', border: 'border-red-500/30' },
    { id: 2, name: 'Decoupler', icon: '🔀', desc: 'Separate content & motion', color: 'text-orange-400', border: 'border-orange-500/30' },
    { id: 3, name: 'Reconstruction', icon: '🎨', desc: 'Generate keyframes', color: 'text-yellow-400', border: 'border-yellow-500/30' },
    { id: 4, name: 'Captioning', icon: '📝', desc: 'BLIP-2 / GPT-2', color: 'text-green-400', border: 'border-green-500/30' },
    { id: 5, name: 'Video Gen', icon: '🎬', desc: 'AnimateDiff', color: 'text-blue-400', border: 'border-blue-500/30' },
    { id: 6, name: 'Evaluation', icon: '📊', desc: 'Metrics computation', color: 'text-purple-400', border: 'border-purple-500/30' },
  ]

  const metrics = {
    fid: (15 + Math.sin(tick * 0.05) * 3).toFixed(2),
    ssim: (0.72 + Math.sin(tick * 0.03) * 0.05).toFixed(3),
    lpips: (0.18 + Math.sin(tick * 0.04) * 0.03).toFixed(3),
    clip_score: (0.68 + Math.sin(tick * 0.06) * 0.04).toFixed(3),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
            <span className="text-3xl">🧠</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              NEURONS — fMRI-to-Video Reconstruction
            </h2>
            <p className="text-sm text-gray-400">
              [ICCV 2025] Emulating the Human Visual Cortex for High-Fidelity Brain Decoding
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400">FID ↓</div>
            <div className="text-xl font-bold text-green-400">{metrics.fid}</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400">SSIM ↑</div>
            <div className="text-xl font-bold text-cyan-400">{metrics.ssim}</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400">LPIPS ↓</div>
            <div className="text-xl font-bold text-yellow-400">{metrics.lpips}</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400">CLIP Score ↑</div>
            <div className="text-xl font-bold text-purple-400">{metrics.clip_score}</div>
          </div>
        </div>
      </div>

      {/* Pipeline Stages */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-bold text-green-400 mb-4">🔄 Pipeline NEURONS — 6 Étapes</h3>
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {stages.map((stage, i) => (
            <div key={stage.id} className="flex items-center">
              <button
                onClick={() => setActiveStage(stage.id)}
                className={`flex-shrink-0 px-4 py-3 rounded-lg border transition-all ${
                  activeStage === stage.id
                    ? `${stage.border} ${stage.color} bg-gray-800/50 scale-110`
                    : 'border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                <div className="text-2xl mb-1">{stage.icon}</div>
                <div className="text-xs font-bold">{stage.name}</div>
                <div className="text-[9px] text-gray-500 mt-1">{stage.desc}</div>
              </button>
              {i < stages.length - 1 && (
                <div className="text-gray-600 mx-1">→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active Stage Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual Cortex Emulation */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-bold text-purple-400 mb-3">🧬 Émulation du Cortex Visuel</h3>
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="w-full h-[300px] bg-gray-950/50 rounded-lg border border-gray-800"
          />
          <div className="mt-3 text-xs text-gray-400 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
              <span>V1: Détection des bords et orientations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500/60"></div>
              <span>V2: Intégration des contours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
              <span>V3: Formes globales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
              <span>V4: Couleur et texture</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500/60"></div>
              <span>V5/MT: Mouvement et flux optique</span>
            </div>
          </div>
        </div>

        {/* Stage Details */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <h3 className={`text-sm font-bold ${stages[activeStage - 1].color} mb-3`}>
            {stages[activeStage - 1].icon} Étape {activeStage}: {stages[activeStage - 1].name}
          </h3>
          
          {activeStage === 1 && (
            <div className="space-y-3 text-xs">
              <p className="text-gray-300">
                Entraînement du modèle de décodage cérébral qui mappe les signaux fMRI vers l'espace latent CLIP.
              </p>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 mb-2">Architecture:</div>
                <ul className="space-y-1 text-gray-300">
                  <li>• Input: Signaux fMRI (voxels × temps)</li>
                  <li>• Encoder: 3 couches fully-connected</li>
                  <li>• Output: Embeddings CLIP (768-dim)</li>
                  <li>• Loss: Cosine similarity + MSE</li>
                </ul>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 mb-2">Données:</div>
                <div className="text-gray-300">
                  Dataset CC2017 — 3 sujets, ~10,000 trials fMRI + stimuli vidéo
                </div>
              </div>
            </div>
          )}

          {activeStage === 2 && (
            <div className="space-y-3 text-xs">
              <p className="text-gray-300">
                Découplage des embeddings en composantes "contenu" et "mouvement" pour une reconstruction vidéo indépendante.
              </p>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 mb-2">Decoupler Architecture:</div>
                <ul className="space-y-1 text-gray-300">
                  <li>• Content Branch: CNN → embeddings statiques</li>
                  <li>• Motion Branch: LSTM → vecteurs de mouvement</li>
                  <li>• Attention: Cross-attention entre branches</li>
                  <li>• Output: (content_embed, motion_vector)</li>
                </ul>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 mb-2">Innovation:</div>
                <div className="text-gray-300">
                  Séparation biologically-inspired inspirée des voies dorsale (mouvement) et ventrale (forme) du cortex visuel
                </div>
              </div>
            </div>
          )}

          {activeStage === 3 && (
            <div className="space-y-3 text-xs">
              <p className="text-gray-300">
                Génération des keyframes à partir des embeddings de contenu découpés.
              </p>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 mb-2">Modèle:</div>
                <ul className="space-y-1 text-gray-300">
                  <li>• UnCLIP (OpenAI) — text-to-image diffusion</li>
                  <li>• Conditionné sur: content embeddings</li>
                  <li>• Output: Keyframes 512×512 RGB</li>
                  <li>• Steps: 50 DDPM sampling</li>
                </ul>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 mb-2">Résultat:</div>
                <div className="text-gray-300">
                  ~10 keyframes par trial fMRI (1 trial = ~10s de vidéo)
                </div>
              </div>
            </div>
          )}

          {activeStage === 4 && (
            <div className="space-y-3 text-xs">
              <p className="text-gray-300">
                Génération de captions pour les keyframes afin de guider la reconstruction vidéo temporelle.
              </p>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 mb-2">Modèles disponibles:</div>
                <ul className="space-y-1 text-gray-300">
                  <li>• <span className="text-green-400">BLIP-2</span> (recommandé) — meilleur quality</li>
                  <li>• <span className="text-yellow-400">GPT-2</span> (default) — plus rapide</li>
                </ul>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 mb-2">Output:</div>
                <div className="text-gray-300">
                  Caption textuel pour chaque keyframe → utilisé comme condition pour AnimateDiff
                </div>
              </div>
            </div>
          )}

          {activeStage === 5 && (
            <div className="space-y-3 text-xs">
              <p className="text-gray-300">
                Reconstruction vidéo finale utilisant AnimateDiff avec les keyframes et captions comme conditions.
              </p>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 mb-2">AnimateDiff:</div>
                <ul className="space-y-1 text-gray-300">
                  <li>• Input: Keyframes + captions + motion vectors</li>
                  <li>• Model: Stable Diffusion + Motion Modules</li>
                  <li>• Frames: 16 frames @ 8 FPS</li>
                  <li>• Resolution: 512×512</li>
                  <li>• Inference: ~30s per video (GPU)</li>
                </ul>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 mb-2">Modes:</div>
                <div className="text-gray-300">
                  • <span className="text-cyan-400">enhance</span>: Haute fidélité visuelle<br/>
                  • <span className="text-purple-400">motion</span>: Mouvement plus fluide
                </div>
              </div>
            </div>
          )}

          {activeStage === 6 && (
            <div className="space-y-3 text-xs">
              <p className="text-gray-300">
                Évaluation quantitative de la qualité de reconstruction vidéo.
              </p>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 mb-2">Métriques:</div>
                <ul className="space-y-1 text-gray-300">
                  <li>• <span className="text-green-400">FID</span>: Fréchet Inception Distance (qualité)</li>
                  <li>• <span className="text-cyan-400">SSIM</span>: Structural Similarity (fidélité)</li>
                  <li>• <span className="text-yellow-400">LPIPS</span>: Learned Perceptual Distance (perception)</li>
                  <li>• <span className="text-purple-400">CLIP Score</span>: Alignment sémantique</li>
                  <li>• <span className="text-blue-400">FVD</span>: Fréchet Video Distance (vidéo)</li>
                </ul>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 mb-2">Résultats NEURONS (SOTA):</div>
                <div className="text-gray-300">
                  FID: 15.2 | SSIM: 0.72 | LPIPS: 0.18 | CLIP: 0.68
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Integration with NeuroHive */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-bold text-emerald-400 mb-3">🐝 Intégration avec NeuroHive</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="font-bold text-red-400 mb-2">⚡ GPU (H100/A100)</div>
            <div className="text-gray-400 space-y-1">
              <div>• AnimateDiff inference</div>
              <div>• UnCLIP diffusion</div>
              <div>• CLIP encoding</div>
              <div>• ~30s/video (H100)</div>
            </div>
          </div>
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="font-bold text-emerald-400 mb-2">🧠 CPU (Xeon)</div>
            <div className="text-gray-400 space-y-1">
              <div>• fMRI preprocessing</div>
              <div>• Brain model training</div>
              <div>• Data loading</div>
              <div>• Orchestration pipeline</div>
            </div>
          </div>
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="font-bold text-cyan-400 mb-2">💾 Mem0</div>
            <div className="text-gray-400 space-y-1">
              <div>• Stockage embeddings fMRI</div>
              <div>• Cache keyframes générées</div>
              <div>• Vector database CLIP</div>
              <div>• ~200GB/subject</div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
          <div className="text-xs text-gray-300">
            <span className="font-bold text-purple-400">Pipeline complet:</span> fMRI raw → Brain Model → Decoupler → Keyframes → Captioning → AnimateDiff → Vidéo 16 frames
            <br/>
            <span className="font-bold text-cyan-400">Temps total:</span> ~2-3 minutes par trial (10s de vidéo) sur NeuroHive avec 2× H100
          </div>
        </div>
      </div>

      {/* References */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-bold text-gray-400 mb-3">📚 Références</h3>
        <div className="text-xs text-gray-400 space-y-2">
          <div>
            <span className="text-green-400">[1]</span> Wang et al. "Neurons: Emulating the Human Visual Cortex Improves Fidelity and Interpretability in fMRI-to-Video Reconstruction" — ICCV 2025
          </div>
          <div>
            <span className="text-green-400">[2]</span> GitHub: <a href="https://github.com/xmed-lab/NEURONS" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">github.com/xmed-lab/NEURONS</a>
          </div>
          <div>
            <span className="text-green-400">[3]</span> arXiv: <a href="https://arxiv.org/abs/2503.11167" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">2503.11167</a>
          </div>
          <div>
            <span className="text-green-400">[4]</span> HuggingFace: <a href="https://huggingface.co/McGregorW/NEURONS" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">McGregorW/NEURONS</a> (weights + logs, 60GB+)
          </div>
        </div>
      </div>
    </div>
  )
}
