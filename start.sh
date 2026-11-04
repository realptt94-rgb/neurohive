#!/bin/bash

# ============================================
# NEUROHIVE v4.0 - Script de Démarrage Rapide
# ============================================

set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   🧠 NeuroHive v4.0 - Démarrage Rapide                  ║"
echo "║   Architecture Cognitive Avancée                         ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# ============================================
# Vérifications
# ============================================

echo -e "${BLUE}🔍 Vérifications système...${NC}"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    echo "Installez Node.js 18+ depuis https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ requis (version actuelle: $(node -v))${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm n'est pas installé${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm $(npm -v)${NC}"

# Vérifier Docker (optionnel)
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker $(docker --version | cut -d' ' -f3 | cut -d',' -f1)${NC}"
    DOCKER_AVAILABLE=true
else
    echo -e "${YELLOW}ℹ Docker non détecté (optionnel pour backend)${NC}"
    DOCKER_AVAILABLE=false
fi

echo ""

# ============================================
# Installation
# ============================================

echo -e "${BLUE}📦 Installation des dépendances...${NC}"

# Frontend
echo "Installation frontend..."
npm install

# Backend
if [ -d "backend" ]; then
    echo "Installation backend..."
    cd backend
    npm install
    cd ..
fi

echo -e "${GREEN}✓ Dépendances installées${NC}"
echo ""

# ============================================
# Configuration
# ============================================

echo -e "${BLUE}⚙️  Configuration...${NC}"

# Frontend .env
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Fichier .env créé${NC}"
else
    echo -e "${YELLOW}ℹ Fichier .env existe déjà${NC}"
fi

# Backend .env
if [ -d "backend" ] && [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ Fichier backend/.env créé${NC}"
fi

echo ""

# ============================================
# Choix du mode
# ============================================

echo "Choisissez le mode de démarrage:"
echo "1) Frontend uniquement (données simulées)"
echo "2) Frontend + Backend (données réelles)"
echo "3) Backend uniquement (API)"
echo "4) Docker Compose (tout en container)"
echo ""

read -p "Votre choix (1-4): " choice

case $choice in
    1)
        echo -e "${BLUE}🚀 Démarrage frontend...${NC}"
        echo ""
        echo "Frontend: http://localhost:5173"
        echo ""
        echo -e "${YELLOW}Appuyez sur Ctrl+C pour arrêter${NC}"
        npm run dev
        ;;
        
    2)
        echo -e "${BLUE}🚀 Démarrage frontend + backend...${NC}"
        echo ""
        
        # Démarrer backend en arrière-plan
        cd backend
        npm start &
        BACKEND_PID=$!
        cd ..
        
        # Attendre que le backend démarre
        sleep 3
        
        echo "Backend:  http://localhost:3001"
        echo "Frontend: http://localhost:5173"
        echo ""
        echo -e "${YELLOW}Appuyez sur Ctrl+C pour arrêter${NC}"
        
        # Démarrer frontend
        npm run dev
        
        # Arrêter le backend quand on quitte
        kill $BACKEND_PID 2>/dev/null || true
        ;;
        
    3)
        echo -e "${BLUE}🚀 Démarrage backend...${NC}"
        echo ""
        echo "Backend: http://localhost:3001"
        echo ""
        echo -e "${YELLOW}Appuyez sur Ctrl+C pour arrêter${NC}"
        cd backend
        npm start
        ;;
        
    4)
        if [ "$DOCKER_AVAILABLE" = false ]; then
            echo -e "${RED}❌ Docker est requis pour ce mode${NC}"
            exit 1
        fi
        
        echo -e "${BLUE}🐳 Démarrage Docker Compose...${NC}"
        echo ""
        
        docker-compose up -d
        
        echo "Services démarrés:"
        echo "Frontend: http://localhost"
        echo "Backend:  http://localhost:3001"
        echo ""
        echo "Logs: docker-compose logs -f"
        echo "Stop: docker-compose down"
        ;;
        
    *)
        echo -e "${RED}❌ Choix invalide${NC}"
        exit 1
        ;;
esac
