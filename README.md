# 🧠 NeuroHive v4.0 — Architecture Cognitive Avancée

<div align="center">

![Version](https://img.shields.io/badge/version-4.0-emerald)
![License](https://img.shields.io/badge/license-MIT-blue)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18.0-61dafb)

**Dashboard professionnel pour ingénieurs en IA cognitive**  
*Intégrant les dernières recherches en neurosciences computationnelles et architectures bio-inspirées*

[Architecture](#-architecture) • [Fonctionnalités](#-fonctionnalités) • [Recherche Intégrée](#-recherche-intégrée) • [Installation](#-installation)

</div>

---

## 🎯 Vue d'Ensemble

**NeuroHive v4.0** est un dashboard de visualisation et d'orchestration conçu pour les **ingénieurs en IA cognitive** et **architectes de systèmes intelligents**. Il intègre les frameworks de recherche les plus avancés en neurosciences computationnelles et architectures bio-inspirées.

### 🏗️ Architecture du Système

```
┌─────────────────────────────────────────────────────────────┐
│                    NEUROHIVE v4.0                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           CORE COGNITIVE (3 Modules)                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │   │
│  │  │ Cerebellum  │  │ Xsembles2P  │  │ MorphoLogic │   │   │
│  │  │ Architecture│  │ Ensembles   │  │ Morphologie │   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        NEUROSCIENCES COMPUTATIONNELLES (2 Modules)    │   │
│  │  ┌──────────────────┐  ┌──────────────────┐          │   │
│  │  │  DNRT (ICLR'24)  │  │ NEURONS (ICCV'25)│          │   │
│  │  │  Réponses Dyn.   │  │ fMRI-to-Video    │          │   │
│  │  └──────────────────┘  └──────────────────┘          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           SYSTÈME IA DISTRIBUÉ (9 Modules)            │   │
│  │  Ruche • Hardware • GPU Monitor • Ternaire • Agents   │   │
│  │  Mémoire • Gardes • Réseau • Processeurs              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Fonctionnalités

### 🎯 Core Cognitive (Nouveau v4.0)

#### 1. 🧠 Architecture Cognitive Cerebellum
**Framework Python modulaire inspiré du cerveau humain**

- **Boucle cognitive complète** en 10 étapes :
  - `Environment.observe()` → `Perception.perceive()` → `Attention.select()`
  - `Controller.interpret()` → `Memory.recall()` → `Planner.create_plan()`
  - `Reasoner.execute()` → `Action.execute()` → `Learning.update()`
  - `Memory.store_event()` → `Controller.is_goal_satisfied()`

- **7 types de mémoire** :
  - Working Memory (contexte actuel)
  - Episodic Memory (expériences passées)
  - Semantic Memory (connaissances)
  - Procedural Memory (compétences)
  - Vector Memory (recherche similarité)
  - Graph Memory (relations)
  - Stream Memory (événements temporels)

- **4 stratégies de raisonnement** :
  - LoopReasoner (ReAct)
  - LLMReasoner (séquentiel)
  - HierarchicalReasoner (multi-niveaux)
  - RecursiveReasoner (décomposition)

**Visualisation** : Canvas interactif avec boucle cognitive animée

#### 2. 🎯 Ensembles Neuronaux Xsembles2P
**Analyse d'imagerie calcique deux photons**

- **ONsembles/OFFsembles** : Identification de patterns d'activation/inhibition
- **Pipeline complet** en 10 étapes :
  1. Lecture vidéo raw → 2. Enregistrement voltage → 3. Correction mouvement
  4. Détection neurones actifs → 5. Signaux calciques → 6. Inférence spikes
  7. Activité population → 8. Extraction ensembles → 9. Sauvegarde → 10. Visualisation

- **Raster plot** temporel avec sélection d'ensembles
- **Localisation spatiale** des neurones avec connexions

**Visualisation** : Canvas avec neurones animés et connections dynamiques

#### 3. 🌳 Analyse Morphologique MorphoLogic
**Extraction de morphométriques neuronales depuis reconstructions SWC 2D**

- **4 types de neurones** : Pyramidal, Interneuron, Purkinje, Bipolar
- **3 modes de visualisation** :
  - 🌳 **Reconstruction** : Arbre morphologique avec branches récursives
  - 🎯 **Analyse de Sholl** : Intersections concentriques
  - 📊 **Métriques** : Graphiques comparatifs

- **Métriques complètes** :
  - Nombre de branches
  - Longueur totale (µm)
  - Diamètre soma (µm)
  - Branches primaires
  - Ordre maximum

**Visualisation** : Canvas avec rendu morphologique procédural

---

### 🧬 Neurosciences Computationnelles

#### 4. 🧬 DNRT — Dynamic Neural Response Tuning (ICLR 2024)
**Système neuronal vivant bio-inspiré**

- **20 neurones** organisés en 3 couches (5 input, 10 hidden, 5 output)
- **RAA (Response-Adaptive Activation)** : Seuils dynamiques ajustables
- **ARR (Aggregated Response Regularization)** : Spécificité de catégorie
- **Simulation temps réel** avec potentiels membranaires
- **Contrôle interactif** de l'intensité d'entrée

**Performance** : CIFAR-100 Top-1 Accuracy 82.4% (+2.1% vs baseline)

#### 5. 📹 NEURONS — fMRI-to-Video (ICCV 2025)
**Reconstruction vidéo à partir de signaux fMRI**

- **Pipeline en 6 étapes** :
  1. Brain Model (fMRI → CLIP embeddings)
  2. Decoupler (séparation contenu/mouvement)
  3. Reconstruction (keyframes via UnCLIP)
  4. Captioning (BLIP-2 / GPT-2)
  5. Video Gen (AnimateDiff)
  6. Evaluation (FID, SSIM, LPIPS, CLIP)

- **Émulation du cortex visuel** : V1-V5/MT
- **Métriques SOTA** : FID 15.2, SSIM 0.72, LPIPS 0.18, CLIP 0.68

---

### ⚙️ Système IA Distribué

#### 6. 🐝 Ruche d'Agents
**32 agents distribués en 6 catégories**

- ⚒️ **Ouvriers (12)** : Exécution de tâches
- 🔢 **Math (8)** : Calcul matriciel et tensoriel
- 👁️ **Superviseurs (4)** : Orchestration
- 🧠 **LLM (8)** : Modèles de langage (70B à 3B)
- 💾 **Mem0 (4)** : Mémoire vectorielle
- 🛡️ **Garde (1)** : Point d'entrée/sortie

#### 7. 🔬 Comparaison Matériel IA
**CPU vs GPU vs TPU vs NPU vs LPU**

| Processeur | Philosophie | Cœurs | Bande Passante | Puissance |
|------------|-------------|-------|----------------|-----------|
| CPU | Usage général | 2-128 | ~0.5 TB/s | 50-400W |
| GPU | Parallèle | 10K+ | ~8 TB/s | 300-1000W |
| TPU | ASIC Tensor | 128×128 | ~1.2 TB/s | 90-192W |
| NPU | Edge AI | MAC | ~100 GB/s | 4-10W |
| LPU | LLM déterministe | SRAM | ~80 TB/s | ~150W |

#### 8. ⚡ Grille de Processeurs
**32 processeurs sur 8 machines**

- H100, A100, RTX4090, MI300X, TPU v4/v5p, NPU Lunar Lake
- Monitoring temps réel : utilisation, température, puissance
- Consommation totale : ~4.5 kW

#### 9. 📊 GPU Monitor
**Style nvitop/nvidia_gpu_exporter**

- 8 devices monitorés
- Métriques live : utilisation, VRAM, température, puissance
- Graphiques historiques 60s
- Processus GPU avec PID et mémoire

#### 10. 🧊 Modèles Ternaires
**Réduction 20× des poids**

- FP32 (1B params) : 4 GB → **Ternary : 200 MB**
- Déploiement sur GPU/CPU/NPU/FPGA
- Performance : B200 (~5ms) vs ASIC ternaire (~50µs)

#### 11-14. Agents, Mémoire, Gardes, Réseau
**Infrastructure distribuée complète**

- Détails des 32 agents avec logs temps réel
- Mem0 ×4 + LLM ×8 avec métriques
- Garde unique avec journal des requêtes
- Réseau mesh avec 28 connexions

---

## 🔬 Recherche Intégrée

### Papers Scientifiques

| Projet | Conférence | Titre | Lien |
|--------|-----------|-------|------|
| **Cerebellum** | - | Cognitive Architecture Framework | [GitHub](https://github.com/Root1V/cerebellum-cognitive-architecture) |
| **Xsembles2P** | NatComms 2024 | Stimulus encoding by specific inactivation | [GitHub](https://github.com/PerezOrtegaJ/Xsembles2P) |
| **MorphoLogic** | Protocols.io 2026 | Neuronal morphometrics extraction | [GitHub](https://github.com/MaxLevianSterling/MorphoLogic) |
| **DNRT** | ICLR 2024 | Dynamic Neural Response Tuning | [GitHub](https://github.com/horrible-dong/DNRT) |
| **NEURONS** | ICCV 2025 | fMRI-to-Video Reconstruction | [GitHub](https://github.com/xmed-lab/NEURONS) |

### Outils de Monitoring

- **nvitop** : Monitoring GPU temps réel
- **nvidia_gpu_exporter** : Métriques Prometheus
- **gpu-hot** : Détection thermal throttling

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

# Déployer dist/ sur Vercel, Netlify, GitHub Pages, etc.
```

---

## 🎨 Design System

### Palette de Couleurs

```css
--primary: #10b981 (emerald)
--secondary: #06b6d4 (cyan)
--accent: #8b5cf6 (purple)
--danger: #ef4444 (red)
--warning: #f59e0b (amber)
--success: #22c55e (green)
```

### Composants

- **Glass Cards** : Backdrop blur avec bordures subtiles
- **Gradient Backgrounds** : Transitions fluides entre couleurs
- **Animations** : Pulse, float, slide-in, fade-in, scale-in
- **Progress Bars** : Avec effet de flux de données
- **Metric Cards** : Hover effects avec glow

### Typographie

- **Titres** : Gradient text (emerald → cyan → purple)
- **Corps** : Inter, -apple-system, sans-serif
- **Code** : Monospace pour visualisations techniques

---

## 📊 Métriques Système

### Performance Globale

| Métrique | Valeur |
|----------|--------|
| Composants React | 14 |
| Modules TypeScript | 43 |
| Build Size (JS) | 318 KB (81 KB gzippé) |
| Build Size (CSS) | 56 KB (9 KB gzippé) |
| Time to Interactive | < 2s |

### Modules par Catégorie

- **Core Cognitive** : 3 modules (Cerebellum, Xsembles2P, MorphoLogic)
- **Neurosciences** : 2 modules (DNRT, NEURONS)
- **Système IA** : 9 modules (Ruche, Hardware, GPU, etc.)

---

## 🛠️ Stack Technique

### Frontend

- **React 18** : Framework UI avec hooks
- **TypeScript 5** : Typage statique
- **Vite 6** : Build tool ultra-rapide
- **Tailwind CSS 4** : Utility-first styling
- **Canvas API** : Visualisations animées

### Architecture

```
src/
├── App.tsx                          # Composant principal
├── components/
│   ├── CognitiveArchitecture.tsx    # 🧠 Cerebellum
│   ├── NeuronalEnsembles.tsx        # 🎯 Xsembles2P
│   ├── MorphoAnalysis.tsx           # 🌳 MorphoLogic
│   ├── DNRTPanel.tsx                # 🧬 DNRT
│   ├── NeuronsPanel.tsx             # 📹 NEURONS
│   ├── HiveVisualization.tsx        # 🐝 Ruche
│   ├── HardwareComparison.tsx       # 🔬 Hardware
│   ├── ProcessorGrid.tsx            # ⚡ Processeurs
│   ├── GPUMonitor.tsx               # 📊 GPU Monitor
│   ├── TernaryDeployment.tsx        # 🧊 Ternaire
│   ├── AgentPanel.tsx               # 🤖 Agents
│   ├── MemoryPanel.tsx              # 💾 Mémoire
│   ├── GuardPanel.tsx               # 🛡️ Gardes
│   ├── NetworkFlow.tsx              # 🌐 Réseau
│   └── StatsBar.tsx                 # 📊 Stats
└── index.css                        # Design system
```

---

## 📖 Utilisation

### Navigation

L'application propose **14 onglets** organisés en 3 catégories :

#### 🎯 Core Cognitive
1. **Architecture Cognitive** — Boucle cognitive Cerebellum
2. **Ensembles Neuronaux** — ON/OFF ensembles Xsembles2P
3. **Morphologie** — Analyse morphologique MorphoLogic

#### 🧬 Neurosciences
4. **DNRT Vivant** — Système neuronal bio-inspiré
5. **NEURONS fMRI** — Reconstruction vidéo

#### ⚙️ Système IA
6-14. Ruche, Hardware, Processeurs, GPU Monitor, Ternaire, Agents, Mémoire, Gardes, Réseau

### Interactions

- **Cliquez** sur les éléments pour explorer les détails
- **Survolez** pour voir les métriques
- **Contrôlez** les simulations avec les sliders
- **Changez** les modes de visualisation
- **Filtrez** les données par catégorie

---

## 🎯 Cas d'Usage

### 1. Recherche en Neurosciences

**Utiliser Cerebellum + Xsembles2P + MorphoLogic pour :**
- Modéliser des architectures cognitives complètes
- Analyser des ensembles neuronaux from calcium imaging
- Extraire des morphométriques neuronales

**Workflow :**
```python
# Cerebellum
agent = CognitiveAgent(perception, memory, planner, reasoner)
result = agent.run("Analyze neural data")

# Xsembles2P
Xsembles_2P('video.tif', 'SamplingPeriod', 0.1)

# MorphoLogic
python -m morphologic.gui
```

### 2. Développement IA Bio-inspirée

**Utiliser DNRT + NEURONS pour :**
- Implémenter des activations neuronales dynamiques
- Décoder l'activité cérébrale en vidéo
- Tester des architectures cognitives

### 3. Infrastructure IA Distribuée

**Utiliser le système complet pour :**
- Orchestrer 32 agents sur 8 machines
- Monitorer 32 processeurs hétérogènes
- Déployer des modèles ternaires optimisés

---

## 🔗 Références

### Articles Scientifiques

1. **Cerebellum** — Cognitive Architecture Framework
   - GitHub: https://github.com/Root1V/cerebellum-cognitive-architecture

2. **Xsembles2P** — Pérez-Ortega et al. (2024)
   - "Stimulus encoding by specific inactivation of cortical neurons"
   - Nat Commun 15, 3192
   - GitHub: https://github.com/PerezOrtegaJ/Xsembles2P

3. **MorphoLogic** — Sterling et al. (2026)
   - "Neuronal morphometrics extraction from SWC reconstructions"
   - Protocols.io
   - GitHub: https://github.com/MaxLevianSterling/MorphoLogic

4. **DNRT** — Qiu et al. (ICLR 2024)
   - "Dynamic Neural Response Tuning"
   - GitHub: https://github.com/horrible-dong/DNRT

5. **NEURONS** — Wang et al. (ICCV 2025)
   - "Emulating the Human Visual Cortex for fMRI-to-Video"
   - GitHub: https://github.com/xmed-lab/NEURONS

### Outils

- **nvitop** : https://github.com/XuehaiPan/nvitop
- **nvidia_gpu_exporter** : https://github.com/utkuozdemir/nvidia_gpu_exporter
- **gpu-hot** : https://github.com/psalias2006/gpu-hot

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📄 Licence

MIT License - Voir [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 Remerciements

- **Root1V** pour Cerebellum Cognitive Architecture
- **PerezOrtegaJ** pour Xsembles2P
- **MaxLevianSterling** pour MorphoLogic
- **horrible-dong** pour DNRT (ICLR 2024)
- **xmed-lab** pour NEURONS (ICCV 2025)
- **Communauté open-source** pour nvitop, nvidia_gpu_exporter, gpu-hot

---

## 📞 Contact

Pour questions ou suggestions :
- GitHub Issues : [ouvrir une issue](https://github.com/votre-username/neurohive/issues)

---

<div align="center">

**⭐ Si ce projet vous est utile, n'hésitez pas à lui donner une étoile !**

**Conçu pour les ingénieurs en IA cognitive qui repoussent les limites de l'intelligence artificielle bio-inspirée**

Fait avec 🧠 par des architectes de systèmes cognitifs

</div>
