# 🧠 NeuroHive Backend v4.0

Backend Node.js/Express pour NeuroHive - Architecture Cognitive Avancée

## 🚀 Démarrage Rapide

```bash
# Installer les dépendances
npm install

# Configurer
cp .env.example .env
nano .env

# Démarrer
npm start

# Ou avec nodemon (development)
npm run dev
```

## 📊 APIs

### GPU Metrics
```
GET /api/gpu
```
Retourne les métriques GPU (NVIDIA ou simulées)

### System Info
```
GET /api/system
```
Informations système (CPU, RAM, OS, Disk)

### Cognitive Architecture
```
GET /api/cognitive
```
État de l'architecture cognitive (Cerebellum)

### Neuronal Ensembles
```
GET /api/ensembles
```
Ensembles neuronaux (Xsembles2P)

### Morphological Analysis
```
GET /api/morphology
```
Analyse morphologique (MorphoLogic)

### DNRT Neural Response
```
GET /api/dnrt
```
Réponses neuronales dynamiques (DNRT)

### NEURONS fMRI-to-Video
```
GET /api/neurons
```
Pipeline fMRI-to-Video (NEURONS)

## 🔌 WebSocket

```
ws://localhost:3001
```

Updates temps réel toutes les secondes :
- GPU metrics
- Cognitive state
- Neuronal ensembles
- DNRT responses

## 🐳 Docker

```bash
# Build
docker build -t neurohive-backend .

# Run
docker run -p 3001:3001 \
  --gpus all \
  -v /usr/bin/nvidia-smi:/usr/bin/nvidia-smi:ro \
  neurohive-backend
```

## 🔧 Configuration

Voir `.env.example` pour toutes les options

## 📝 Logs

```bash
# Production
npm start

# Development
npm run dev

# PM2
pm2 start server.js --name neurohive-backend
pm2 logs neurohive-backend
```

## 🧪 Testing

```bash
# Health check
curl http://localhost:3001/health

# GPU metrics
curl http://localhost:3001/api/gpu

# System info
curl http://localhost:3001/api/system
```

## 📚 Dépendances

- **express** - Web framework
- **ws** - WebSocket server
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **systeminformation** - System metrics
- **node-fetch** - HTTP client

## 🔒 Sécurité

- CORS configuré
- Rate limiting
- Non-root user (Docker)
- Health checks
- Input validation

## 📖 Documentation

- [DEPLOYMENT.md](../DEPLOYMENT.md) - Guide de déploiement
- [README.md](../README.md) - Documentation principale

## 🆘 Support

GitHub Issues : [ouvrir une issue](https://github.com/votre-username/neurohive/issues)

---

**NeuroHive Backend v4.0** - Architecture Cognitive Avancée
