-- Script simple pour créer la table products_extended
-- À exécuter directement dans l'interface Supabase SQL Editor

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
