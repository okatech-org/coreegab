#!/bin/bash

# Script de synchronisation vers Lovable
# Ce script s'assure que les changements sont correctement synchronisés avec Lovable via GitHub

set -e

echo "🚀 Synchronisation COREEGAB vers Lovable..."

# Vérifier que nous sommes sur la bonne branche
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Vous n'êtes pas sur la branche main. Basculement vers main..."
    git checkout main
fi

# Récupérer les dernières modifications
echo "📥 Récupération des dernières modifications..."
git fetch origin

# Vérifier s'il y a des changements locaux non commitées
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Changements non commitées détectés:"
    git status --short
    echo ""
    read -p "Voulez-vous les commiter automatiquement? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "sync: automatic commit before lovable sync"
        echo "✅ Changements commitées automatiquement"
    else
        echo "Veuillez commiter ou stash vos changements avant de continuer."
        exit 1
    fi
fi

# Synchroniser avec le remote
echo "🔄 Synchronisation avec origin/main..."
git pull origin main

# Vérifier que le build fonctionne
echo "🔨 Test du build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build réussi!"
    rm -rf dist
else
    echo "❌ Échec du build. Vérifiez les erreurs avant de continuer."
    exit 1
fi

# Push vers GitHub (ce qui déclenchera la sync Lovable)
echo "📤 Push vers GitHub..."
git push origin main

echo "✅ Synchronisation terminée!"
echo "🌐 Lovable devrait se synchroniser automatiquement dans les prochaines minutes."
echo "🔗 Vérifiez votre projet Lovable pour confirmer la synchronisation."
echo ""
echo "📊 Statut de la synchronisation:"
echo "   - GitHub: ✅ Synchronisé"
echo "   - Lovable: 🔄 En cours (2-5 minutes)"
echo "   - Production: ⏳ Déclenché par GitHub Actions"
