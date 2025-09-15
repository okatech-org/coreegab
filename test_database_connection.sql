-- Script de test pour vérifier la connexion et les données
-- Exécutez ce script dans votre Supabase SQL Editor

-- 1. Vérifier si les tables existent
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('vehicles', 'parts', 'part_vehicle_fitment', 'products');

-- 2. Vérifier le contenu de la table products
SELECT COUNT(*) as product_count FROM public.products;

-- 3. Vérifier le contenu de la table vehicles
SELECT COUNT(*) as vehicle_count FROM public.vehicles;

-- 4. Vérifier le contenu de la table parts
SELECT COUNT(*) as parts_count FROM public.parts;

-- 5. Si les tables sont vides, ajouter des données de test
INSERT INTO public.products (name, category, price_krw, weight, image_url, description, in_stock) VALUES
('Samsung Galaxy S24 Ultra', 'electronics', 1500000, 0.233, '/samsung-galaxy-s24.jpg', 'Smartphone haut de gamme avec écran 6.8" Dynamic AMOLED 2X', true),
('Hyundai Tucson 2023', 'vehicles', 35000000, 1600, '/hyundai-tucson.jpg', 'SUV compact avec moteur hybride et transmission intégrale', true),
('LG Réfrigérateur InstaView', 'appliances', 2800000, 120, '/lg-refrigerator.jpg', 'Réfrigérateur américain 635L avec technologie InstaView Door-in-Door', true),
('MacBook Pro M3 14"', 'electronics', 2500000, 1.6, '/macbook-pro-m3.jpg', 'Ordinateur portable professionnel avec puce M3 et écran Liquid Retina XDR', true)
ON CONFLICT DO NOTHING;

-- 6. Ajouter des véhicules de test
INSERT INTO public.vehicles (make, model, year_start, year_end, engine) VALUES
('Hyundai', 'Tucson', 2019, 2021, '2.0L 4-Cyl'),
('Kia', 'Sportage', 2020, 2022, '2.4L 4-Cyl'),
('Hyundai', 'Elantra', 2020, 2023, '2.0L 4-Cyl'),
('Kia', 'Sorento', 2021, 2023, '2.5L 4-Cyl')
ON CONFLICT DO NOTHING;

-- 7. Ajouter des pièces de test
INSERT INTO public.parts (part_number, oem_number, name, brand, price_krw, image_url) VALUES
('28113-2E100', '28113-2E000', 'Filtre à air', 'Hyundai Genuine', 15000, '/placeholder-parts.svg'),
('26300-35505', '26300-35504', 'Filtre à huile', 'Kia Genuine', 8000, '/placeholder-parts.svg'),
('58101-D3A01', NULL, 'Plaquettes de frein avant', 'Hyundai Mobis', 45000, '/placeholder-parts.svg'),
('28113-2E200', '28113-2E100', 'Filtre à air Elantra', 'Hyundai Genuine', 18000, '/placeholder-parts.svg'),
('26300-35510', '26300-35505', 'Filtre à huile Sorento', 'Kia Genuine', 12000, '/placeholder-parts.svg')
ON CONFLICT (part_number) DO NOTHING;

-- 8. Lier les pièces aux véhicules
DO $$
DECLARE
    tucson_id uuid;
    sportage_id uuid;
    elantra_id uuid;
    sorento_id uuid;
    air_filter_id uuid;
    oil_filter_id uuid;
    brake_pads_id uuid;
    elantra_filter_id uuid;
    sorento_filter_id uuid;
BEGIN
    -- Récupérer les IDs des véhicules
    SELECT id INTO tucson_id FROM public.vehicles WHERE make = 'Hyundai' AND model = 'Tucson' LIMIT 1;
    SELECT id INTO sportage_id FROM public.vehicles WHERE make = 'Kia' AND model = 'Sportage' LIMIT 1;
    SELECT id INTO elantra_id FROM public.vehicles WHERE make = 'Hyundai' AND model = 'Elantra' LIMIT 1;
    SELECT id INTO sorento_id FROM public.vehicles WHERE make = 'Kia' AND model = 'Sorento' LIMIT 1;
    
    -- Récupérer les IDs des pièces
    SELECT id INTO air_filter_id FROM public.parts WHERE part_number = '28113-2E100' LIMIT 1;
    SELECT id INTO oil_filter_id FROM public.parts WHERE part_number = '26300-35505' LIMIT 1;
    SELECT id INTO brake_pads_id FROM public.parts WHERE part_number = '58101-D3A01' LIMIT 1;
    SELECT id INTO elantra_filter_id FROM public.parts WHERE part_number = '28113-2E200' LIMIT 1;
    SELECT id INTO sorento_filter_id FROM public.parts WHERE part_number = '26300-35510' LIMIT 1;
    
    -- Créer les relations
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES 
    (air_filter_id, tucson_id),
    (oil_filter_id, tucson_id),
    (oil_filter_id, sportage_id),
    (brake_pads_id, tucson_id),
    (elantra_filter_id, elantra_id),
    (sorento_filter_id, sorento_id)
    ON CONFLICT DO NOTHING;
END $$;

-- 9. Vérifier les résultats
SELECT 'Products:' as table_name, COUNT(*) as count FROM public.products
UNION ALL
SELECT 'Vehicles:', COUNT(*) FROM public.vehicles
UNION ALL
SELECT 'Parts:', COUNT(*) FROM public.parts
UNION ALL
SELECT 'Fitments:', COUNT(*) FROM public.part_vehicle_fitment;

-- 10. Tester la fonction RPC
SELECT * FROM get_parts_for_vehicle(
    (SELECT id FROM public.vehicles WHERE make = 'Hyundai' AND model = 'Tucson' LIMIT 1),
    NULL, 10, 0
);
