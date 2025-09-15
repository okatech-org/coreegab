# Guide d'Utilisation - COREEGAB

## 🚀 Démarrage Rapide

### 1. Initialisation de la Base de Données

Pour que la boutique fonctionne correctement avec toutes les pièces automobiles, vous devez exécuter le script SQL de configuration :

1. **Connectez-vous à votre dashboard Supabase** : https://supabase.com/dashboard
2. **Allez dans l'éditeur SQL** de votre projet
3. **Copiez et exécutez le contenu du fichier** `complete_database_setup.sql`

Ce script va :
- ✅ Créer toutes les tables nécessaires (`vehicles`, `parts`, `part_vehicle_fitment`)
- ✅ Ajouter la fonction RPC `get_parts_for_vehicle`
- ✅ Insérer 10 véhicules Hyundai et Kia
- ✅ Insérer 20+ pièces automobiles avec leurs relations de compatibilité
- ✅ Ajouter des produits génériques pour la boutique

### 2. Vérification du Fonctionnement

Après avoir exécuté le script SQL :

1. **Rechargez votre application** (http://localhost:8080)
2. **Allez dans la section Boutique**
3. **Utilisez le sélecteur de véhicule** pour choisir :
   - Marque : Hyundai ou Kia
   - Modèle : Tucson, Elantra, Sonata, Sportage, etc.
   - Année : 2019-2024
4. **Cliquez sur "Chercher les pièces"**

Vous devriez voir apparaître les pièces compatibles avec le véhicule sélectionné.

## 🔧 Fonctionnalités Disponibles

### Sélecteur de Véhicule
- **Filtrage en cascade** : Marque → Modèle → Année
- **Données réelles** : Véhicules Hyundai et Kia 2019-2024
- **Recherche de pièces** : Trouve automatiquement les pièces compatibles

### Catalogue de Pièces
- **20+ pièces disponibles** : Filtres, freinage, éclairage, moteur, etc.
- **Informations détaillées** : Références, marques, prix, spécifications
- **Compatibilité véhicule** : Chaque pièce est liée aux véhicules compatibles

### Import de Données Open Source
- **Pièces étendues** : Plus de 30 pièces automobiles
- **Catégories multiples** : Filtres, Freinage, Allumage, Distribution, etc.
- **Marques variées** : Hyundai Genuine, Kia Genuine, NGK, Denso, etc.

## 📊 Données Disponibles

### Véhicules (10 modèles)
- **Hyundai** : Tucson 2019-2021, Tucson 2022-2024, Elantra 2020-2023, Sonata 2020-2024, Santa Fe 2019-2023
- **Kia** : Sportage 2020-2022, Sportage 2023-2024, Sorento 2020-2023, Forte 2019-2023, Telluride 2020-2024

### Pièces (20+ références)
- **Filtres** : Filtre à air, filtre à huile, filtre habitacle
- **Freinage** : Plaquettes avant/arrière, disques de frein
- **Allumage** : Bougies d'allumage iridium
- **Distribution** : Courroie de distribution
- **Refroidissement** : Pompe à eau
- **Électrique** : Alternateur, démarreur, batterie
- **Éclairage** : Phares LED, feux arrière
- **Suspension** : Amortisseurs, ressorts
- **Transmission** : Kit embrayage
- **Climatisation** : Filtre habitacle
- **Lubrifiants** : Huile moteur, liquide de refroidissement

## 🛠️ Dépannage

### Problème : "Aucune pièce trouvée"
**Solution** : Vérifiez que le script SQL a été exécuté correctement

### Problème : "Erreur de chargement des véhicules"
**Solution** : Vérifiez la connexion à Supabase et que les tables existent

### Problème : "Maximum update depth exceeded"
**Solution** : Rechargez la page, le problème a été corrigé

### Problème : Images des pièces non affichées
**Solution** : Les images utilisent un placeholder `/placeholder-parts.svg`

## 🔄 Mise à Jour des Données

### Ajouter de Nouveaux Véhicules
```sql
INSERT INTO public.vehicles (make, model, year_start, year_end, engine) 
VALUES ('Hyundai', 'Ioniq 5', 2021, 2024, 'Électrique');
```

### Ajouter de Nouvelles Pièces
```sql
INSERT INTO public.parts (part_number, name, brand, price_krw, image_url) 
VALUES ('NEW-PART-001', 'Nouvelle pièce', 'Marque', 25000, '/placeholder-parts.svg');
```

### Lier une Pièce à un Véhicule
```sql
INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) 
VALUES ('part-uuid', 'vehicle-uuid');
```

## 📈 Prochaines Étapes

1. **Images réelles** : Remplacer les placeholders par de vraies photos
2. **Prix dynamiques** : Intégrer des APIs de prix en temps réel
3. **Stock en temps réel** : Connecter à un système de gestion de stock
4. **Recherche avancée** : Ajouter des filtres par prix, marque, etc.
5. **API externe** : Intégrer des catalogues officiels Hyundai/Kia

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur pour les erreurs
2. Vérifiez que Supabase est accessible
3. Vérifiez que le script SQL a été exécuté
4. Rechargez l'application

---

**Note** : Ce système utilise des données de démonstration. Pour un usage en production, il faudra intégrer des sources de données officielles et mettre en place une gestion de stock réelle.
