import { useState, useEffect, useRef } from 'react';

export default function CognitiveArchitecture() {
  const [activeStep, setActiveStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cognitiveLoop = [
    { id: 0, name: 'Environment.observe()', icon: '🌍', color: '#10b981', desc: 'World state enrichment' },
    { id: 1, name: 'Perception.perceive()', icon: '👁️', color: '#06b6d4', desc: 'Raw → Structured input' },
    { id: 2, name: 'Attention.select()', icon: '🎯', color: '#8b5cf6', desc: 'Filter relevance' },
    { id: 3, name: 'Controller.interpret()', icon: '🧠', color: '#ec4899', desc: 'Set goal (Prefrontal)' },
    { id: 4, name: 'Memory.recall()', icon: '💾', color: '#f59e0b', desc: 'Past context retrieval' },
    { id: 5, name: 'Planner.create_plan()', icon: '📋', color: '#ef4444', desc: 'Decompose into steps' },
    { id: 6, name: 'Reasoner.execute()', icon: '⚡', color: '#14b8a6', desc: 'ReAct loop (Think)' },
    { id: 7, name: 'Action.execute()', icon: '🎬', color: '#3b82f6', desc: 'Environmental effect' },
    { id: 8, name: 'Learning.update()', icon: '📚', color: '#a855f7', desc: 'Experience stored' },
    { id: 9, name: 'Memory.store_event()', icon: '🗄️', color: '#6366f1', desc: 'Episodic update' },
  ];

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % cognitiveLoop.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Draw central brain
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 80);
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.8)');
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#8b5cf6';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🧠', centerX, centerY);

    // Draw cognitive loop nodes
    cognitiveLoop.forEach((step, i) => {
      const angle = (i / cognitiveLoop.length) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Connection line
      ctx.strokeStyle = i === activeStep ? step.color : 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = i === activeStep ? 3 : 1;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Node
      const nodeSize = i === activeStep ? 35 : 25;
      const nodeGradient = ctx.createRadialGradient(x, y, 0, x, y, nodeSize);
      nodeGradient.addColorStop(0, step.color);
      nodeGradient.addColorStop(1, 'rgba(15, 23, 42, 0.8)');
      
      ctx.fillStyle = nodeGradient;
      ctx.beginPath();
      ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
      ctx.fill();

      // Node border
      ctx.strokeStyle = step.color;
      ctx.lineWidth = i === activeStep ? 3 : 1;
      ctx.stroke();

      // Icon
      ctx.fillStyle = '#ffffff';
      ctx.font = `${i === activeStep ? '24' : '18'}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(step.icon, x, y);

      // Label
      ctx.fillStyle = i === activeStep ? step.color : '#94a3b8';
      ctx.font = `${i === activeStep ? 'bold ' : ''}11px sans-serif`;
      ctx.fillText(step.name.split('.')[0], x, y + nodeSize + 15);
    });

    // Draw active step glow
    if (isRunning) {
      const activeAngle = (activeStep / cognitiveLoop.length) * Math.PI * 2 - Math.PI / 2;
      const activeX = centerX + Math.cos(activeAngle) * radius;
      const activeY = centerY + Math.sin(activeAngle) * radius;

      const glowGradient = ctx.createRadialGradient(activeX, activeY, 0, activeX, activeY, 50);
      glowGradient.addColorStop(0, cognitiveLoop[activeStep].color + '80');
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(activeX, activeY, 50, 0, Math.PI * 2);
      ctx.fill();
    }

  }, [activeStep, isRunning]);

  const memoryTypes = [
    { name: 'Working', icon: '⚡', color: '#10b981', desc: 'Current reasoning context' },
    { name: 'Episodic', icon: '📖', color: '#06b6d4', desc: 'Past experiences' },
    { name: 'Semantic', icon: '📚', color: '#8b5cf6', desc: 'World knowledge' },
    { name: 'Procedural', icon: '🔧', color: '#ec4899', desc: 'How-to skills' },
    { name: 'Vector', icon: '🔍', color: '#f59e0b', desc: 'Similarity search' },
    { name: 'Graph', icon: '🕸️', color: '#ef4444', desc: 'Relational knowledge' },
    { name: 'Stream', icon: '🌊', color: '#14b8a6', desc: 'Temporal events' },
  ];

  const reasoningStrategies = [
    { name: 'LoopReasoner', strategy: 'ReAct', desc: 'Think → Invoke → Evaluate' },
    { name: 'LLMReasoner', strategy: 'Sequential', desc: 'LLM delegation per step' },
    { name: 'HierarchicalReasoner', strategy: 'Hierarchical', desc: 'Multi-level planning' },
    { name: 'RecursiveReasoner', strategy: 'Recursive', desc: 'Sub-problem decomposition' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold gradient-text mb-2">
              Architecture Cognitive Cerebellum
            </h2>
            <p className="text-slate-400">
              Framework modulaire inspiré du cerveau humain — Perception, Mémoire, Planification, Raisonnement, Apprentissage
            </p>
          </div>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`btn-primary ${isRunning ? 'opacity-50' : ''}`}
          >
            {isRunning ? '⏸ Pause' : '▶ Démarrer Loop'}
          </button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="metric-card">
            <div className="metric-value text-emerald-500">10</div>
            <div className="metric-label">Étapes Cognitives</div>
          </div>
          <div className="metric-card">
            <div className="metric-value text-cyan-500">7</div>
            <div className="metric-label">Types de Mémoire</div>
          </div>
          <div className="metric-card">
            <div className="metric-value text-purple-500">4</div>
            <div className="metric-label">Stratégies Raisonnement</div>
          </div>
          <div className="metric-card">
            <div className="metric-value text-pink-500">Étape {activeStep + 1}</div>
            <div className="metric-label">Active</div>
          </div>
        </div>
      </div>

      {/* Cognitive Loop Visualization */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-4">
          🔄 Boucle Cognitive — 10 Étapes
        </h3>
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-[600px]"
          />
        </div>

        {/* Active Step Detail */}
        <div className="mt-6 p-4 rounded-lg" style={{ background: `${cognitiveLoop[activeStep].color}20`, border: `1px solid ${cognitiveLoop[activeStep].color}` }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{cognitiveLoop[activeStep].icon}</span>
            <div>
              <div className="text-lg font-bold" style={{ color: cognitiveLoop[activeStep].color }}>
                {cognitiveLoop[activeStep].name}
              </div>
              <div className="text-slate-400 text-sm">
                {cognitiveLoop[activeStep].desc}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Memory System */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-4">
          💾 Système de Mémoire — 7 Types
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {memoryTypes.map((mem, i) => (
            <div
              key={i}
              className="glass-card p-4 text-center hover:scale-105 transition-transform cursor-pointer"
              style={{ borderColor: mem.color }}
            >
              <div className="text-3xl mb-2">{mem.icon}</div>
              <div className="font-bold text-sm mb-1" style={{ color: mem.color }}>
                {mem.name}
              </div>
              <div className="text-xs text-slate-400">{mem.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Reasoning Strategies */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-4">
          ⚡ Stratégies de Raisonnement
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reasoningStrategies.map((strat, i) => (
            <div key={i} className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-slate-100">{strat.name}</div>
                <div className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400">
                  {strat.strategy}
                </div>
              </div>
              <div className="text-sm text-slate-400">{strat.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-4">
          🏗️ Architecture C4 — Niveau 0
        </h3>
        <pre className="text-xs text-slate-300 bg-slate-900/50 p-4 rounded-lg overflow-x-auto">
{`                  USER
                   │
                   ▼
             Perception Layer
                   │
                   ▼
            Cognitive Controller
      ┌───────────┼───────────┐
      │           │           │
   Memory      Reasoning     Planning
      │           │           │
      └───────────┼───────────┘
                  │
               Tool Layer
                  │
             Environment
                  │
             Observability`}
        </pre>
      </div>

      {/* GitHub Link */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-slate-100">Cerebellum Cognitive Architecture</div>
            <div className="text-sm text-slate-400">Framework Python modulaire pour agents cognitifs autonomes</div>
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
