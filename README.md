# 🐝 NeuroHive — Ruche d'IA Distribuée

<div align="center">

![NeuroHive](https://img.shields.io/badge/NeuroHive-v2.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

**Système d'IA hétérogène distribué intégrant CPU+GPU+TPU+NPU+LPU avec monitoring temps réel, déploiement de modèles ternaires, et reconstruction fMRI-to-vidéo via NEURONS (ICCV 2025)**

[Architecture](#-architecture) • [Fonctionnalités](#-fonctionnalités) • [Installation](#-installation) • [Utilisation](#-utilisation)

</div>

---

## 📋 Table des Matières

- [Vue d'Ensemble](#-vue-densemble)
- [Architecture](#-architecture)
- [Fonctionnalités](#-fonctionnalités)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Composants](#-composants)
- [Intégrations](#-intégrations)
- [Références](#-références)

---

## 🌟 Vue d'Ensemble

**NeuroHive** est un dashboard interactif qui visualise et orchestre une architecture d'IA distribuée hétérogène. Le système intègre :

- 🐝 **Ruche d'Agents** : 32 agents spécialisés (ouvriers, math, superviseurs, LLM, Mem0, garde)
- 🔬 **Matériel IA** : Comparaison approfondie CPU vs GPU vs TPU vs NPU vs LPU
- ⚡ **Monitoring GPU** : Style nvitop/nvidia_gpu_exporter avec métriques temps réel
- 🧊 **Modèles Ternaires** : Déploiement sur GPU/CPU/NPU/FPGA avec réduction 20×
- 🧬 **NEURONS** : Reconstruction fMRI-to-vidéo (ICCV 2025)
- 🛡️ **Garde Unique** : Point d'entrée/sortie centralisé
- 🌐 **Réseau Mesh** : Topologie distribuée avec synchronisation

---

## 🏗️ Architecture

### Vue d'Ensemble du Système

```
┌─────────────────────────────────────────────────────────────┐
│                         ENTRÉE                               │
│                    (API REST/gRPC)                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    🛡️ GARDE ×1                               │
│         (Authentification + Rate Limiting + Routage)        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              👁️ SUPERVISEURS ×4                              │
│         (Orchestration + Load Balancing + Monitoring)       │
└──────────────────────┬──────────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │⚒️Ouvriers│ │🔢 Math   │ │🧠 LLM ×8 │
    │   ×12    │ │   ×8     │ │(70B-3B)  │
    └──────────┘ └──────────┘ └──────────┘
                       │
                       ▼
              ┌────────────────┐
              │💾 MEM0 ×4      │
              │(Mémoire Vector)|
              └────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                         SORTIE                               │
│                  (Streaming/Réponse)                         │
└─────────────────────────────────────────────────────────────┘
```

### Infrastructure Matérielle

**8 Machines distribuées** avec processeurs spécialisés :

| Machine | GPU | TPU | NPU | ASIC | Total Cores |
|---------|-----|-----|-----|------|-------------|
| M-A | H100 | v4 | - | α | 208 |
| M-B | H100 | v4 | - | β | 208 |
| M-C | A100 | v4 | - | γ | 192 |
| M-D | A100 | v4 | - | δ | 192 |
| M-E | RTX4090 | - | Lunar Lake | - | 128 |
| M-F | MI300X | - | - | - | 128 |
| M-G | - | v5p | Hexagon | - | 96 |
| M-H | - | - | Apple ANE | - | 64 |

**Total : 32 processeurs, 1,216 cœurs, ~4.5 kW**

---

## ✨ Fonctionnalités

### 1. 🐝 Ruche d'Agents (Hive Visualization)

Visualisation temps réel de la ruche d'IA avec :
- **32 agents** répartis en 6 catégories
- **Connexions dynamiques** entre agents
- **Particules de données** animées
- **Métriques live** : throughput, latence, charge

**Types d'agents :**
- ⚒️ **Ouvriers (12)** : Exécution de tâches
- 🔢 **Math (8)** : Calcul matriciel et tensoriel
- 👁️ **Superviseurs (4)** : Orchestration et monitoring
- 🧠 **LLM (8)** : Modèles de langage (70B à 3B paramètres)
- 💾 **Mem0 (4)** : Mémoire vectorielle persistante
- 🛡️ **Garde (1)** : Point d'entrée/sortie unique

### 2. 🧬 NEURONS — fMRI-to-Video Reconstruction

Intégration du framework **NEURONS** (ICCV 2025) pour la reconstruction vidéo à partir de signaux fMRI :

**Pipeline en 6 étapes :**
1. 🧠 **Brain Model** : Encodage fMRI → embeddings CLIP
2. 🔀 **Decoupler** : Séparation contenu/mouvement (voies ventrale/dorsale)
3. 🎨 **Reconstruction** : Génération keyframes via UnCLIP
4. 📝 **Captioning** : BLIP-2 / GPT-2 pour descriptions
5. 🎬 **Video Gen** : AnimateDiff pour reconstruction temporelle
6. 📊 **Evaluation** : FID, SSIM, LPIPS, CLIP Score

**Visualisation du cortex visuel :**
- V1 : Détection des bords
- V2 : Intégration des contours
- V3 : Formes globales
- V4 : Couleur et texture
- V5/MT : Mouvement et flux optique

**Métriques SOTA :**
- FID: 15.2 | SSIM: 0.72 | LPIPS: 0.18 | CLIP: 0.68

### 3. 🔬 Comparaison Matériel IA

Analyse approfondie des 5 architectures de processeurs :

| Aspect | CPU | GPU | TPU | NPU | LPU |
|--------|-----|-----|-----|-----|-----|
| **Philosophie** | Usage général | Parallèle | ASIC Tensor | Edge AI | LLM déterministe |
| **Cœurs** | 2-128 complexes | 10K+ SIMT | 128×128 systolique | MAC arrays | SRAM conveyor |
| **Mémoire** | DDR DRAM | HBM | HBM | LPDDR+SRAM | SRAM on-chip |
| **Bande passante** | ~0.5 TB/s | ~8 TB/s | ~1.2 TB/s | ~100 GB/s | ~80 TB/s |
| **Puissance** | 50-400W | 300-1000W | 90-192W | 4-10W | ~150W |
| **Entraînement** | Lent | Meilleur | Oui (GCP) | Non | Non |

**Idée clé :** Aucun processeur ne l'emporte seul. Les meilleurs systèmes utilisent une approche hétérogène.

### 4. 📊 GPU Monitor (Style nvitop)

Monitoring temps réel des accélérateurs :
- **8 devices** : H100, A100, RTX4090, MI300X, TPU v4, NPU
- **Métriques live** : utilisation, VRAM, température, puissance
- **Graphiques historiques** : 60 dernières secondes
- **Processus GPU** : PID, mémoire, utilisation par processus
- **Alertes** : seuils de température et utilisation

**Intégrations :**
- **nvitop** : Monitoring temps réel style top
- **nvidia_gpu_exporter** : Métriques Prometheus pour Grafana
- **gpu-hot** : Détection thermal throttling

### 5. 🧊 Déploiement Modèles Ternaires

Réduction de poids 20× pour les réseaux ternaires ({-1, 0, +1}) :

**Stockage :**
- FP32 (1B params) : 4 GB
- INT8 (1B params) : 1 GB
- **Ternary (1B params) : 200 MB** ← 20× réduction

**Performance par plateforme (modèle 1B) :**

| Plateforme | Natif? | Decode 1B | Puissance | Efficacité |
|------------|--------|-----------|-----------|------------|
| NVIDIA B200 | Émulé | ~5 ms | 500W | 10 ms/J |
| NVIDIA H100 | Émulé | ~15 ms | 350W | 4.3 ms/J |
| AMD MI300X | Émulé | ~20 ms | 750W | 2.0 ms/J |
| Apple M4 | Émulé | ~175 ms | 12W | 5-7 tok/J |
| FPGA ZCU104 | **NATIF** | ~50 ms | 5W | ~10× GPU |
| **ASIC Ternaire** | **NATIF** | **~50 µs** | **5W** | **OPTIMAL** |

**Points clés :**
1. FPGA = seule plateforme actuelle avec datapath ternaire natif
2. Blackwell B200 réduit l'écart avec ASIC custom
3. NPU mobiles permettent inférence 1B sur smartphone
4. Avantage ASIC maximal sur edge (5W)

### 6. 🛡️ Garde Unique

Point d'entrée/sortie centralisé :
- **Validation** des requêtes entrantes/sortantes
- **Rate limiting** et authentification
- **Routage** vers superviseurs
- **Journal** des requêtes avec latence

**Flux :** Entrée → Garde → Superviseurs → Agents → Garde → Sortie

### 7. 🌐 Réseau Distribué

Topologie mesh avec 8 machines :
- **28 connexions** inter-machines
- **Paquets animés** visualisant le trafic
- **Protocole** : gRPC + WebSocket + Protocol Buffers
- **Synchronisation** : Raft consensus + CRDT
- **Performance** : Latence P50 ~2ms, P99 ~12ms, Débit 2.4 GB/s

---

## 🚀 Installation

### Prérequis

- Node.js 18+ et npm
- Navigateur moderne (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/neurohive.git
cd neurohive

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour production
npm run build
```

### Déploiement

```bash
# Build production
npm run build

# Le dossier dist/ contient l'application statique
# Déployer sur Vercel, Netlify, GitHub Pages, etc.
```

---

## 📖 Utilisation

### Navigation

L'application propose **10 onglets** :

1. **🐝 Ruche** : Visualisation principale de la ruche d'agents
2. **🧬 NEURONS** : Reconstruction fMRI-to-vidéo
3. **🔬 Matériel IA** : Comparaison CPU/GPU/TPU/NPU/LPU
4. **⚡ Processeurs** : Grille des 32 processeurs
5. **📊 GPU Monitor** : Monitoring style nvitop
6. **🧊 Ternaire** : Déploiement modèles ternaires
7. **🤖 Agents** : Détails des 32 agents
8. **🧠 Mémoire** : Mem0 ×4 + LLM ×8
9. **🛡️ Gardes** : Journal des requêtes
10. **🌐 Réseau** : Topologie mesh

### Interactions

- **Cliquez** sur les agents/processeurs pour voir les détails
- **Survolez** les éléments pour les métriques
- **Filtrez** les agents par type
- **Changez** les vues dans GPU Monitor (Dashboard/Détail/Processus)
- **Explorez** les 6 étapes du pipeline NEURONS

---

## 🧩 Composants

### Structure du Code

```
src/
├── App.tsx                      # Composant principal
├── components/
│   ├── HiveVisualization.tsx    # 🐝 Ruche d'agents
│   ├── NeuronsPanel.tsx         # 🧬 NEURONS fMRI-to-Video
│   ├── HardwareComparison.tsx   # 🔬 Comparaison matériel
│   ├── ProcessorGrid.tsx        # ⚡ Grille processeurs
│   ├── GPUMonitor.tsx           # 📊 Monitoring GPU
│   ├── TernaryDeployment.tsx    # 🧊 Modèles ternaires
│   ├── AgentPanel.tsx           # 🤖 Détails agents
│   ├── MemoryPanel.tsx          # 🧠 Mémoire Mem0+LLM
│   ├── GuardPanel.tsx           # 🛡️ Garde I/O
│   ├── NetworkFlow.tsx          # 🌐 Réseau mesh
│   └── StatsBar.tsx             # 📊 Barre de stats
└── index.css                    # Styles globaux
```

### Technologies

- **React 18** : Framework UI
- **TypeScript** : Typage statique
- **Vite** : Build tool ultra-rapide
- **Tailwind CSS** : Styling utility-first
- **Canvas API** : Visualisations animées

---

## 🔗 Intégrations

### Projets Intégrés

1. **[NEURONS](https://github.com/xmed-lab/NEURONS)** (ICCV 2025)
   - fMRI-to-Video Reconstruction
   - Émulation du cortex visuel
   - Pipeline complet en 6 étapes

2. **[nvitop](https://github.com/XuehaiPan/nvitop)**
   - Monitoring GPU temps réel
   - Interface style top

3. **[nvidia_gpu_exporter](https://github.com/utkuozdemir/nvidia_gpu_exporter)**
   - Métriques Prometheus
   - Intégration Grafana

4. **[gpu-hot](https://github.com/psmed-lab/gpu-hot)**
   - Détection thermal throttling
   - Optimisation ventilation

5. **[NPU](https://github.com/buicongnguyen/NPU)**
   - Edge AI deployment
   - Low-power inference

### Concepts Intégrés

- **Modèles Ternaires** : Réduction 20× des poids
- **Architecture Hétérogène** : CPU+GPU+TPU+NPU+LPU
- **Ruche d'Agents** : Orchestration distribuée
- **Mémoire Vectorielle** : Mem0 pour embeddings
- **Garde Unique** : Point d'entrée/sortie sécurisé

---

## 📚 Références

### Articles Scientifiques

1. **NEURONS** (ICCV 2025)
   - Wang et al. "Emulating the Human Visual Cortex Improves Fidelity and Interpretability in fMRI-to-Video Reconstruction"
   - [arXiv:2503.11167](https://arxiv.org/abs/2503.11167)
   - [GitHub](https://github.com/xmed-lab/NEURONS)

2. **Hardware Comparison**
   - "AI Hardware: CPU vs GPU vs TPU vs NPU vs LPU"
   - Deep Learning Hardware Guide

3. **Ternary Networks**
   - "Running Ternary Models on Current Hardware"
   - GPU, CPU, NPU, FPGA deployment strategies

### Ressources

- [HuggingFace NEURONS](https://huggingface.co/McGregorW/NEURONS) — Weights + logs (60GB+)
- [NVIDIA GPU Architecture](https://www.nvidia.com/en-us/data-center/) — H100, A100, Blackwell
- [Google TPU](https://cloud.google.com/tpu) — TPU v4/v5p
- [Groq LPU](https://groq.com/) — Language Processing Unit

---

## 🎯 Cas d'Usage

### 1. Recherche en Neurosciences

Utiliser NEURONS pour décoder l'activité cérébrale et reconstruire des vidéos à partir de signaux fMRI.

**Workflow :**
```bash
# Sur NeuroHive avec 2× H100
bash train_neurons.sh 0 neurons 123456 enhance 1
```

**Temps :** ~2-3 minutes par trial (10s de vidéo)

### 2. Déploiement LLM Optimisé

Déployer des modèles ternaires pour réduire la consommation mémoire de 20×.

**Exemple :**
- Modèle 7B en FP32 : 28 GB VRAM
- Modèle 7B ternaire : 1.4 GB VRAM
- **Réduction : 20×**

### 3. Monitoring Infrastructure

Surveiller 32 processeurs sur 8 machines avec alertes en temps réel.

**Métriques clés :**
- Utilisation GPU/TPU/NPU
- Température et puissance
- Latence réseau
- Throughput agents

### 4. Orchestration Distribuée

Coordonner 32 agents pour traiter des tâches complexes en parallèle.

**Architecture :**
- 12 ouvriers : exécution
- 8 math : calcul matriciel
- 4 superviseurs : orchestration
- 8 LLM : inférence
- 4 Mem0 : mémoire
- 1 garde : I/O

---

## 📊 Métriques

### Performance Système

| Métrique | Valeur |
|----------|--------|
| Agents totaux | 32 |
| Processeurs | 32 |
| Machines | 8 |
| Cœurs totaux | 1,216 |
| Puissance totale | ~4.5 kW |
| Throughput | 2,000-4,000 ops/s |
| Latence moyenne | 8-23 ms |
| Bande passante réseau | 2.4 GB/s |

### NEURONS Performance

| Métrique | Valeur |
|----------|--------|
| FID ↓ | 15.2 |
| SSIM ↑ | 0.72 |
| LPIPS ↓ | 0.18 |
| CLIP Score ↑ | 0.68 |
| Temps inférence | 2-3 min/video |

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 Remerciements

- **NEURONS Team** (XMed Lab) pour le framework fMRI-to-Video
- **NVIDIA** pour les GPU H100/A100/Blackwell
- **Google** pour les TPU
- **Groq** pour les LPU
- **Communauté open-source** pour nvitop, nvidia_gpu_exporter, gpu-hot

---

## 📞 Contact

Pour questions ou suggestions :
- GitHub Issues : [ouvrir une issue](https://github.com/votre-username/neurohive/issues)
- Email : votre-email@example.com

---

<div align="center">

**⭐ Si ce projet vous est utile, n'hésitez pas à lui donner une étoile !**

Fait avec ❤️ pour la communauté IA

</div>
