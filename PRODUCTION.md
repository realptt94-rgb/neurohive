# 🚀 Guide de Mise en Production - NeuroHive v4.0

## 📋 Checklist de Production

### ✅ Pré-requis

- [ ] Tests locaux réussis
- [ ] Build production OK (`npm run build`)
- [ ] Variables d'environnement configurées
- [ ] Backend testé avec données réelles
- [ ] WebSocket fonctionnel
- [ ] Documentation à jour

### ✅ Sécurité

- [ ] HTTPS activé
- [ ] Variables sensibles dans secrets (pas dans le code)
- [ ] CORS configuré correctement
- [ ] Rate limiting activé
- [ ] Headers de sécurité (X-Frame-Options, etc.)
- [ ] Non-root user dans Docker
- [ ] Secrets GitHub configurés

### ✅ Performance

- [ ] Lighthouse > 90
- [ ] Backend response time < 100ms
- [ ] WebSocket latency < 50ms
- [ ] Gzip compression activé
- [ ] Cache headers configurés
- [ ] CDN configuré (si nécessaire)

### ✅ Monitoring

- [ ] Logs configurés
- [ ] Alertes configurées
- [ ] Health checks actifs
- [ ] Métriques collectées
- [ ] Erreurs trackées (Sentry)

---

## 🌐 Options de Déploiement

### Option 1 : Netlify + Render (Recommandé)

**Frontend** : Netlify (gratuit, rapide)
**Backend** : Render (gratuit/starter, Node.js)

#### Frontend (Netlify)

```bash
# 1. Connecter le repo GitHub
# 2. Build command: npm run build
# 3. Publish directory: dist
# 4. Ajouter les variables d'environnement:
VITE_API_URL=https://neurohive-backend.onrender.com
VITE_WS_URL=wss://neurohive-backend.onrender.com
```

#### Backend (Render)

```bash
# 1. Connecter le repo GitHub
# 2. Root directory: backend
# 3. Build command: npm install
# 4. Start command: npm start
# 5. Ajouter les variables d'environnement:
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://neurohive.netlify.app
```

**Coût** : Gratuit (avec limitations) ou $7/mois pour Render Starter

---

### Option 2 : Railway (Tout-en-un)

**Frontend + Backend** sur Railway

```bash
# 1. Installer Railway CLI
npm i -g @railway/cli

# 2. Se connecter
railway login

# 3. Créer un projet
railway init

# 4. Ajouter les services
railway up

# 5. Configurer les domaines
railway domain
```

**Coût** : $5/mois (starter)

---

### Option 3 : VPS (Contrôle Total)

**Serveur** : DigitalOcean, Hetzner, OVH

```bash
# 1. Louer un VPS (2GB RAM minimum)
# 2. Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. Cloner le repo
git clone https://github.com/votre-username/neurohive.git
cd neurohive

# 4. Configurer
cp backend/.env.example backend/.env
nano backend/.env

# 5. Démarrer
docker-compose up -d

# 6. Configurer Nginx + Let's Encrypt
sudo apt install nginx certbot python3-certbot-nginx
sudo certbot --nginx -d neurohive.votredomaine.com
```

**Coût** : ~$5-10/mois

---

### Option 4 : AWS/GCP/Azure (Enterprise)

**Pour les grandes entreprises**

```bash
# AWS
- Frontend: S3 + CloudFront
- Backend: ECS Fargate
- Database: RDS PostgreSQL
- Cache: ElastiCache Redis

# GCP
- Frontend: Cloud Storage + CDN
- Backend: Cloud Run
- Database: Cloud SQL
- Cache: Memorystore

# Azure
- Frontend: Static Web Apps
- Backend: Container Instances
- Database: Azure SQL
- Cache: Azure Cache for Redis
```

**Coût** : Variable (pay-as-you-go)

---

## 🔧 Configuration Production

### Variables d'Environnement

#### Frontend (Netlify/Vercel)

```env
VITE_API_URL=https://api.neurohive.com
VITE_WS_URL=wss://api.neurohive.com
```

#### Backend (Render/Railway/VPS)

```env
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://neurohive.netlify.app

# GPU (si disponible)
NVIDIA_SMI_PATH=/usr/bin/nvidia-smi

# Database (optionnel)
DATABASE_URL=postgresql://user:pass@host:5432/neurohive
REDIS_URL=redis://host:6379

# APIs externes (optionnel)
HF_TOKEN=your_token
OPENAI_API_KEY=your_key
```

### Nginx (VPS)

```nginx
server {
    listen 80;
    server_name neurohive.votredomaine.com;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /ws {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

---

## 📊 Monitoring & Logs

### Logs

```bash
# Docker
docker-compose logs -f backend
docker-compose logs -f frontend

# PM2
pm2 logs neurohive-backend

# Systemd
journalctl -u neurohive-backend -f

# Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Métriques

```bash
# Backend
curl http://localhost:3001/api/gpu
curl http://localhost:3001/api/system

# Prometheus (si activé)
curl http://localhost:9090/api/v1/query?query=up
```

### Alertes

Configurer des alertes pour :
- CPU > 80%
- Memory > 90%
- GPU Temperature > 85°C
- API errors > 5%
- WebSocket disconnects

---

## 🔄 Mise à Jour

### Frontend (Netlify/Vercel)

```bash
# Pousser les changements
git add .
git commit -m "Update: nouvelles fonctionnalités"
git push origin main

# Auto-déploiement
```

### Backend (Render/Railway)

```bash
# Pousser les changements
cd backend
git add .
git commit -m "Update: API improvements"
git push origin main

# Auto-déploiement
```

### VPS (Docker)

```bash
# Pull les changements
git pull origin main

# Rebuild et restart
docker-compose down
docker-compose build backend
docker-compose up -d

# Vérifier
docker-compose ps
curl http://localhost:3001/health
```

---

## 🔒 Sécurité Avancée

### HTTPS

```bash
# Let's Encrypt (gratuit)
sudo certbot --nginx -d neurohive.votredomaine.com

# Renouvellement automatique
sudo certbot renew --dry-run
```

### Firewall

```bash
# UFW (Ubuntu)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable

# Vérifier
sudo ufw status
```

### Rate Limiting

```javascript
// backend/server.js
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### CORS

```javascript
// backend/server.js
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

## 📈 Performance

### Optimisations

**Frontend** :
- ✅ Code splitting (Vite)
- ✅ Tree shaking
- ✅ Gzip compression
- ✅ Cache headers
- ✅ CDN (Netlify/Vercel)

**Backend** :
- ✅ Connection pooling
- ✅ Redis cache (optionnel)
- ✅ Rate limiting
- ✅ Compression

**Database** (si utilisé) :
- ✅ Indexation
- ✅ Connection pooling
- ✅ Query optimization

### Benchmarks

**Objectifs** :
- Frontend : Lighthouse > 90
- Backend : Response time < 100ms
- WebSocket : Latency < 50ms
- Uptime : > 99.9%

---

## 📚 Ressources

### Documentation

- [Express.js](https://expressjs.com/)
- [Docker](https://docs.docker.com/)
- [Netlify](https://docs.netlify.com/)
- [Render](https://render.com/docs)
- [Railway](https://docs.railway.app/)

### Support

- GitHub Issues : [ouvrir une issue](https://github.com/votre-username/neurohive/issues)
- Discussions : [GitHub Discussions](https://github.com/votre-username/neurohive/discussions)

---

## ✅ Checklist Finale

### Avant déploiement

- [ ] Tests locaux réussis
- [ ] Build production OK
- [ ] Variables d'environnement configurées
- [ ] Secrets GitHub configurés
- [ ] Documentation à jour

### Après déploiement

- [ ] URL accessible
- [ ] HTTPS activé
- [ ] API endpoints fonctionnent
- [ ] WebSocket connecté
- [ ] Monitoring actif
- [ ] Logs vérifiés
- [ ] Performance testée
- [ ] Alertes configurées

---

**Bon déploiement en production !** 🚀

Pour toute question, ouvrez une issue sur GitHub.
