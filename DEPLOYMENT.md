# 🚀 Guide de Déploiement NeuroHive v4.0

## 📋 Vue d'Ensemble

Ce guide vous accompagne pour déployer NeuroHive v4.0 en production avec différentes configurations.

---

## 🎯 Options de Déploiement

### Option 1 : Frontend Uniquement (Netlify/GitHub Pages)

**Idéal pour** : Dashboard statique avec données simulées

#### Netlify

```bash
# 1. Installer Netlify CLI
npm install -g netlify-cli

# 2. Se connecter
netlify login

# 3. Déployer
npm run build
netlify deploy --prod --dir=dist
```

**Ou via l'interface Netlify** :
1. Connectez votre repo GitHub
2. Build command : `npm run build`
3. Publish directory : `dist`
4. Deploy

#### GitHub Pages

```bash
# 1. Installer gh-pages
npm install -g gh-pages

# 2. Build et déploy
npm run build
gh-pages -d dist
```

**Ou via GitHub Actions** :
- Le workflow `.github/workflows/deploy.yml` est déjà configuré
- Push sur `main` → déploiement automatique

---

### Option 2 : Frontend + Backend (Docker Compose)

**Idéal pour** : Données GPU réelles, WebSocket temps réel

#### Prérequis

```bash
# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose
sudo apt-get install docker-compose-plugin
```

#### Déploiement

```bash
# 1. Cloner le repo
git clone https://github.com/votre-username/neurohive.git
cd neurohive

# 2. Configurer
cp backend/.env.example backend/.env
nano backend/.env  # Éditer les variables

# 3. Build et start
docker-compose up -d

# 4. Vérifier
docker-compose ps
curl http://localhost/health
curl http://localhost:3001/health
```

**Accès** :
- Frontend : http://localhost
- Backend : http://localhost:3001
- API Docs : http://localhost:3001/health

#### Avec Monitoring (Prometheus + Grafana)

```bash
# Démarrer avec monitoring
docker-compose --profile monitoring up -d

# Accès
# Prometheus : http://localhost:9090
# Grafana : http://localhost:3000 (admin/admin)
```

---

### Option 3 : Backend Uniquement

**Idéal pour** : API séparée, microservices

```bash
cd backend

# 1. Installer
npm install

# 2. Configurer
cp .env.example .env
nano .env

# 3. Démarrer
npm start

# Ou avec PM2 (production)
npm install -g pm2
pm2 start server.js --name neurohive-backend
pm2 save
pm2 startup
```

---

## 🔧 Configuration

### Variables d'Environnement

#### Frontend (`.env`)

```env
# URL du backend
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001

# Pour production
VITE_API_URL=https://api.neurohive.com
VITE_WS_URL=wss://api.neurohive.com
```

#### Backend (`backend/.env`)

```env
# Server
PORT=3001
NODE_ENV=production

# CORS
FRONTEND_URL=https://neurohive.netlify.app

# GPU (auto-détecté si NVIDIA)
NVIDIA_SMI_PATH=/usr/bin/nvidia-smi

# Optionnel - APIs externes
HF_TOKEN=your_huggingface_token
OPENAI_API_KEY=your_openai_key

# Database (optionnel)
DATABASE_URL=postgresql://user:pass@localhost:5432/neurohive
REDIS_URL=redis://localhost:6379
```

---

## 🌐 Configuration Domaine

### Netlify

1. **Dashboard Netlify** → Site settings → Domain management
2. **Add custom domain** → `neurohive.votredomaine.com`
3. **Configurer DNS** chez votre registrar :
   ```
   Type: CNAME
   Name: neurohive
   Value: votre-site.netlify.app
   ```

### GitHub Pages

1. **Settings** → Pages → Custom domain
2. Entrer : `neurohive.votredomaine.com`
3. **Configurer DNS** :
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```

### Docker (Nginx)

```nginx
server {
    listen 80;
    server_name neurohive.votredomaine.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Avec HTTPS (Let's Encrypt)** :
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d neurohive.votredomaine.com
```

---

## 🔒 Sécurité

### Checklist

- [ ] Variables d'environnement sécurisées (pas dans le code)
- [ ] HTTPS activé
- [ ] CORS configuré correctement
- [ ] Rate limiting activé
- [ ] Headers de sécurité (X-Frame-Options, etc.)
- [ ] Non-root user dans Docker
- [ ] Secrets dans GitHub Secrets (pas dans le repo)

### GitHub Secrets

Pour GitHub Actions, ajouter dans **Settings** → **Secrets** :

```
API_URL=https://api.neurohive.com
WS_URL=wss://api.neurohive.com
HF_TOKEN=your_token
OPENAI_API_KEY=your_key
```

---

## 📊 Monitoring

### Logs

```bash
# Docker
docker-compose logs -f backend
docker-compose logs -f frontend

# PM2
pm2 logs neurohive-backend

# Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Métriques

**Backend** :
```bash
curl http://localhost:3001/api/gpu
curl http://localhost:3001/api/system
curl http://localhost:3001/api/cognitive
```

**Prometheus** (si activé) :
```bash
curl http://localhost:9090/api/v1/query?query=up
```

### Alertes

Configurer des alertes pour :
- CPU > 80%
- Memory > 90%
- GPU Temperature > 85°C
- API errors > 5%

---

## 🔄 Mise à Jour

### Frontend (Netlify/GitHub Pages)

```bash
# Pousser les changements
git add .
git commit -m "Update: nouvelles fonctionnalités"
git push origin main

# Auto-déploiement via CI/CD
```

### Backend (Docker)

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

## 🐛 Dépannage

### Problème : Backend ne démarre pas

```bash
# Vérifier les logs
docker-compose logs backend

# Vérifier les ports
sudo lsof -i :3001

# Redémarrer
docker-compose restart backend
```

### Problème : GPU non détecté

```bash
# Vérifier nvidia-smi
nvidia-smi

# Vérifier les drivers
lsmod | grep nvidia

# Dans Docker, vérifier les devices
docker-compose exec backend nvidia-smi
```

### Problème : WebSocket ne connecte pas

```bash
# Vérifier le firewall
sudo ufw status

# Ouvrir le port
sudo ufw allow 3001

# Vérifier Nginx
cat /etc/nginx/nginx.conf | grep -A 10 "location /ws"
```

---

## 📈 Performance

### Optimisations

**Frontend** :
- ✅ Code splitting automatique (Vite)
- ✅ Tree shaking
- ✅ Gzip compression
- ✅ Cache headers
- ✅ CDN (Netlify/GitHub)

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

---

## 📚 Ressources

### Documentation

- [Express.js](https://expressjs.com/)
- [Docker](https://docs.docker.com/)
- [Netlify](https://docs.netlify.com/)
- [GitHub Pages](https://pages.github.com/)

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

---

**Bon déploiement !** 🚀

Pour toute question, ouvrez une issue sur GitHub.
