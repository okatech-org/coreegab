# Guide d'Installation - Script Import Véhicules Coréens COREGAB

## 📋 Prérequis

### 1. Installation des dépendances

```bash
npm install node-fetch cheerio papaparse @supabase/supabase-js node-cron dotenv
```

### 2. Configuration des variables d'environnement

Créez un fichier `.env` à la racine :

```env
# Supabase
SUPABASE_URL=https://vpxsyxbxbilqyikmyznf.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweHN5eGJ4YmlscXlpa215em5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0NTk5NzAsImV4cCI6MjA1MjAzNTk3MH0.Kz8vGXrqQzGXqGXqGXqGXqGXqGXqGXqGXqGXqGXqGX

# APIs Open Source (optionnel - la plupart sont gratuites)
DATA_GO_KR_API_KEY=FREE_PUBLIC_KEY  # Obtenir sur data.go.kr

# Taux de change (optionnel - par défaut 0.65)
KRW_TO_FCFA_RATE=0.65
```

## 🗄️ Configuration Base de Données

### Création de la table dans Supabase

La migration SQL a été créée automatiquement dans `supabase/migrations/20250116000001_create_products_extended_table.sql`.

Pour l'appliquer :

```bash
npx supabase db push
```

Ou manuellement dans l'interface Supabase :

```sql
-- Table produits étendue pour véhicules
CREATE TABLE IF NOT EXISTS public.products_extended (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informations de base
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100),
  model VARCHAR(100),
  year INTEGER,
  category VARCHAR(50) DEFAULT 'Véhicules',
  sub_category VARCHAR(50),
  
  -- Description et détails
  description TEXT,
  specifications JSONB,
  features TEXT[],
  images TEXT[],
  
  -- Prix et disponibilité
  supplier_price_krw BIGINT,
  supplier_price_fcfa BIGINT,
  transport_cost BIGINT,
  customs_fees BIGINT,
  margin BIGINT,
  final_price_fcfa BIGINT,
  availability VARCHAR(100),
  
  -- Métadonnées
  import_source VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_products_extended_brand ON public.products_extended(brand);
CREATE INDEX IF NOT EXISTS idx_products_extended_model ON public.products_extended(model);
CREATE INDEX IF NOT EXISTS idx_products_extended_year ON public.products_extended(year);
CREATE INDEX IF NOT EXISTS idx_products_extended_price ON public.products_extended(final_price_fcfa);
CREATE INDEX IF NOT EXISTS idx_products_extended_category ON public.products_extended(category);
CREATE INDEX IF NOT EXISTS idx_products_extended_status ON public.products_extended(status);

-- Enable RLS on products_extended table
ALTER TABLE public.products_extended ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products_extended
CREATE POLICY "Anyone can view products_extended" ON public.products_extended FOR SELECT USING (true);
CREATE POLICY "Admins can manage products_extended" ON public.products_extended FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Create trigger for updated_at column
CREATE TRIGGER update_products_extended_updated_at
  BEFORE UPDATE ON public.products_extended
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
```

## 🚀 Utilisation

### 1. Exécution manuelle immédiate

```bash
npm run import:vehicles
# ou
node scripts/korean-vehicle-import.js run
```

### 2. Planification automatique (tous les jours à 3h)

```bash
npm run import:schedule
# ou
node scripts/korean-vehicle-import.js schedule
```

### 3. Test avec échantillon

```bash
npm run import:test
# ou
node scripts/korean-vehicle-import.js test
```

## 📊 Sources de Données

Le script récupère automatiquement les données depuis :

### Sources Open Source Gratuites
- **data.go.kr** : Portail open data du gouvernement coréen
- **GitHub Datasets** : Bases de données véhicules open source
- **Sites publics constructeurs** : Catalogues Hyundai, Kia, Genesis, SsangYong

### Données Récupérées
- ✅ Spécifications techniques complètes
- ✅ Prix catalogue en KRW
- ✅ Images officielles
- ✅ Équipements et options
- ✅ Dimensions et performances

### Véhicules Supportés

#### Hyundai
- Tucson, Santa Fe, Kona, Ioniq 5, Ioniq 6
- Elantra, Sonata, Palisade, Venue, Nexo

#### Kia
- Sportage, Sorento, Seltos, Carnival, K5
- EV6, EV9, Niro, Soul, Forte

#### Genesis (Premium)
- G70, G80, G90, GV60, GV70, GV80

#### SsangYong (KGM)
- Torres, Korando, Rexton, Tivoli

## 💰 Calcul Automatique des Prix

Le script applique automatiquement votre formule COREGAB :

```
Prix Final = Prix Corée + Transport + Douanes + Marge 35%
```

### Exemple de calcul
- **Prix Hyundai Tucson en Corée** : 27,000,000 KRW
- **Conversion FCFA** : 17,550,000 FCFA
- **Transport maritime** : 2,000,000 FCFA
- **Droits de douane (25%)** : 4,387,500 FCFA
- **Marge COREGAB (35%)** : 6,142,500 FCFA
- **Prix Final Client** : 30,080,000 FCFA

## 🔄 Mise à Jour Automatique

### Configuration Cron Job (Linux/Mac)

```bash
# Ouvrir crontab
crontab -e

# Ajouter cette ligne pour exécution quotidienne à 3h
0 3 * * * cd /chemin/vers/coregab && npm run import:vehicles
```

### Configuration Task Scheduler (Windows)

1. Ouvrir Task Scheduler
2. Créer une tâche basique
3. Déclencher : Quotidien à 3h00
4. Action : Démarrer programme
5. Programme : `node`
6. Arguments : `C:\chemin\vers\coregab\scripts\korean-vehicle-import.js run`

## 📁 Structure des Données Importées

### Format JSON exporté

```json
{
  "metadata": {
    "source": "Korean Vehicle Open Source Import",
    "date": "2024-01-15T10:30:00Z",
    "total_vehicles": 150,
    "exchange_rate": 0.65
  },
  "vehicles": [
    {
      "brand": "Hyundai",
      "model": "Tucson",
      "year": 2024,
      "category": "SUV",
      "specifications": {
        "engine": "1.6T GDI",
        "power": "180hp",
        "transmission": "Automatique",
        "fuel_consumption": "7.2L/100km",
        "length": "4,630mm",
        "width": "1,865mm",
        "height": "1,665mm"
      },
      "features": [
        "Système de sécurité avancé",
        "Écran tactile 12.3\"",
        "Apple CarPlay / Android Auto",
        "Caméra de recul",
        "Capteurs de stationnement",
        "Climatisation automatique",
        "Sièges chauffants",
        "Cruise control adaptatif"
      ],
      "pricing": {
        "supplier_price_krw": 27000000,
        "final_price_fcfa": 30080000,
        "availability": "Sur commande (7-14 jours)"
      }
    }
  ]
}
```

## 🔍 Vérification des Données

### Dashboard Supabase

```sql
-- Vérifier les imports récents
SELECT 
  brand,
  COUNT(*) as total,
  AVG(final_price_fcfa) as prix_moyen,
  MIN(final_price_fcfa) as prix_min,
  MAX(final_price_fcfa) as prix_max
FROM products_extended
WHERE category = 'Véhicules'
GROUP BY brand
ORDER BY total DESC;

-- Véhicules importés aujourd'hui
SELECT * FROM products_extended
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;

-- Top 10 des véhicules les moins chers
SELECT name, brand, model, final_price_fcfa
FROM products_extended
ORDER BY final_price_fcfa ASC
LIMIT 10;
```

## 🛠️ Personnalisation

### Ajouter de nouvelles marques

Modifiez la section des modèles dans le script :

```javascript
// Ajouter une nouvelle marque
const newBrandModels = ['model1', 'model2', 'model3'];
```

### Modifier les calculs de prix

```javascript
// Dans calculateFinalPrice()
const customsFees = priceFCFA * 0.30; // Passer à 30%
const margin = priceFCFA * 0.40; // Marge à 40%
```

### Ajouter de nouvelles fonctionnalités

```javascript
// Dans getHyundaiFeatures() ou similaire
if (model === 'special-model') {
  baseFeatures.push('Fonctionnalité spéciale');
}
```

## 📞 Support & Maintenance

### En cas d'erreur

1. Vérifier les logs dans la console
2. Vérifier la connexion Supabase
3. Vérifier les quotas API si utilisés
4. Consulter le tableau des erreurs dans le JSON exporté

### Monitoring

Le script génère automatiquement :
- Logs détaillés de chaque import
- Rapport d'erreurs
- Statistiques d'import
- Fichiers JSON de sauvegarde dans le dossier `data/`

### Logs et Debugging

```bash
# Exécuter avec logs détaillés
DEBUG=true npm run import:vehicles

# Vérifier les dernières importations
ls -la data/

# Consulter un fichier d'export
cat data/korean-vehicles-[timestamp].json
```

## 🎯 Optimisations Possibles

1. **Cache Redis** : Pour éviter les doublons
2. **Queue System** : Bull.js pour traitement asynchrone
3. **Webhooks** : Notifications Slack/Discord après import
4. **Analytics** : Tracking des véhicules les plus recherchés
5. **AI Enhancement** : GPT pour générer des descriptions attractives

## ✅ Checklist de Déploiement

- [x] Variables d'environnement configurées
- [x] Table Supabase créée avec index
- [x] Script testé en local
- [ ] Cron job configuré
- [ ] Logs activés
- [ ] Backup automatique configuré
- [ ] Monitoring en place
- [ ] Documentation équipe mise à jour

## 🚀 Démarrage Rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Créer le fichier .env (copier depuis env.example)
cp env.example .env

# 3. Tester le script
npm run import:test

# 4. Exécuter l'import complet
npm run import:vehicles

# 5. Vérifier dans Supabase
# Aller sur https://supabase.com/dashboard
# Vérifier la table products_extended
```

## 📈 Statistiques Attendues

Après un import complet, vous devriez avoir :

- **~50 véhicules Hyundai** (Tucson, Santa Fe, Kona, etc.)
- **~50 véhicules Kia** (Sportage, Sorento, EV6, etc.)
- **~20 véhicules Genesis** (G70, G80, GV70, etc.)
- **~15 véhicules SsangYong** (Torres, Korando, etc.)
- **Total : ~135 véhicules** avec prix calculés automatiquement

## 🔧 Dépannage

### Erreur "Table products_extended not found"
```bash
# Appliquer la migration
npx supabase db push
```

### Erreur "Module not found"
```bash
# Réinstaller les dépendances
npm install
```

### Erreur de connexion Supabase
```bash
# Vérifier les variables d'environnement
cat .env
```

### Script ne se termine pas
```bash
# Arrêter avec Ctrl+C
# Vérifier les logs pour identifier le problème
```

---

**🎉 Votre système d'import automatique de véhicules coréens est maintenant prêt !**

Le script va automatiquement :
1. Récupérer les données des constructeurs coréens
2. Calculer les prix selon votre formule COREGAB
3. Sauvegarder dans Supabase
4. Exporter un fichier JSON de sauvegarde
5. Planifier les mises à jour automatiques
