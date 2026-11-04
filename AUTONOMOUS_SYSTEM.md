# 🚀 Guide du Système Autonome NeuroHive v5.0

## ✅ Système 100% Autonome - NVIDIA AI Intégré

NeuroHive v5.0 est maintenant un système **complètement autonome** qui n'a **aucune dépendance GitHub externe**. Tous les modèles d'IA sont accessibles via l'API NVIDIA avec vos clés API cryptées.

---

## 🎯 Ce qui a changé

### ❌ AVANT (v4.0)
- Liens vers des projets GitHub externes (Cerebellum, Xsembles2P, MorphoLogic, DNRT, NEURONS)
- Dépendances à des repositories tiers
- Pas d'intégration API directe

### ✅ MAINTENANT (v5.0)
- **Aucun lien GitHub externe**
- **Intégration directe API NVIDIA**
- **Clés API cryptées en Base64**
- **Système 100% autonome**
- **Modèles hébergés par NVIDIA**

---

## 🤖 Modèles NVIDIA Intégrés

### 1. Vision-Language (Nemotron Super VL 120B)
- **Modèle** : `nvidia/nemotron-3.5-super-vl-120b-a12b`
- **Capacités** : Analyse d'images, raisonnement visuel, compréhension multimodale
- **Utilisation** : `/api/nvidia/vision`

### 2. Reasoning (Nemotron Bolt)
- **Modèle** : `nvidia/nemotron-3.5-bolt-e4b`
- **Capacités** : Raisonnement complexe, résolution de problèmes
- **Utilisation** : `/api/nvidia/reason`

### 3. Safety Classification (Llama Guard 4 12B)
- **Modèle** : `meta/llama-guard-4-12b`
- **Capacités** : Classification de sécurité, détection de contenu dangereux
- **Utilisation** : `/api/nvidia/safety`

### 4. Topic Control (Nemoguard)
- **Modèle** : `nvidia/llama-3.1-nemoguard-8b-topic-control`
- **Capacités** : Contrôle de sujet, modération de contenu
- **Utilisation** : `/api/nvidia/topic`

### 5. Biology (RFDiffusion)
- **Modèle** : `ipd/rfdiffusion`
- **Capacités** : Génération de structures protéiques
- **Utilisation** : `/api/nvidia/biology`

---

## 🔐 Sécurité des Clés API

### Stockage Crypté

Les clés API sont stockées en **Base64** dans `.env` :

```env
# Clé API Vision-Language (Base64)
NVIDIA_API_KEY_VL=bnZhcGktNVNaR0dxTGVVX0RyMks3bTdKOHBwZU4ySmxMR0FMejVmZlZMWThZSVpXOHJwamZSVUk4bDEzdTFNbl9GZHhpTQ==

# Clé API Guard (Base64)
NVIDIA_API_KEY_GUARD=bnZhcGktOGh4eW0wVm9HNldYZzBHaWxDY0IzelYtRm9QUEwxTXBLeU5uQ0RmbzlvNHdDak0zZGswQ2s2RkZwSC1NOVBnQWI=

# Clé API Biology (Base64)
NVIDIA_API_KEY_BIO=bnZhcGktbEJiTmE3UGFwMVdlYkZwTy1Qa2EtRU1mOVNXRzV1bUpHWHNyRTVJT2dZMGVpelJkU2M4eEdvZW5MLUZqLVZpWQ==
```

### Décryptage au Runtime

```javascript
// backend/utils/nvidiaCrypto.js
export function decryptAPIKey(encodedKey) {
  const decoded = Buffer.from(encodedKey, 'base64').toString('utf-8');
  return decoded;
}
```

### Bonnes Pratiques

- ✅ `.env` dans `.gitignore`
- ✅ Clés jamais dans le code source
- ✅ Décryptage uniquement au runtime
- ✅ Variables d'environnement séparées

---

## 🎮 Utilisation

### 1. Démarrer le Système

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
npm run dev
```

### 2. Accéder à l'Interface

- **Frontend** : http://localhost:5173
- **Onglet NVIDIA AI** : http://localhost:5173/nvidia

### 3. Tester les Modèles

#### Vision-Language
```javascript
// Interface web
1. Aller sur l'onglet "NVIDIA AI"
2. Sélectionner "Vision-Language"
3. Entrer une URL d'image
4. Entrer un prompt
5. Cliquer "Lancer le test"
```

#### Reasoning
```javascript
// Interface web
1. Aller sur l'onglet "NVIDIA AI"
2. Sélectionner "Reasoning"
3. Entrer un prompt (ex: "Which number is larger, 9.11 or 9.8?")
4. Cliquer "Lancer le test"
```

#### Safety Classification
```javascript
// Interface web
1. Aller sur l'onglet "NVIDIA AI"
2. Sélectionner "Safety"
3. Entrer du contenu à analyser
4. Cliquer "Lancer le test"
5. Voir le résultat : SAFE ou UNSAFE avec catégories
```

#### Biology
```javascript
// Interface web
1. Aller sur l'onglet "NVIDIA AI"
2. Sélectionner "Biology"
3. Cliquer "Lancer le test"
4. Voir la structure protéique générée
```

---

## 📊 Architecture Autonome

```
┌─────────────────────────────────────────────────────────┐
│                    NEUROHIVE v5.0                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  FRONTEND (React + Vite)                                │
│  ├─ NVIDIA AI Integration (nouveau!)                    │
│  ├─ 15 modules visuels                                  │
│  └─ WebSocket client                                    │
│                                                          │
│  ↕ REST API + WebSocket                                  │
│                                                          │
│  BACKEND (Node.js + Express)                            │
│  ├─ NVIDIA Service (API integration)                   │
│  ├─ Crypto Utils (Base64 decryption)                    │
│  ├─ GPU Monitoring                                      │
│  └─ WebSocket server                                    │
│                                                          │
│  NVIDIA APIs (externes, hébergées par NVIDIA)          │
│  ├─ Vision-Language (Nemotron Super VL 120B)           │
│  ├─ Reasoning (Nemotron Bolt)                           │
│  ├─ Safety (Llama Guard 4 12B)                          │
│  ├─ Topic Control (Nemoguard)                           │
│  └─ Biology (RFDiffusion)                               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔒 Ce qui est Autonome

### ✅ Local (sur votre machine)
- Frontend React
- Backend Node.js
- Base de données (si configurée)
- Monitoring GPU/CPU
- WebSocket server
- Décryptage des clés API

### ☁️ Externe (hébergé par NVIDIA)
- Modèles d'IA (Nemotron, Llama Guard, RFDiffusion)
- APIs d'inférence
- Pas de dépendance GitHub

---

## 🎯 Avantages du Système Autonome

1. **Indépendance Totale**
   - Pas de dépendance à des repositories GitHub externes
   - Pas de liens cassés
   - Pas de mises à jour externes à gérer

2. **Sécurité Maximale**
   - Clés API cryptées
   - Pas de clés dans le code source
   - .env dans .gitignore

3. **Performance Optimale**
   - Modèles hébergés par NVIDIA (infrastructure professionnelle)
   - Pas de téléchargement de modèles
   - Accès direct aux dernières versions

4. **Maintenance Simplifiée**
   - Un seul codebase à maintenir
   - Pas de synchronisation avec des projets externes
   - Mises à jour centralisées

---

## 📝 Exemples d'Utilisation

### Exemple 1 : Analyse d'Image

```javascript
// Via l'interface web
POST /api/nvidia/vision
{
  "imageUrl": "https://assets.ngc.nvidia.com/products/api-catalog/phi-3-5-vision/example1a.jpg",
  "prompt": "Read the traffic sign in this image. What does it say?"
}

// Réponse
{
  "success": true,
  "data": "The traffic sign says 'STOP' and is red with white text.",
  "model": "nvidia/nemotron-3.5-super-vl-120b-a12b",
  "timestamp": "2026-01-04T..."
}
```

### Exemple 2 : Raisonnement

```javascript
POST /api/nvidia/reason
{
  "prompt": "Which number is larger, 9.11 or 9.8?"
}

// Réponse
{
  "success": true,
  "data": "9.8 is larger than 9.11. When comparing decimals...",
  "model": "nvidia/nemotron-3.5-bolt-e4b",
  "timestamp": "2026-01-04T..."
}
```

### Exemple 3 : Classification de Sécurité

```javascript
POST /api/nvidia/safety
{
  "content": "How do I make a bomb?",
  "type": "text"
}

// Réponse
{
  "success": true,
  "isSafe": false,
  "classification": "unsafe\nS9",
  "categories": ["S9"],
  "model": "meta/llama-guard-4-12b",
  "timestamp": "2026-01-04T..."
}
```

---

## 🚀 Déploiement

### Option 1 : Netlify + Render

```bash
# Frontend sur Netlify
# Backend sur Render
# Clés API dans les variables d'environnement
```

### Option 2 : Docker Compose

```bash
docker-compose up -d
```

### Option 3 : VPS

```bash
# Voir PRODUCTION.md
```

---

## 📚 Documentation Complète

- [README.md](./README.md) - Documentation principale
- [QUICKSTART.md](./QUICKSTART.md) - Démarrage rapide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guide de déploiement
- [PRODUCTION.md](./PRODUCTION.md) - Mise en production
- [backend/README.md](./backend/README.md) - Documentation backend

---

## ✅ Checklist de Démarrage

- [ ] Cloner le repository
- [ ] Installer les dépendances (`npm install`)
- [ ] Configurer `.env` avec vos clés API NVIDIA
- [ ] Lancer le backend (`cd backend && npm start`)
- [ ] Lancer le frontend (`npm run dev`)
- [ ] Accéder à http://localhost:5173/nvidia
- [ ] Tester les modèles NVIDIA
- [ ] Vérifier que tout fonctionne

---

## 🎓 Prochaines Étapes

1. **Explorer les modèles NVIDIA** dans l'onglet "NVIDIA AI"
2. **Tester différentes capacités** (vision, reasoning, safety, biology)
3. **Intégrer dans vos applications** via les APIs REST
4. **Déployer en production** avec Docker ou Netlify/Render
5. **Personnaliser** les prompts et les workflows

---

## 🆘 Support

Pour toute question :
- Consultez la documentation
- Vérifiez les logs backend/frontend
- Ouvrez une issue sur GitHub

---

**Système Autonome - 100% Indépendant - NVIDIA AI Intégré** 🚀
