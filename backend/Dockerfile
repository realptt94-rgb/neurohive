# ============================================
# NeuroHive Backend - Production Dockerfile
# ============================================

FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# ============================================
# Image de production
# ============================================

FROM node:18-alpine

WORKDIR /app

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S neurohive -u 1001

# Copier les dépendances depuis le builder
COPY --from=builder --chown=neurohive:nodejs /app/node_modules ./node_modules

# Copier le code source
COPY --chown=neurohive:nodejs package*.json ./
COPY --chown=neurohive:nodejs server.js ./

# Installer nvidia-smi si disponible (optionnel)
RUN apk add --no-cache nvidia-smi || true

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3001

# Exposer le port
EXPOSE 3001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Utiliser l'utilisateur non-root
USER neurohive

# Commande de démarrage
CMD ["node", "server.js"]
