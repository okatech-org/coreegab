#!/bin/bash

# Script pour configurer la base de données COREGAB
# Ce script exécute le script SQL de configuration dans Supabase

echo "🚀 Configuration de la base de données COREGAB..."
echo ""

# Vérifier si le fichier SQL existe
if [ ! -f "complete_database_setup.sql" ]; then
    echo "❌ Erreur: Le fichier complete_database_setup.sql n'existe pas"
    echo "Assurez-vous d'être dans le bon répertoire"
    exit 1
fi

echo "📋 Instructions pour configurer la base de données:"
echo ""
echo "1. Ouvrez votre dashboard Supabase: https://supabase.com/dashboard"
echo "2. Sélectionnez votre projet COREGAB"
echo "3. Allez dans l'éditeur SQL (SQL Editor)"
echo "4. Copiez le contenu du fichier complete_database_setup.sql"
echo "5. Collez-le dans l'éditeur SQL"
echo "6. Cliquez sur 'Run' pour exécuter le script"
echo ""
echo "📄 Contenu du script SQL:"
echo "=================================="
cat complete_database_setup.sql
echo "=================================="
echo ""
echo "✅ Après avoir exécuté le script SQL:"
echo "   - Rechargez votre application (http://localhost:8080)"
echo "   - Allez dans la section Boutique"
echo "   - Testez le sélecteur de véhicule"
echo ""
echo "🔧 Si vous rencontrez des problèmes:"
echo "   - Vérifiez que Supabase est accessible"
echo "   - Vérifiez que le script s'est exécuté sans erreur"
echo "   - Consultez le guide GUIDE_UTILISATION.md"
echo ""
echo "🎯 Résultat attendu:"
echo "   - 10 véhicules Hyundai et Kia"
echo "   - 20+ pièces automobiles"
echo "   - 50+ relations de compatibilité"
echo "   - Plus d'erreurs dans la console"
