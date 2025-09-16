#!/bin/bash

# Script de configuration du workflow Cursor → GitHub → Lovable → Production
# Ce script configure l'environnement de développement complet

set -e

echo "🚀 Configuration du workflow COREEGAB..."

# Vérifier que Git est configuré
if ! git config user.name > /dev/null 2>&1; then
    echo "⚠️  Git n'est pas configuré. Veuillez configurer Git :"
    echo "   git config --global user.name 'Votre Nom'"
    echo "   git config --global user.email 'votre.email@example.com'"
    exit 1
fi

# Vérifier la connexion au repository
echo "🔗 Vérification de la connexion GitHub..."
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "📡 Configuration du remote origin..."
    git remote add origin https://github.com/okatech-org/coreegab.git
fi

# Vérifier la branche main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🌿 Basculement vers la branche main..."
    git checkout main 2>/dev/null || git checkout -b main
fi

# Configuration de la branche upstream
echo "⬆️  Configuration de la branche upstream..."
git branch --set-upstream-to=origin/main main 2>/dev/null || true

# Récupération des dernières modifications
echo "📥 Récupération des dernières modifications..."
git fetch origin
git pull origin main

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm install

# Vérification des variables d'environnement
echo "🔍 Vérification de la configuration..."
if npm run check:env; then
    echo "✅ Configuration validée!"
else
    echo "⚠️  Configuration incomplète. Créez un fichier .env.local avec les variables requises."
    echo "📖 Consultez WORKFLOW_GUIDE.md pour plus d'informations."
fi

# Test du build
echo "🔨 Test du build..."
if npm run build; then
    echo "✅ Build réussi!"
    rm -rf dist
else
    echo "❌ Échec du build. Vérifiez les erreurs ci-dessus."
    exit 1
fi

# Création des branches de développement
echo "🌿 Configuration des branches de développement..."
if ! git show-ref --verify --quiet refs/heads/develop; then
    git checkout -b develop
    git push -u origin develop
    echo "✅ Branche develop créée"
fi

git checkout main

echo ""
echo "🎉 Configuration terminée avec succès!"
echo ""
echo "📋 Prochaines étapes :"
echo "   1. Configurez vos variables d'environnement dans .env.local"
echo "   2. Lancez le développement avec: npm run dev"
echo "   3. Consultez WORKFLOW_GUIDE.md pour le workflow complet"
echo ""
echo "🔗 URLs importantes :"
echo "   - GitHub: https://github.com/okatech-org/coreegab.git"
echo "   - Lovable: [Votre projet Lovable]"
echo "   - Production: https://coreegab.com"
echo "   - Supabase: https://vpxsyxbxbilqyikmyznf.supabase.co"
echo ""
echo "✨ Bon développement!"
