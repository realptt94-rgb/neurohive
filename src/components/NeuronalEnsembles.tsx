import { useState, useEffect, useRef } from 'react';

export default function NeuronalEnsembles() {
  const [selectedEnsemble, setSelectedEnsemble] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [frame, setFrame] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulated neuronal data
  const neurons = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 400 + 50,
    y: Math.random() * 400 + 50,
    radius: Math.random() * 8 + 4,
    activity: Math.random(),
  }));

  const ensembles = [
    {
      id: 0,
      name: 'ONsemble 1',
      type: 'ON',
      color: '#10b981',
      neurons: [0, 5, 12, 18, 23, 31, 37, 42],
      description: 'Activated by visual stimulus →',
    },
    {
      id: 1,
      name: 'OFFsemble 1',
      type: 'OFF',
      color: '#ef4444',
      neurons: [2, 8, 15, 21, 28, 34, 40, 47],
      description: 'Silenced by visual stimulus →',
    },
    {
      id: 2,
      name: 'ONsemble 2',
      type: 'ON',
      color: '#06b6d4',
      neurons: [1, 7, 14, 19, 25, 32, 38, 44],
      description: 'Activated by auditory stimulus ♪',
    },
    {
      id: 3,
      name: 'OFFsemble 2',
      type: 'OFF',
      color: '#f59e0b',
      neurons: [3, 9, 16, 22, 29, 35, 41, 48],
      description: 'Silenced by auditory stimulus ♪',
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setFrame((prev) => prev + 1);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw neurons
    neurons.forEach((neuron, i) => {
      const ensemble = ensembles.find(e => e.neurons.includes(i));
      const isSelected = ensemble && ensemble.id === selectedEnsemble;
      const activity = Math.sin((frame + i) * 0.1) * 0.5 + 0.5;

      // Neuron body
      const gradient = ctx.createRadialGradient(
        neuron.x, neuron.y, 0,
        neuron.x, neuron.y, neuron.radius * 2
      );

      if (isSelected) {
        gradient.addColorStop(0, ensemble.color);
        gradient.addColorStop(1, 'transparent');
      } else {
        gradient.addColorStop(0, `rgba(148, 163, 184, ${activity * 0.5})`);
        gradient.addColorStop(1, 'transparent');
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, neuron.radius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Neuron core
      ctx.fillStyle = isSelected ? ensemble!.color : '#64748b';
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, neuron.radius, 0, Math.PI * 2);
      ctx.fill();

      // Activity indicator
      if (isSelected && activity > 0.7) {
        ctx.strokeStyle = ensemble!.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, neuron.radius + 5, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Draw ensemble connections
    const currentEnsemble = ensembles[selectedEnsemble];
    currentEnsemble.neurons.forEach((neuronId, i) => {
      const neuron = neurons[neuronId];
      currentEnsemble.neurons.slice(i + 1).forEach((targetId) => {
        const target = neurons[targetId];
        ctx.strokeStyle = currentEnsemble.color + '40';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(neuron.x, neuron.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      });
    });

  }, [frame, selectedEnsemble]);

  // Generate raster plot data
  const rasterData = Array.from({ length: 50 }, (_, neuronId) => {
    const ensemble = ensembles.find(e => e.neurons.includes(neuronId));
    return Array.from({ length: 100 }, (_, frame) => {
      if (ensemble && ensemble.id === selectedEnsemble) {
        return Math.sin((frame + neuronId) * 0.2) > 0.3 ? 1 : 0;
      }
      return Math.random() > 0.9 ? 1 : 0;
    });
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold gradient-text mb-2">
              Xsembles2P — Ensembles Neuronaux
            </h2>
            <p className="text-slate-400">
              Analyse d'imagerie calcique deux photons — Identification ONsembles/OFFsembles
            </p>
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn-primary"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="metric-card">
            <div className="metric-value text-emerald-500">50</div>
            <div className="metric-label">Neurones</div>
          </div>
          <div className="metric-card">
            <div className="metric-value text-cyan-500">4</div>
            <div className="metric-label">Ensembles</div>
          </div>
          <div className="metric-card">
            <div className="metric-value text-red-500">2</div>
            <div className="metric-label">ONsembles</div>
          </div>
          <div className="metric-card">
            <div className="metric-value text-amber-500">2</div>
            <div className="metric-label">OFFsembles</div>
          </div>
        </div>
      </div>

      {/* Ensemble Selection */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-4">
          🎯 Sélection Ensemble
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ensembles.map((ensemble) => (
            <button
              key={ensemble.id}
              onClick={() => setSelectedEnsemble(ensemble.id)}
              className={`glass-card p-4 text-left transition-all ${
                selectedEnsemble === ensemble.id ? 'scale-105' : ''
              }`}
              style={{
                borderColor: selectedEnsemble === ensemble.id ? ensemble.color : undefined,
                background: selectedEnsemble === ensemble.id ? `${ensemble.color}20` : undefined,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: ensemble.color }}
                />
                <div className="font-bold text-sm" style={{ color: ensemble.color }}>
                  {ensemble.name}
                </div>
              </div>
              <div className="text-xs text-slate-400">{ensemble.description}</div>
              <div className="text-xs text-slate-500 mt-2">
                {ensemble.neurons.length} neurones
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Spatial Visualization */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-4">
          🗺️ Localisation Spatiale — {ensembles[selectedEnsemble].name}
        </h3>
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={500}
            height={500}
            className="w-full h-[500px]"
          />
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-400">ONsemble (activé)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-slate-400">OFFsemble (silencieux)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-500" />
            <span className="text-slate-400">Non sélectionné</span>
          </div>
        </div>
      </div>

      {/* Raster Plot */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-4">
          📊 Raster Plot — Activité Temporelle
        </h3>
        <div className="bg-slate-900/50 rounded-lg p-4 overflow-x-auto">
          <div className="min-w-[600px]">
            {rasterData.map((neuronActivity, neuronId) => {
              const ensemble = ensembles.find(e => e.neurons.includes(neuronId));
              const isSelected = ensemble && ensemble.id === selectedEnsemble;
              
              return (
                <div key={neuronId} className="flex items-center gap-2 mb-1">
                  <div className="text-xs text-slate-500 w-12">N{neuronId}</div>
                  <div className="flex-1 flex gap-px">
                    {neuronActivity.map((active, frame) => (
                      <div
                        key={frame}
                        className="h-2 flex-1 rounded-sm"
                        style={{
                          background: active
                            ? isSelected
                              ? ensemble!.color
                              : '#64748b'
                            : 'transparent',
                          opacity: active ? 1 : 0.1,
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-4 text-sm text-slate-400 text-center">
          Frame {frame} / 100 — {isPlaying ? '▶ Lecture' : '⏸ Pause'}
        </div>
      </div>

      {/* Pipeline */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-4">
          🔄 Pipeline Xsembles2P — 10 Étapes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { step: 1, name: 'Read raw video(s)', icon: '📹' },
            { step: 2, name: 'Read voltage recording', icon: '⚡' },
            { step: 3, name: 'Motion correction', icon: '🎬' },
            { step: 4, name: 'Find active neurons', icon: '🔍' },
            { step: 5, name: 'Get calcium signals', icon: '💚' },
            { step: 6, name: 'Spike inference', icon: '⚡' },
            { step: 7, name: 'Population activity', icon: '👥' },
            { step: 8, name: 'Find ensembles', icon: '🎯' },
            { step: 9, name: 'Save results', icon: '💾' },
            { step: 10, name: 'Plot results', icon: '📊' },
          ].map((item) => (
            <div key={item.step} className="glass-card p-3 flex items-center gap-3">
              <div className="text-2xl">{item.icon}</div>
              <div>
                <div className="text-xs text-slate-500">Étape {item.step}</div>
                <div className="font-bold text-sm text-slate-100">{item.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub Link */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-slate-100">Xsembles2P</div>
            <div className="text-sm text-slate-400">
              Outil MATLAB pour analyse d'imagerie calcique deux photons
            </div>
          </div>
          <a
            href="https://github.com/PerezOrtegaJ/Xsembles2P"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            GitHub →
          </a>
        </div>
      </div>
    </div>
  );
}
