#!/bin/bash

# Script de déploiement en production
# Déploie vers Netlify et configure les domaines

set -e

echo "🚀 Déploiement COREEGAB en production..."

# Vérifier les variables d'environnement nécessaires
if [ -z "$NETLIFY_AUTH_TOKEN" ]; then
    echo "❌ NETLIFY_AUTH_TOKEN n'est pas défini"
    exit 1
fi

if [ -z "$NETLIFY_SITE_ID" ]; then
    echo "❌ NETLIFY_SITE_ID n'est pas défini"
    exit 1
fi

# Vérifier que nous sommes sur la branche main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Vous n'êtes pas sur la branche main. Basculement vers main..."
    git checkout main
fi

# Récupérer les dernières modifications
echo "📥 Récupération des dernières modifications..."
git fetch origin
git pull origin main

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm ci

# Exécuter les tests
echo "🧪 Exécution des tests..."
npm run test

# Build de production
echo "🔨 Build de production..."
npm run build

# Vérifier que le build a réussi
if [ ! -d "dist" ]; then
    echo "❌ Le dossier dist n'existe pas. Le build a échoué."
    exit 1
fi

# Déploiement vers Netlify
echo "🌐 Déploiement vers Netlify..."
npx netlify deploy --prod --dir=dist --site=$NETLIFY_SITE_ID

# Vérifier le statut du déploiement
if [ $? -eq 0 ]; then
    echo "✅ Déploiement réussi!"
    echo "🔗 Votre site est maintenant en ligne sur:"
    echo "   - https://coreegab.com"
    echo "   - https://coreegab.netlify.app"
else
    echo "❌ Échec du déploiement"
    exit 1
fi

echo "🎉 Déploiement terminé avec succès!"
