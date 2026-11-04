import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';
import si from 'systeminformation';

dotenv.config();

const execAsync = promisify(exec);
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// GPU MONITORING - NVIDIA
// ============================================

async function getNvidiaGPUInfo() {
  try {
    const { stdout } = await execAsync(
      'nvidia-smi --query-gpu=index,name,temperature.gpu,utilization.gpu,memory.used,memory.total,power.draw --format=csv,noheader,nounits'
    );
    
    const gpus = stdout.trim().split('\n').map(line => {
      const [index, name, temp, util, memUsed, memTotal, power] = line.split(',').map(s => s.trim());
      return {
        id: parseInt(index),
        name: name,
        temperature: parseFloat(temp),
        utilization: parseFloat(util),
        memoryUsed: parseFloat(memUsed),
        memoryTotal: parseFloat(memTotal),
        powerDraw: parseFloat(power),
        status: 'active'
      };
    });
    
    return gpus;
  } catch (error) {
    console.log('NVIDIA GPU non détecté, utilisation des données simulées');
    return getSimulatedGPUData();
  }
}

function getSimulatedGPUData() {
  const gpuTypes = [
    { name: 'NVIDIA H100 80GB HBM3', mem: 80, power: 700 },
    { name: 'NVIDIA H100 80GB HBM3', mem: 80, power: 700 },
    { name: 'NVIDIA A100 80GB PCIe', mem: 80, power: 300 },
    { name: 'NVIDIA A100 80GB PCIe', mem: 80, power: 300 },
    { name: 'NVIDIA RTX 4090', mem: 24, power: 450 },
    { name: 'AMD MI300X', mem: 192, power: 750 },
    { name: 'Google TPU v4', mem: 32, power: 192 },
    { name: 'Intel NPU (Lunar Lake)', mem: 0, power: 5 },
  ];

  return gpuTypes.map((gpu, i) => ({
    id: i,
    name: gpu.name,
    temperature: 45 + Math.random() * 35,
    utilization: 20 + Math.random() * 70,
    memoryUsed: gpu.mem * (0.3 + Math.random() * 0.5),
    memoryTotal: gpu.mem,
    powerDraw: gpu.power * (0.3 + Math.random() * 0.5),
    status: 'active'
  }));
}

// ============================================
// SYSTEM INFORMATION
// ============================================

async function getSystemInfo() {
  try {
    const [cpu, mem, os, disk] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.osInfo(),
      si.diskLayout()
    ]);

    return {
      cpu: {
        manufacturer: cpu.manufacturer,
        brand: cpu.brand,
        cores: cpu.cores,
        physicalCores: cpu.physicalCores,
        processors: cpu.processors
      },
      memory: {
        total: mem.total,
        used: mem.used,
        free: mem.free,
        usage: (mem.used / mem.total) * 100
      },
      os: {
        platform: os.platform,
        distro: os.distro,
        release: os.release
      },
      disk: disk.map(d => ({
        name: d.name,
        size: d.size,
        type: d.type
      }))
    };
  } catch (error) {
    console.error('Erreur système:', error);
    return null;
  }
}

// ============================================
// API ENDPOINTS
// ============================================

// GPU Metrics
app.get('/api/gpu', async (req, res) => {
  try {
    const gpus = await getNvidiaGPUInfo();
    res.json({ gpus, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// System Info
app.get('/api/system', async (req, res) => {
  try {
    const info = await getSystemInfo();
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cognitive Architecture Status
app.get('/api/cognitive', (req, res) => {
  res.json({
    status: 'active',
    loop: {
      currentStep: Math.floor(Math.random() * 10),
      totalSteps: 10,
      isRunning: true
    },
    memory: {
      working: { capacity: 100, used: 45 + Math.random() * 30 },
      episodic: { capacity: 1000, used: 234 + Math.random() * 100 },
      semantic: { capacity: 5000, used: 1234 + Math.random() * 500 },
      procedural: { capacity: 500, used: 89 + Math.random() * 50 }
    },
    reasoning: {
      strategy: ['LoopReasoner', 'LLMReasoner', 'HierarchicalReasoner', 'RecursiveReasoner'][Math.floor(Math.random() * 4)],
      confidence: 0.7 + Math.random() * 0.25
    }
  });
});

// Neuronal Ensembles
app.get('/api/ensembles', (req, res) => {
  const ensembles = [
    {
      id: 0,
      name: 'ONsemble 1',
      type: 'ON',
      neurons: [0, 5, 12, 18, 23, 31, 37, 42],
      activity: 0.6 + Math.random() * 0.3
    },
    {
      id: 1,
      name: 'OFFsemble 1',
      type: 'OFF',
      neurons: [2, 8, 15, 21, 28, 34, 40, 47],
      activity: 0.2 + Math.random() * 0.3
    },
    {
      id: 2,
      name: 'ONsemble 2',
      type: 'ON',
      neurons: [1, 7, 14, 19, 25, 32, 38, 44],
      activity: 0.5 + Math.random() * 0.4
    },
    {
      id: 3,
      name: 'OFFsemble 2',
      type: 'OFF',
      neurons: [3, 9, 16, 22, 29, 35, 41, 48],
      activity: 0.3 + Math.random() * 0.3
    }
  ];

  res.json({ ensembles, timestamp: new Date().toISOString() });
});

// Morphological Analysis
app.get('/api/morphology', (req, res) => {
  const neurons = [
    {
      id: 0,
      type: 'Pyramidal',
      branches: 45,
      totalLength: 2340,
      somaDiameter: 25,
      primaries: 5,
      maxOrder: 12
    },
    {
      id: 1,
      type: 'Interneuron',
      branches: 28,
      totalLength: 1560,
      somaDiameter: 18,
      primaries: 3,
      maxOrder: 8
    },
    {
      id: 2,
      type: 'Purkinje',
      branches: 89,
      totalLength: 4560,
      somaDiameter: 35,
      primaries: 8,
      maxOrder: 18
    },
    {
      id: 3,
      type: 'Bipolar',
      branches: 12,
      totalLength: 890,
      somaDiameter: 15,
      primaries: 2,
      maxOrder: 5
    }
  ];

  res.json({ neurons, timestamp: new Date().toISOString() });
});

// DNRT Neural Response
app.get('/api/dnrt', (req, res) => {
  const neurons = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    layer: i < 5 ? 'input' : i < 15 ? 'hidden' : 'output',
    activation: Math.random(),
    threshold: 0.4 + Math.random() * 0.4,
    spike: Math.random() > 0.7,
    membrane: Math.random()
  }));

  res.json({ neurons, timestamp: new Date().toISOString() });
});

// NEURONS fMRI-to-Video
app.get('/api/neurons', (req, res) => {
  res.json({
    pipeline: {
      currentStage: Math.floor(Math.random() * 6) + 1,
      totalStages: 6,
      isProcessing: true
    },
    metrics: {
      fid: 15 + Math.random() * 3,
      ssim: 0.7 + Math.random() * 0.05,
      lpips: 0.15 + Math.random() * 0.05,
      clipScore: 0.65 + Math.random() * 0.05
    },
    visualCortex: {
      v1: { activity: 0.6 + Math.random() * 0.3 },
      v2: { activity: 0.5 + Math.random() * 0.3 },
      v3: { activity: 0.4 + Math.random() * 0.3 },
      v4: { activity: 0.5 + Math.random() * 0.3 },
      v5: { activity: 0.7 + Math.random() * 0.2 }
    }
  });
});

// ============================================
// WEBSOCKET - TEMPS RÉEL
// ============================================

wss.on('connection', (ws) => {
  console.log('Client WebSocket connecté');

  // Envoyer les données toutes les secondes
  const interval = setInterval(async () => {
    try {
      const [gpus, cognitive, ensembles, dnrt] = await Promise.all([
        getNvidiaGPUInfo(),
        Promise.resolve({
          currentStep: Math.floor(Math.random() * 10),
          isRunning: true
        }),
        Promise.resolve({
          ensembles: Array.from({ length: 4 }, (_, i) => ({
            id: i,
            activity: Math.random()
          }))
        }),
        Promise.resolve({
          neurons: Array.from({ length: 20 }, () => ({
            activation: Math.random(),
            spike: Math.random() > 0.7
          }))
        })
      ]);

      ws.send(JSON.stringify({
        type: 'update',
        data: {
          gpus,
          cognitive,
          ensembles,
          dnrt,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      console.error('Erreur WebSocket:', error);
    }
  }, 1000);

  ws.on('close', () => {
    console.log('Client WebSocket déconnecté');
    clearInterval(interval);
  });

  ws.on('error', (error) => {
    console.error('Erreur WebSocket:', error);
    clearInterval(interval);
  });
});

// ============================================
// START SERVER
// ============================================

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🧠 NeuroHive Backend v4.0                              ║
║   Architecture Cognitive Avancée                         ║
║                                                           ║
║   Server: http://localhost:${PORT}                         ║
║   WebSocket: ws://localhost:${PORT}                        ║
║                                                           ║
║   Endpoints:                                              ║
║   • GET /health          - Health check                  ║
║   • GET /api/gpu         - GPU metrics                   ║
║   • GET /api/system      - System info                   ║
║   • GET /api/cognitive   - Cognitive architecture        ║
║   • GET /api/ensembles   - Neuronal ensembles            ║
║   • GET /api/morphology  - Morphological analysis        ║
║   • GET /api/dnrt        - Dynamic neural response       ║
║   • GET /api/neurons     - fMRI-to-Video pipeline        ║
║                                                           ║
║   WebSocket: Real-time updates (1s interval)             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
