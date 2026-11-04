import { useEffect, useRef } from 'react'

interface NetworkFlowProps {
  tick: number
}

interface Node {
  id: number
  x: number
  y: number
  type: 'machine' | 'guard' | 'supervisor' | 'agent' | 'memory'
  label: string
  connections: number[]
}

export default function NetworkFlow({ tick }: NetworkFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)

    // Draw background particles (network traffic)
    for (let i = 0; i < 50; i++) {
      const x = (tick * (0.5 + i * 0.1) + i * 100) % width
      const y = (Math.sin(tick * 0.02 + i) * 50 + height / 2 + (i - 25) * 8)
      const alpha = 0.1 + Math.sin(tick * 0.05 + i) * 0.1
      ctx.beginPath()
      ctx.arc(x, y, 1.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`
      ctx.fill()
    }

    // Draw machines in a circle
    const machines = 8
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.35

    // Draw connection lines between machines
    for (let i = 0; i < machines; i++) {
      const angle1 = (i / machines) * Math.PI * 2 - Math.PI / 2
      const x1 = centerX + Math.cos(angle1) * radius
      const y1 = centerY + Math.sin(angle1) * radius

      for (let j = i + 1; j < machines; j++) {
        const angle2 = (j / machines) * Math.PI * 2 - Math.PI / 2
        const x2 = centerX + Math.cos(angle2) * radius
        const y2 = centerY + Math.sin(angle2) * radius

        // Animated connection
        const pulse = Math.sin(tick * 0.1 + i + j) * 0.5 + 0.5
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = `rgba(34, 197, 94, ${0.05 + pulse * 0.1})`
        ctx.lineWidth = 0.5
        ctx.stroke()

        // Data packet animation
        const packetPos = ((tick * 0.02 + i * 0.1 + j * 0.05) % 1)
        const px = x1 + (x2 - x1) * packetPos
        const py = y1 + (y2 - y1) * packetPos
        ctx.beginPath()
        ctx.arc(px, py, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(6, 182, 212, ${0.3 + pulse * 0.4})`
        ctx.fill()
      }
    }

    // Draw machines
    for (let i = 0; i < machines; i++) {
      const angle = (i / machines) * Math.PI * 2 - Math.PI / 2
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      // Machine glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 40)
      gradient.addColorStop(0, 'rgba(34, 197, 94, 0.2)')
      gradient.addColorStop(1, 'transparent')
      ctx.beginPath()
      ctx.arc(x, y, 40, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Machine circle
      ctx.beginPath()
      ctx.arc(x, y, 25, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(17, 24, 39, 0.9)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Machine label
      ctx.fillStyle = '#22c55e'
      ctx.font = 'bold 10px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(`M-${String.fromCharCode(65 + i)}`, x, y - 3)

      // Sub-components
      ctx.fillStyle = '#6b7280'
      ctx.font = '8px monospace'
      ctx.fillText('GPU+TPU+NPU', x, y + 8)

      // Activity indicator
      const activity = Math.sin(tick * 0.1 + i) * 0.5 + 0.5
      ctx.beginPath()
      ctx.arc(x + 20, y - 20, 4, 0, Math.PI * 2)
      ctx.fillStyle = activity > 0.7 ? '#22c55e' : activity > 0.3 ? '#f59e0b' : '#6b7280'
      ctx.fill()
    }

    // Center - Core Hive
    const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 60)
    coreGradient.addColorStop(0, 'rgba(239, 68, 68, 0.3)')
    coreGradient.addColorStop(0.5, 'rgba(239, 68, 68, 0.1)')
    coreGradient.addColorStop(1, 'transparent')
    ctx.beginPath()
    ctx.arc(centerX, centerY, 60, 0, Math.PI * 2)
    ctx.fillStyle = coreGradient
    ctx.fill()

    // Core shield (Guard)
    ctx.beginPath()
    ctx.arc(centerX, centerY, 35, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(17, 24, 39, 0.95)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)'
    ctx.lineWidth = 3
    ctx.stroke()

    // Rotating shield ring
    const shieldAngle = tick * 0.03
    ctx.beginPath()
    ctx.arc(centerX, centerY, 40, shieldAngle, shieldAngle + Math.PI * 1.5)
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = '#ef4444'
    ctx.font = 'bold 12px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('🛡️ GARDE', centerX, centerY - 5)
    ctx.fillStyle = '#9ca3af'
    ctx.font = '9px monospace'
    ctx.fillText('Entrée/Sortie', centerX, centerY + 10)

    // Draw info labels
    ctx.fillStyle = '#6b7280'
    ctx.font = '10px monospace'
    ctx.textAlign = 'left'
    ctx.fillText(`Machines: ${machines}`, 10, 20)
    ctx.fillText(`Connexions: ${machines * (machines - 1) / 2}`, 10, 35)
    ctx.fillText(`Paquets/cycle: ${Math.floor(20 + Math.sin(tick * 0.1) * 10)}`, 10, 50)
    ctx.fillText(`Bande passante: ${(2.4 + Math.sin(tick * 0.05) * 0.8).toFixed(1)} GB/s`, 10, 65)

    // Legend
    ctx.textAlign = 'right'
    ctx.fillStyle = '#22c55e'
    ctx.fillText('● Machine active', width - 10, 20)
    ctx.fillStyle = '#f59e0b'
    ctx.fillText('● Charge modérée', width - 10, 35)
    ctx.fillStyle = '#06b6d4'
    ctx.fillText('● Paquet de données', width - 10, 50)
    ctx.fillStyle = '#ef4444'
    ctx.fillText('● Garde (I/O unique)', width - 10, 65)

  }, [tick])

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-green-400">🌐 Réseau Distribué — Topologie Mesh</h2>
          <span className="text-xs text-gray-500">Cycle #{tick}</span>
        </div>
        <canvas
          ref={canvasRef}
          width={900}
          height={500}
          className="w-full h-[450px] bg-gray-950/50 rounded-lg border border-gray-800"
        />
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-bold text-cyan-400 mb-3">📡 Protocole de Communication</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Protocole</span>
              <span className="text-white">gRPC + WebSocket</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Sérialisation</span>
              <span className="text-white">Protocol Buffers</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Compression</span>
              <span className="text-white">Zstd Level 3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Chiffrement</span>
              <span className="text-green-400">TLS 1.3 + AES-256</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Discovery</span>
              <span className="text-white">mDNS + Consul</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-bold text-purple-400 mb-3">🔄 Synchronisation</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Consensus</span>
              <span className="text-white">Raft (tolérance f=2)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Gradients</span>
              <span className="text-white">All-Reduce Ring</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">État</span>
              <span className="text-white">CRDT Vector Clock</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Heartbeat</span>
              <span className="text-white">100ms interval</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Recovery</span>
              <span className="text-green-400">Auto-restart &lt;5s</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-bold text-yellow-400 mb-3">⚡ Performance Réseau</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Latence P50</span>
              <span className="text-green-400">{(2 + Math.sin(tick * 0.1) * 0.5).toFixed(1)}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Latence P99</span>
              <span className="text-yellow-400">{(12 + Math.sin(tick * 0.08) * 3).toFixed(1)}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Débit</span>
              <span className="text-cyan-400">{(2.4 + Math.sin(tick * 0.05) * 0.8).toFixed(1)} GB/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Packets/s</span>
              <span className="text-purple-400">{(45000 + Math.floor(Math.sin(tick * 0.1) * 5000)).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Erreurs</span>
              <span className="text-green-400">0.001%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-bold text-green-400 mb-4">🏗️ Architecture Globale du Système</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="p-3 bg-green-500/5 border border-green-500/20 rounded-lg text-center">
            <div className="text-2xl mb-1">📥</div>
            <div className="text-xs font-bold text-green-400">Entrée</div>
            <div className="text-[10px] text-gray-400">API REST/gRPC</div>
          </div>
          <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg text-center">
            <div className="text-2xl mb-1">🛡️</div>
            <div className="text-xs font-bold text-red-400">Garde ×1</div>
            <div className="text-[10px] text-gray-400">Auth + Rate Limit</div>
          </div>
          <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg text-center">
            <div className="text-2xl mb-1">👁️</div>
            <div className="text-xs font-bold text-yellow-400">Superviseurs ×4</div>
            <div className="text-[10px] text-gray-400">Orchestration</div>
          </div>
          <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg text-center">
            <div className="text-2xl mb-1">⚒️🔢</div>
            <div className="text-xs font-bold text-purple-400">Ouvriers + Math</div>
            <div className="text-[10px] text-gray-400">Calcul distribué</div>
          </div>
          <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg text-center">
            <div className="text-2xl mb-1">📤</div>
            <div className="text-xs font-bold text-blue-400">Sortie</div>
            <div className="text-[10px] text-gray-400">Streaming/Réponse</div>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="text-pink-400">🧠 LLM ×8</span>
            <span>•</span>
            <span className="text-cyan-400">💾 Mem0 ×4</span>
            <span>•</span>
            <span className="text-emerald-400">⚡ 32 Processeurs</span>
            <span>•</span>
            <span className="text-gray-300">🖥️ 8 Machines</span>
          </div>
        </div>
      </div>
    </div>
  )
}
