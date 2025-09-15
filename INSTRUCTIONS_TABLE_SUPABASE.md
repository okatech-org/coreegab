# Instructions pour créer la table products_extended dans Supabase

## 📋 Étapes à suivre

### 1. Accéder à l'interface Supabase

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet COREGAB

### 2. Ouvrir l'éditeur SQL

1. Dans le menu de gauche, cliquez sur **"SQL Editor"**
2. Cliquez sur **"New query"**

### 3. Exécuter le script SQL

Copiez et collez le contenu du fichier `create-products-extended.sql` dans l'éditeur :

```sql
-- Créer la fonction update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Table produits étendue pour véhicules coréens
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

-- RLS Policies for products_extended (mode démo - accès libre)
CREATE POLICY "Anyone can view products_extended" ON public.products_extended FOR SELECT USING (true);
CREATE POLICY "Anyone can insert products_extended" ON public.products_extended FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update products_extended" ON public.products_extended FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete products_extended" ON public.products_extended FOR DELETE USING (true);

-- Create trigger for updated_at column
CREATE TRIGGER update_products_extended_updated_at
  BEFORE UPDATE ON public.products_extended
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
```

### 4. Exécuter le script

1. Cliquez sur **"Run"** ou appuyez sur **Ctrl+Enter**
2. Vérifiez qu'il n'y a pas d'erreurs dans les résultats

### 5. Vérifier la création

1. Dans le menu de gauche, cliquez sur **"Table Editor"**
2. Vous devriez voir la table **"products_extended"** dans la liste
3. Cliquez dessus pour voir sa structure

### 6. Tester l'import de véhicules

Une fois la table créée, vous pouvez tester l'import :

```bash
# Dans votre terminal
npm run import:vehicles
```

### 7. Vérifier les données

1. Retournez dans **"Table Editor"**
2. Cliquez sur la table **"products_extended"**
3. Vous devriez voir les véhicules importés

## 🔧 Résolution de problèmes

### Erreur "relation does not exist"
- Vérifiez que vous êtes connecté au bon projet Supabase
- Assurez-vous que le script a été exécuté complètement

### Erreur "permission denied"
- Vérifiez que vous avez les droits d'administration sur le projet
- Contactez l'administrateur du projet si nécessaire

### Table vide après import
- Vérifiez que les clés API Supabase sont correctes dans votre `.env`
- Vérifiez les logs de l'import pour identifier les erreurs

## ✅ Vérification finale

Après avoir suivi ces étapes :

1. ✅ Table `products_extended` créée
2. ✅ Index et politiques configurés
3. ✅ Import de véhicules fonctionnel
4. ✅ Véhicules visibles dans la boutique

Vos véhicules coréens devraient maintenant s'afficher dans la boutique ! 🚗✨
