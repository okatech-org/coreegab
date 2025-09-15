#!/bin/bash

# Script de synchronisation avec GitHub
# COREEGAB - Architecture Unifiée v1.0.2

echo "🔄 Synchronisation avec GitHub..."
echo "Repository: https://github.com/okatech-org/coreegab.git"
echo ""

# Vérifier l'état Git
echo "📊 État actuel du repository :"
git status
echo ""

# Récupérer les changements distants
echo "⬇️ Récupération des changements distants..."
git fetch origin
echo ""

# Afficher les différences
echo "📋 Différences entre branches :"
git log --oneline --graph --all -10
echo ""

# Fusionner les changements
echo "🔀 Fusion des changements..."
git merge origin/main
echo ""

# Pousser les modifications
echo "⬆️ Poussée des modifications vers GitHub..."
git push origin main
echo ""

# Vérifier le statut final
echo "✅ Statut final :"
git status
echo ""

echo "🎉 Synchronisation terminée !"
echo "🚀 Déploiement automatique sur Lovable déclenché"
echo "📱 URL: https://coreegab.lovable.app/"
