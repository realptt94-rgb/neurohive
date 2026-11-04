# 🚀 Démarrage Rapide - NeuroHive v4.0

## ⚡ Installation en 3 étapes

### 1. Cloner le repository

```bash
git clone https://github.com/votre-username/neurohive.git
cd neurohive
```

### 2. Installer les dépendances

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 3. Démarrer

```bash
# Option A : Script automatique
chmod +x start.sh
./start.sh

# Option B : Manuellement
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
npm run dev
```

---

## 🎯 Modes de Démarrage

### Mode 1 : Frontend Uniquement (Données Simulées)

```bash
npm run dev
```

**Accès** : http://localhost:5173

✅ Parfait pour tester l'interface
❌ Pas de données GPU réelles

---

### Mode 2 : Frontend + Backend (Données Réelles)

```bash
# Terminal 1
cd backend
npm start

# Terminal 2
npm run dev
```

**Accès** :
- Frontend : http://localhost:5173
- Backend : http://localhost:3001
- API : http://localhost:3001/api/gpu

✅ Données GPU réelles (si NVIDIA)
✅ WebSocket temps réel
✅ APIs complètes

---

### Mode 3 : Docker Compose (Production)

```bash
# Configurer
cp backend/.env.example backend/.env
nano backend/.env

# Démarrer
docker-compose up -d

# Voir les logs
docker-compose logs -f
```

**Accès** :
- Frontend : http://localhost
- Backend : http://localhost:3001

✅ Environnement isolé
✅ Prêt pour production
✅ GPU support (NVIDIA)

---

## 🔧 Configuration

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

### Backend (backend/.env)

```env
PORT=3001
NODE_ENV=production
FRONTEND_URL=http://localhost:5173
```

---

## 📊 APIs Disponibles

### GPU Metrics
```bash
curl http://localhost:3001/api/gpu
```

### System Info
```bash
curl http://localhost:3001/api/system
```

### Cognitive Architecture
```bash
curl http://localhost:3001/api/cognitive
```

### Neuronal Ensembles
```bash
curl http://localhost:3001/api/ensembles
```

### Morphological Analysis
```bash
curl http://localhost:3001/api/morphology
```

### DNRT Neural Response
```bash
curl http://localhost:3001/api/dnrt
```

### NEURONS fMRI-to-Video
```bash
curl http://localhost:3001/api/neurons
```

---

## 🐛 Dépannage

### Problème : Backend ne démarre pas

```bash
# Vérifier les logs
cd backend
npm start

# Vérifier le port
sudo lsof -i :3001
```

### Problème : GPU non détecté

```bash
# Vérifier nvidia-smi
nvidia-smi

# Si erreur, installer les drivers NVIDIA
# Ubuntu/Debian
sudo apt install nvidia-driver-535

# Redémarrer
sudo reboot
```

### Problème : WebSocket ne connecte pas

```bash
# Vérifier le firewall
sudo ufw allow 3001

# Vérifier CORS
# backend/.env : FRONTEND_URL=http://localhost:5173
```

---

## 📖 Documentation Complète

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guide de déploiement complet
- [README.md](./README.md) - Documentation principale
- [backend/README.md](./backend/README.md) - Documentation backend

---

## 🎓 Prochaines Étapes

1. **Tester l'interface** : Ouvrir http://localhost:5173
2. **Explorer les APIs** : http://localhost:3001/api/gpu
3. **Configurer le backend** : Éditer backend/.env
4. **Déployer** : Suivre DEPLOYMENT.md

---

## 🆘 Support

- GitHub Issues : [ouvrir une issue](https://github.com/votre-username/neurohive/issues)
- Documentation : [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Bon démarrage !** 🚀
