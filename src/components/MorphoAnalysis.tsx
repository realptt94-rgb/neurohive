import { useState, useEffect, useRef } from 'react';

export default function MorphoAnalysis() {
  const [selectedNeuron, setSelectedNeuron] = useState(0);
  const [viewMode, setViewMode] = useState<'reconstruction' | 'sholl' | 'metrics'>('reconstruction');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulated neuron morphologies
  const neurons = [
    {
      id: 0,
      type: 'Pyramidal',
      color: '#10b981',
      branches: 45,
      totalLength: 2340,
      somaDiameter: 25,
      primaries: 5,
      maxOrder: 12,
    },
    {
      id: 1,
      type: 'Interneuron',
      color: '#06b6d4',
      branches: 28,
      totalLength: 1560,
      somaDiameter: 18,
      primaries: 3,
      maxOrder: 8,
    },
    {
      id: 2,
      type: 'Purkinje',
      color: '#8b5cf6',
      branches: 89,
      totalLength: 4560,
      somaDiameter: 35,
      primaries: 8,
      maxOrder: 18,
    },
    {
      id: 3,
      type: 'Bipolar',
      color: '#ec4899',
      branches: 12,
      totalLength: 890,
      somaDiameter: 15,
      primaries: 2,
      maxOrder: 5,
    },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    const neuron = neurons[selectedNeuron];

    if (viewMode === 'reconstruction') {
      // Draw neuron reconstruction
      drawNeuronReconstruction(ctx, centerX, centerY, neuron);
    } else if (viewMode === 'sholl') {
      // Draw Sholl analysis
      drawShollAnalysis(ctx, centerX, centerY, neuron);
    } else {
      // Draw metrics visualization
      drawMetricsVisualization(ctx, centerX, centerY, neuron);
    }

  }, [selectedNeuron, viewMode]);

  const drawNeuronReconstruction = (ctx: CanvasRenderingContext2D, cx: number, cy: number, neuron: any) => {
    // Draw soma
    const somaGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, neuron.somaDiameter);
    somaGradient.addColorStop(0, neuron.color);
    somaGradient.addColorStop(1, 'rgba(15, 23, 42, 0.8)');
    
    ctx.fillStyle = somaGradient;
    ctx.beginPath();
    ctx.arc(cx, cy, neuron.somaDiameter, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = neuron.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw dendrites
    const drawBranch = (startX: number, startY: number, angle: number, length: number, depth: number, maxDepth: number) => {
      if (depth > maxDepth || length < 5) return;

      const endX = startX + Math.cos(angle) * length;
      const endY = startY + Math.sin(angle) * length;

      // Branch
      ctx.strokeStyle = neuron.color + Math.floor(255 * (1 - depth / maxDepth)).toString(16).padStart(2, '0');
      ctx.lineWidth = Math.max(1, 4 - depth * 0.5);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Branch point
      if (depth < maxDepth - 1) {
        ctx.fillStyle = neuron.color;
        ctx.beginPath();
        ctx.arc(endX, endY, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Recursive branches
      const branchAngle = Math.PI / 6;
      const branchLength = length * 0.7;
      
      drawBranch(endX, endY, angle - branchAngle, branchLength, depth + 1, maxDepth);
      drawBranch(endX, endY, angle + branchAngle, branchLength, depth + 1, maxDepth);
    };

    // Draw primary branches
    for (let i = 0; i < neuron.primaries; i++) {
      const angle = (i / neuron.primaries) * Math.PI * 2;
      const length = 80 + Math.random() * 40;
      drawBranch(cx, cy, angle, length, 0, Math.min(neuron.maxOrder, 8));
    }

    // Label
    ctx.fillStyle = neuron.color;
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(neuron.type, cx, cy + neuron.somaDiameter + 30);
  };

  const drawShollAnalysis = (ctx: CanvasRenderingContext2D, cx: number, cy: number, neuron: any) => {
    // Draw concentric circles
    const maxRadius = 200;
    const numCircles = 10;

    for (let i = 1; i <= numCircles; i++) {
      const radius = (i / numCircles) * maxRadius;
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Label
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${i * 10}µm`, cx + radius, cy - 5);
    }

    // Draw intersections
    const intersections = Array.from({ length: numCircles }, (_, i) => {
      return Math.floor(neuron.branches * Math.exp(-i * 0.3) * (0.8 + Math.random() * 0.4));
    });

    const maxIntersections = Math.max(...intersections);

    intersections.forEach((count, i) => {
      const radius = ((i + 1) / numCircles) * maxRadius;
      const angle = (count / maxIntersections) * Math.PI * 2;
      
      // Draw intersection points
      for (let j = 0; j < count; j++) {
        const pointAngle = (j / count) * Math.PI * 2;
        const x = cx + Math.cos(pointAngle) * radius;
        const y = cy + Math.sin(pointAngle) * radius;

        ctx.fillStyle = neuron.color;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Label
      ctx.fillStyle = neuron.color;
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(count.toString(), cx, cy - radius - 10);
    });

    // Draw soma
    ctx.fillStyle = neuron.color;
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fill();

    // Title
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Analyse de Sholl', cx, 30);
  };

  const drawMetricsVisualization = (ctx: CanvasRenderingContext2D, cx: number, cy: number, neuron: any) => {
    // Draw metrics bars
    const metrics = [
      { label: 'Branches', value: neuron.branches, max: 100, color: '#10b981' },
      { label: 'Longueur (µm)', value: neuron.totalLength / 50, max: 100, color: '#06b6d4' },
      { label: 'Soma (µm)', value: neuron.somaDiameter * 2, max: 100, color: '#8b5cf6' },
      { label: 'Primaires', value: neuron.primaries * 10, max: 100, color: '#ec4899' },
      { label: 'Ordre Max', value: neuron.maxOrder * 5, max: 100, color: '#f59e0b' },
    ];

    const barWidth = 60;
    const barSpacing = 80;
    const startX = cx - (metrics.length * barSpacing) / 2;

    metrics.forEach((metric, i) => {
      const x = startX + i * barSpacing;
      const barHeight = (metric.value / metric.max) * 200;
      const y = cy + 100 - barHeight;

      // Bar
      const gradient = ctx.createLinearGradient(x, y, x, cy + 100);
      gradient.addColorStop(0, metric.color);
      gradient.addColorStop(1, metric.color + '40');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight);

      // Border
      ctx.strokeStyle = metric.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x - barWidth / 2, y, barWidth, barHeight);

      // Value
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(metric.value.toFixed(0), x, y - 10);

      // Label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.fillText(metric.label, x, cy + 120);
    });

    // Title
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Métriques Morphologiques', cx, 30);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">
            MorphoLogic — Analyse Morphologique
          </h2>
          <p className="text-slate-400">
            Extraction de morphométriques neuronales à partir de reconstructions SWC 2D
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <div className="metric-card">
            <div className="metric-value text-emerald-500">{neurons[selectedNeuron].branches}</div>
            <div className="metric-label">Branches</div>
          </div>
          <div className="metric-card">
            <div className="metric-value text-cyan-500">{neurons[selectedNeuron].totalLength}</div>
            <div className="metric-label">Longueur (µm)</div>
          </div>
          <div className="metric-card">
            <div className="metric-value text-purple-500">{neurons[selectedNeuron].somaDiameter}</div>
            <div className="metric-label">Soma (µm)</div>
          </div>
          <div className="metric-card">
            <div className="metric-value text-pink-500">{neurons[selectedNeuron].primaries}</div>
            <div className="metric-label">Primaires</div>
          </div>
          <div className="metric-card">
            <div className="metric-value text-amber-500">{neurons[selectedNeuron].maxOrder}</div>
            <div className="metric-label">Ordre Max</div>
          </div>
        </div>
      </div>

      {/* Neuron Selection */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-4">
          🧠 Sélection Neurone
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {neurons.map((neuron) => (
            <button
              key={neuron.id}
              onClick={() => setSelectedNeuron(neuron.id)}
              className={`glass-card p-4 text-left transition-all ${
                selectedNeuron === neuron.id ? 'scale-105' : ''
              }`}
              style={{
                borderColor: selectedNeuron === neuron.id ? neuron.color : undefined,
                background: selectedNeuron === neuron.id ? `${neuron.color}20` : undefined,
              }}
            >
              <div className="font-bold text-sm mb-2" style={{ color: neuron.color }}>
                {neuron.type}
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <div>{neuron.branches} branches</div>
                <div>{neuron.totalLength} µm</div>
                <div>{neuron.primaries} primaires</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* View Mode Selection */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-4">
          🎨 Mode de Visualisation
        </h3>
        <div className="flex gap-3">
          {[
            { id: 'reconstruction' as const, label: '🌳 Reconstruction', desc: 'Arbre morphologique' },
            { id: 'sholl' as const, label: '🎯 Analyse de Sholl', desc: 'Intersections concentriques' },
            { id: 'metrics' as const, label: '📊 Métriques', desc: 'Graphique comparatif' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={`flex-1 glass-card p-4 text-left transition-all ${
                viewMode === mode.id ? 'scale-105' : ''
              }`}
              style={{
                borderColor: viewMode === mode.id ? '#10b981' : undefined,
                background: viewMode === mode.id ? 'rgba(16, 185, 129, 0.1)' : undefined,
              }}
            >
              <div className="font-bold text-sm text-slate-100 mb-1">{mode.label}</div>
              <div className="text-xs text-slate-400">{mode.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Visualization */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-4">
          {viewMode === 'reconstruction' && '🌳 Reconstruction Morphologique'}
          {viewMode === 'sholl' && '🎯 Analyse de Sholl'}
          {viewMode === 'metrics' && '📊 Métriques Morphologiques'}
        </h3>
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="w-full h-[500px]"
          />
        </div>
      </div>

      {/* Features */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-4">
          ✨ Fonctionnalités MorphoLogic
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Contrôle Qualité SWC', icon: '✅', desc: 'Validation topologique et nettoyage' },
            { title: 'Morphométriques Complètes', icon: '📏', desc: 'Géométrie, Sholl, surface, volume' },
            { title: 'Mapping Morphologique', icon: '🗺️', desc: 'Projection signaux/puncta sur neurones' },
            { title: 'Agrégation Conditionnée', icon: '📊', desc: 'Summaries par distance, rayon, ordre' },
            { title: 'Visualisations Diagnostic', icon: '🎨', desc: 'Overlays, heatmaps, Sholl 2×2' },
            { title: 'Interface GUI', icon: '🖱️', desc: 'Tkinter interface avec tabs' },
          ].map((feature, i) => (
            <div key={i} className="glass-card p-4 flex items-start gap-3">
              <div className="text-2xl">{feature.icon}</div>
              <div>
                <div className="font-bold text-sm text-slate-100 mb-1">{feature.title}</div>
                <div className="text-xs text-slate-400">{feature.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub Link */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-slate-100">MorphoLogic</div>
            <div className="text-sm text-slate-400">
              Extraction de morphométriques neuronales depuis reconstructions SWC 2D
            </div>
          </div>
          <a
            href={import.meta.env.VITE_GITHUB_REPO}
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
