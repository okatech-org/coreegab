#!/bin/bash

echo "🔄 Synchronisation avec Lovable..."
echo "Repository: https://github.com/okatech-org/coreegab.git"
echo "Target: https://coreegab.lovable.app/"
echo ""

# Vérifier l'état
echo "📊 État actuel :"
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

# Force push (ATTENTION : écrasera les commits distants)
echo "⬆️ Force push vers GitHub..."
echo "⚠️  ATTENTION : Cela écrasera les commits distants"
read -p "Continuer ? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push origin main --force
    echo ""
    echo "✅ Synchronisation terminée !"
    echo "🚀 Lovable détectera automatiquement les changements"
    echo "📱 Vérifiez https://coreegab.lovable.app/ dans 2-5 minutes"
else
    echo "❌ Synchronisation annulée"
fi
