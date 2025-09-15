-- Migration pour créer une table unifiée de tous les produits COREEGAB
-- Cette table centralise véhicules, pièces, électronique et électroménager COREEGAB

-- 1. Supprimer les tables existantes si nécessaire (attention aux données !)
-- DROP TABLE IF EXISTS products_extended CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;

-- 2. Créer la table unifiée
CREATE TABLE IF NOT EXISTS products_unified (
  -- Identifiant unique
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Informations de base
  name VARCHAR(255) NOT NULL,
  name_kr VARCHAR(255), -- Nom en coréen
  description TEXT,
  description_kr TEXT, -- Description en coréenne
  
  -- Catégorisation
  product_type VARCHAR(50) NOT NULL CHECK (product_type IN ('vehicle', 'part', 'electronics', 'appliance', 'other')),
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  tags TEXT[], -- Tags pour recherche et filtrage
  
  -- === CHAMPS SPÉCIFIQUES VÉHICULES ===
  -- Informations véhicule
  brand VARCHAR(100), -- Hyundai, Kia, Genesis, etc.
  model VARCHAR(100), -- Tucson, Sportage, etc.
  year INTEGER,
  trim_level VARCHAR(100), -- Version/finition
  vehicle_type VARCHAR(50), -- SUV, Sedan, etc.
  
  -- Spécifications techniques véhicule
  engine_type VARCHAR(50), -- Essence, Diesel, Hybride, Électrique
  engine_size DECIMAL(3,1), -- en litres
  transmission VARCHAR(50), -- Manuelle, Automatique, DCT
  drivetrain VARCHAR(50), -- FWD, RWD, AWD
  fuel_economy JSONB, -- {city: 8.5, highway: 6.2, combined: 7.1}
  
  -- Dimensions et capacités
  dimensions JSONB, -- {length: 4500, width: 1850, height: 1650, wheelbase: 2680}
  weight INTEGER, -- en kg
  seating_capacity INTEGER,
  cargo_capacity INTEGER, -- en litres
  
  -- === CHAMPS SPÉCIFIQUES PIÈCES ===
  part_number VARCHAR(100), -- Référence constructeur
  oem_number VARCHAR(100), -- Référence OEM
  compatible_vehicles UUID[], -- IDs des véhicules compatibles
  compatible_models TEXT[], -- Liste des modèles compatibles (texte)
  part_category VARCHAR(100), -- Moteur, Transmission, Freinage, etc.
  is_genuine BOOLEAN DEFAULT false, -- Pièce d'origine ou aftermarket
  warranty_months INTEGER, -- Durée de garantie en mois
  
  -- === CHAMPS SPÉCIFIQUES ÉLECTRONIQUE/ÉLECTROMÉNAGER ===
  manufacturer VARCHAR(100), -- Samsung, LG, etc.
  model_number VARCHAR(100), -- Référence modèle
  power_consumption INTEGER, -- en watts
  energy_rating VARCHAR(10), -- A+++, A++, etc.
  warranty_years INTEGER, -- Durée de garantie en années
  
  -- === PRIX ET STOCK ===
  -- Prix en Won coréen (stocké en bigint pour éviter les problèmes de précision)
  price_krw BIGINT NOT NULL DEFAULT 0,
  price_original_krw BIGINT, -- Prix barré/original
  
  -- Prix en FCFA (calculé ou saisi)
  price_fcfa BIGINT,
  price_original_fcfa BIGINT,
  
  -- Coûts additionnels
  shipping_cost_krw BIGINT DEFAULT 0,
  customs_fee_percent DECIMAL(5,2) DEFAULT 0, -- Pourcentage des droits de douane
  handling_fee_fcfa BIGINT DEFAULT 0, -- Frais de traitement
  
  -- Stock
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  stock_location VARCHAR(100), -- Corée, Gabon, Transit
  lead_time_days INTEGER, -- Délai de livraison en jours
  
  -- === MÉDIAS ===
  images TEXT[], -- URLs des images
  thumbnail_url TEXT, -- Image principale/miniature
  videos TEXT[], -- URLs des vidéos
  documents JSONB, -- {manual: 'url', specs: 'url', warranty: 'url'}
  
  -- === CARACTÉRISTIQUES ET SPÉCIFICATIONS ===
  specifications JSONB, -- Spécifications détaillées en JSON
  features TEXT[], -- Liste des caractéristiques principales
  colors_available TEXT[], -- Couleurs disponibles
  
  -- === PROMOTION ET MARKETING ===
  is_featured BOOLEAN DEFAULT false, -- Produit mis en avant
  is_promotion BOOLEAN DEFAULT false, -- En promotion
  promotion_end_date TIMESTAMP,
  badge_text VARCHAR(50), -- "Nouveau", "Best-seller", etc.
  
  -- === DONNÉES DE PERFORMANCE ===
  view_count INTEGER DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1), -- Note moyenne sur 5
  review_count INTEGER DEFAULT 0,
  
  -- === MÉTADONNÉES ===
  import_date TIMESTAMP, -- Date d'importation depuis la Corée
  supplier_id UUID REFERENCES suppliers(id), -- Référence au fournisseur
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued', 'coming_soon')),
  
  -- SEO
  slug VARCHAR(255) UNIQUE, -- URL-friendly identifier
  meta_title VARCHAR(255),
  meta_description TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- 3. Créer les index pour optimiser les performances
CREATE INDEX idx_products_unified_type ON products_unified(product_type);
CREATE INDEX idx_products_unified_category ON products_unified(category);
CREATE INDEX idx_products_unified_subcategory ON products_unified(subcategory);
CREATE INDEX idx_products_unified_brand ON products_unified(brand);
CREATE INDEX idx_products_unified_model ON products_unified(model);
CREATE INDEX idx_products_unified_year ON products_unified(year);
CREATE INDEX idx_products_unified_status ON products_unified(status);
CREATE INDEX idx_products_unified_in_stock ON products_unified(in_stock);
CREATE INDEX idx_products_unified_is_featured ON products_unified(is_featured);
CREATE INDEX idx_products_unified_slug ON products_unified(slug);
CREATE INDEX idx_products_unified_compatible_vehicles ON products_unified USING GIN(compatible_vehicles);
CREATE INDEX idx_products_unified_tags ON products_unified USING GIN(tags);

-- Index de recherche full-text
CREATE INDEX idx_products_unified_search ON products_unified 
USING GIN(to_tsvector('french', 
  COALESCE(name, '') || ' ' || 
  COALESCE(description, '') || ' ' || 
  COALESCE(brand, '') || ' ' || 
  COALESCE(model, '') || ' ' ||
  COALESCE(category, '') || ' ' ||
  COALESCE(subcategory, '')
));

-- 4. Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Trigger pour updated_at
CREATE TRIGGER update_products_unified_updated_at 
BEFORE UPDATE ON products_unified
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Fonction RPC pour rechercher des produits
CREATE OR REPLACE FUNCTION search_products_unified(
  search_query TEXT DEFAULT NULL,
  filter_type VARCHAR DEFAULT NULL,
  filter_category VARCHAR DEFAULT NULL,
  filter_brand VARCHAR DEFAULT NULL,
  filter_in_stock BOOLEAN DEFAULT NULL,
  limit_count INTEGER DEFAULT 50,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  description TEXT,
  product_type VARCHAR,
  category VARCHAR,
  brand VARCHAR,
  model VARCHAR,
  price_fcfa BIGINT,
  price_krw BIGINT,
  in_stock BOOLEAN,
  thumbnail_url TEXT,
  rating DECIMAL,
  is_featured BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.product_type,
    p.category,
    p.brand,
    p.model,
    p.price_fcfa,
    p.price_krw,
    p.in_stock,
    p.thumbnail_url,
    p.rating,
    p.is_featured
  FROM products_unified p
  WHERE 
    (search_query IS NULL OR 
     to_tsvector('french', 
       COALESCE(p.name, '') || ' ' || 
       COALESCE(p.description, '') || ' ' || 
       COALESCE(p.brand, '') || ' ' || 
       COALESCE(p.model, '')
     ) @@ plainto_tsquery('french', search_query))
    AND (filter_type IS NULL OR p.product_type = filter_type)
    AND (filter_category IS NULL OR p.category = filter_category)
    AND (filter_brand IS NULL OR p.brand = filter_brand)
    AND (filter_in_stock IS NULL OR p.in_stock = filter_in_stock)
    AND p.status = 'active'
  ORDER BY 
    p.is_featured DESC,
    p.rating DESC NULLS LAST,
    p.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- 7. Fonction RPC pour obtenir les pièces compatibles avec un véhicule
CREATE OR REPLACE FUNCTION get_parts_for_vehicle(vehicle_id UUID)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  part_number VARCHAR,
  part_category VARCHAR,
  price_fcfa BIGINT,
  in_stock BOOLEAN,
  is_genuine BOOLEAN,
  thumbnail_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.part_number,
    p.part_category,
    p.price_fcfa,
    p.in_stock,
    p.is_genuine,
    p.thumbnail_url
  FROM products_unified p
  WHERE 
    p.product_type = 'part'
    AND vehicle_id = ANY(p.compatible_vehicles)
    AND p.status = 'active'
  ORDER BY 
    p.is_genuine DESC,
    p.part_category,
    p.name;
END;
$$ LANGUAGE plpgsql;

-- 8. Vue pour les statistiques produits
CREATE OR REPLACE VIEW product_statistics AS
SELECT 
  product_type,
  category,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE in_stock = true) as in_stock_count,
  AVG(price_fcfa) as avg_price_fcfa,
  AVG(rating) as avg_rating,
  SUM(view_count) as total_views,
  SUM(order_count) as total_orders
FROM products_unified
WHERE status = 'active'
GROUP BY product_type, category;

-- 9. Politique de sécurité Row Level Security (RLS)
ALTER TABLE products_unified ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour les produits actifs
CREATE POLICY "Public can view active products" ON products_unified
  FOR SELECT
  USING (status = 'active');

-- Gestion complète pour les admins
CREATE POLICY "Admins can manage all products" ON products_unified
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Les commerciaux peuvent voir tous les produits mais modifier seulement certains champs
CREATE POLICY "Commercials can view all products" ON products_unified
  FOR SELECT
  USING (auth.jwt() ->> 'role' IN ('commercial', 'admin'));

-- 10. Table des fournisseurs si elle n'existe pas
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  name_kr VARCHAR(255),
  country VARCHAR(100) DEFAULT 'South Korea',
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  address TEXT,
  website VARCHAR(255),
  rating DECIMAL(2,1),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Grant des permissions nécessaires
GRANT SELECT ON products_unified TO anon, authenticated;
GRANT ALL ON products_unified TO service_role;
GRANT SELECT ON product_statistics TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_products_unified TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_parts_for_vehicle TO anon, authenticated;
