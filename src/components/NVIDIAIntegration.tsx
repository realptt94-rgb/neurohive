import { useState, useEffect } from 'react';

interface NVIDIAStatus {
  visionLanguage: boolean;
  reasoning: boolean;
  safety: boolean;
  biology: boolean;
  timestamp: string;
}

interface NVIDIAModels {
  [key: string]: {
    name: string;
    description: string;
    capabilities: string[];
    status: string;
  };
}

export default function NVIDIAIntegration() {
  const [status, setStatus] = useState<NVIDIAStatus | null>(null);
  const [models, setModels] = useState<NVIDIAModels | null>(null);
  const [activeModel, setActiveModel] = useState<string>('visionLanguage');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [inputText, setInputText] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchStatus();
    fetchModels();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/nvidia/health`);
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Erreur status NVIDIA:', error);
    }
  };

  const fetchModels = async () => {
    try {
      const response = await fetch(`${API_URL}/api/nvidia/models`);
      const data = await response.json();
      setModels(data.models);
    } catch (error) {
      console.error('Erreur models NVIDIA:', error);
    }
  };

  const testVision = async () => {
    if (!imageUrl) {
      alert('Veuillez entrer une URL d\'image');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/nvidia/vision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: imageUrl,
          prompt: inputText || 'Describe this image in detail'
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testReasoning = async () => {
    if (!inputText) {
      alert('Veuillez entrer un prompt');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/nvidia/reason`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputText })
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testSafety = async () => {
    if (!inputText) {
      alert('Veuillez entrer du contenu à analyser');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/nvidia/safety`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: inputText, type: 'text' })
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testBiology = async () => {
    setLoading(true);
    setResult(null);

    try {
      // Exemple de PDB réduit
      const samplePDB = `ATOM      1  N   ALA A   1       1.458   0.000   0.000  1.00  0.00           N
ATOM      2  CA  ALA A   1       2.009   1.420   0.000  1.00  0.00           C
ATOM      3  C   ALA A   1       3.530   1.420   0.000  1.00  0.00           C
ATOM      4  O   ALA A   1       4.139   2.480   0.000  1.00  0.00           O
ATOM      5  CB  ALA A   1       1.458  -0.710   1.200  1.00  0.00           C`;

      const response = await fetch(`${API_URL}/api/nvidia/biology`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputPDB: samplePDB,
          contigs: 'A1-5/0 10-20',
          hotspotRes: ['A2', 'A3'],
          diffusionSteps: 15
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const runTest = () => {
    switch (activeModel) {
      case 'visionLanguage':
        testVision();
        break;
      case 'reasoning':
        testReasoning();
        break;
      case 'safety':
        testSafety();
        break;
      case 'biology':
        testBiology();
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold gradient-text mb-2">
              🤖 NVIDIA AI Integration
            </h2>
            <p className="text-slate-400">
              Système Autonome - Modèles NVIDIA Intégrés (Nemotron, Llama Guard, RFDiffusion)
            </p>
          </div>
          <button
            onClick={fetchStatus}
            className="btn-secondary"
          >
            🔄 Actualiser
          </button>
        </div>

        {/* Status Cards */}
        {status && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="metric-card">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${status.visionLanguage ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-slate-400">Vision-Language</span>
              </div>
              <div className={`text-xl font-bold ${status.visionLanguage ? 'text-green-500' : 'text-red-500'}`}>
                {status.visionLanguage ? '✓ ACTIF' : '✗ INACTIF'}
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${status.reasoning ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-slate-400">Reasoning</span>
              </div>
              <div className={`text-xl font-bold ${status.reasoning ? 'text-green-500' : 'text-red-500'}`}>
                {status.reasoning ? '✓ ACTIF' : '✗ INACTIF'}
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${status.safety ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-slate-400">Safety</span>
              </div>
              <div className={`text-xl font-bold ${status.safety ? 'text-green-500' : 'text-red-500'}`}>
                {status.safety ? '✓ ACTIF' : '✗ INACTIF'}
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${status.biology ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-slate-400">Biology</span>
              </div>
              <div className={`text-xl font-bold ${status.biology ? 'text-green-500' : 'text-red-500'}`}>
                {status.biology ? '✓ ACTIF' : '✗ INACTIF'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Models Selection */}
      {models && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4">
            📦 Modèles Disponibles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(models).map(([key, model]) => (
              <button
                key={key}
                onClick={() => setActiveModel(key)}
                className={`glass-card p-4 text-left transition-all ${
                  activeModel === key ? 'scale-105 border-emerald-500' : ''
                }`}
                style={{
                  borderColor: activeModel === key ? '#10b981' : undefined,
                  background: activeModel === key ? 'rgba(16, 185, 129, 0.1)' : undefined
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-slate-100">{key}</div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    model.status === 'available' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {model.status}
                  </div>
                </div>
                <div className="text-xs text-slate-400 mb-2">{model.description}</div>
                <div className="text-xs text-slate-500 font-mono">{model.name}</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {model.capabilities.slice(0, 2).map((cap, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-700/50 rounded text-slate-300">
                      {cap}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Test Interface */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-4">
          🧪 Tester le Modèle: {activeModel}
        </h3>

        <div className="space-y-4">
          {/* Image URL for Vision */}
          {activeModel === 'visionLanguage' && (
            <div>
              <label className="text-sm text-slate-400 block mb-2">URL de l'image</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {/* Text Input */}
          {activeModel !== 'biology' && (
            <div>
              <label className="text-sm text-slate-400 block mb-2">
                {activeModel === 'visionLanguage' ? 'Prompt (optionnel)' : 
                 activeModel === 'safety' ? 'Contenu à analyser' : 'Prompt'}
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  activeModel === 'visionLanguage' ? 'Describe this image...' :
                  activeModel === 'reasoning' ? 'Which number is larger, 9.11 or 9.8?' :
                  activeModel === 'safety' ? 'Enter content to classify...' : ''
                }
                rows={4}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:border-emerald-500 focus:outline-none resize-none"
              />
            </div>
          )}

          {/* Test Button */}
          <button
            onClick={runTest}
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? '⏳ Traitement...' : '🚀 Lancer le test'}
          </button>

          {/* Result */}
          {result && (
            <div className={`p-4 rounded-lg ${
              result.success ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{result.success ? '✅' : '❌'}</span>
                <span className={`font-bold ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                  {result.success ? 'Succès' : 'Erreur'}
                </span>
              </div>
              
              {result.success ? (
                <div className="space-y-2">
                  {result.data && (
                    <div className="text-sm text-slate-300 whitespace-pre-wrap">
                      {result.data}
                    </div>
                  )}
                  {result.isSafe !== undefined && (
                    <div className="text-sm">
                      <span className="text-slate-400">Sécurité: </span>
                      <span className={result.isSafe ? 'text-green-400' : 'text-red-400'}>
                        {result.isSafe ? '✓ SAFE' : '✗ UNSAFE'}
                      </span>
                    </div>
                  )}
                  {result.categories && result.categories.length > 0 && (
                    <div className="text-sm">
                      <span className="text-slate-400">Catégories: </span>
                      <span className="text-yellow-400">{result.categories.join(', ')}</span>
                    </div>
                  )}
                  {result.outputPDB && (
                    <div className="text-xs font-mono bg-slate-900/50 p-2 rounded max-h-40 overflow-auto">
                      {result.outputPDB.substring(0, 500)}...
                    </div>
                  )}
                  {result.model && (
                    <div className="text-xs text-slate-500">
                      Modèle: {result.model}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-red-400">
                  {result.error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Architecture Info */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-4">
          🏗️ Architecture Autonome
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h4 className="font-bold text-emerald-400 mb-2">✅ Système Autonome</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• API NVIDIA intégrée directement</li>
              <li>• Clés API cryptées dans .env</li>
              <li>• Aucune dépendance GitHub externe</li>
              <li>• Modèles hébergés par NVIDIA</li>
              <li>• Backend Node.js autonome</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h4 className="font-bold text-cyan-400 mb-2">🔒 Sécurité</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Clés API en Base64</li>
              <li>• Variables d'environnement</li>
              <li>• Pas de clés dans le code</li>
              <li>• .env dans .gitignore</li>
              <li>• Llama Guard pour classification</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
