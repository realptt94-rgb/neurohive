#!/bin/bash

# ============================================
# NEUROHIVE v4.0 - Script de Déploiement
# ============================================

set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   🧠 NeuroHive v4.0 - Déploiement                        ║"
echo "║   Architecture Cognitive Avancée                         ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ============================================
# Vérifications
# ============================================

echo -e "${BLUE}🔍 Vérifications pré-déploiement...${NC}"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js: $NODE_VERSION${NC}"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm n'est pas installé${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm: $NPM_VERSION${NC}"

# Vérifier Docker (optionnel)
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✓ Docker: $DOCKER_VERSION${NC}"
else
    echo -e "${BLUE}ℹ Docker non détecté (optionnel)${NC}"
fi

echo ""

# ============================================
# Choix du mode de déploiement
# ============================================

echo "Choisissez le mode de déploiement:"
echo "1) Netlify (Frontend uniquement)"
echo "2) GitHub Pages (Frontend uniquement)"
echo "3) Docker Compose (Frontend + Backend)"
echo "4) Backend uniquement"
echo ""

read -p "Votre choix (1-4): " choice

case $choice in
    1)
        echo -e "${BLUE}📦 Déploiement Netlify...${NC}"
        
        # Build frontend
        echo "Building frontend..."
        npm install
        npm run build
        
        # Déployer avec Netlify CLI
        if ! command -v netlify &> /dev/null; then
            echo "Installation de Netlify CLI..."
            npm install -g netlify-cli
        fi
        
        echo "Déploiement sur Netlify..."
        netlify deploy --prod --dir=dist
        
        echo -e "${GREEN}✓ Déploiement Netlify terminé!${NC}"
        ;;
        
    2)
        echo -e "${BLUE}📦 Déploiement GitHub Pages...${NC}"
        
        # Build frontend
        echo "Building frontend..."
        npm install
        npm run build
        
        # Déployer avec gh-pages
        if ! command -v gh-pages &> /dev/null; then
            echo "Installation de gh-pages..."
            npm install -g gh-pages
        fi
        
        echo "Déploiement sur GitHub Pages..."
        gh-pages -d dist
        
        echo -e "${GREEN}✓ Déploiement GitHub Pages terminé!${NC}"
        ;;
        
    3)
        echo -e "${BLUE}🐳 Déploiement Docker Compose...${NC}"
        
        # Vérifier Docker
        if ! command -v docker &> /dev/null; then
            echo -e "${RED}❌ Docker est requis pour ce mode${NC}"
            exit 1
        fi
        
        # Créer .env si nécessaire
        if [ ! -f backend/.env ]; then
            echo "Création du fichier .env..."
            cp backend/.env.example backend/.env
            echo "⚠️  Éditez backend/.env avec vos configurations"
        fi
        
        # Build et start
        echo "Building Docker images..."
        docker-compose build
        
        echo "Starting services..."
        docker-compose up -d
        
        echo -e "${GREEN}✓ Services démarrés!${NC}"
        echo ""
        echo "Frontend: http://localhost"
        echo "Backend:  http://localhost:3001"
        echo "API Docs: http://localhost:3001/health"
        ;;
        
    4)
        echo -e "${BLUE}🚀 Déploiement Backend uniquement...${NC}"
        
        cd backend
        
        # Installer les dépendances
        echo "Installation des dépendances..."
        npm install
        
        # Créer .env si nécessaire
        if [ ! -f .env ]; then
            echo "Création du fichier .env..."
            cp .env.example .env
            echo "⚠️  Éditez .env avec vos configurations"
        fi
        
        # Démarrer le serveur
        echo "Démarrage du serveur..."
        npm start
        
        echo -e "${GREEN}✓ Backend démarré sur http://localhost:3001${NC}"
        ;;
        
    *)
        echo -e "${RED}❌ Choix invalide${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║   ✅ Déploiement terminé avec succès!                    ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
