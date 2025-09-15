-- Script pour importer toutes les pièces open source dans la base de données
-- Exécutez ce script dans votre Supabase SQL Editor

-- 1. Vider les tables existantes (optionnel)
-- DELETE FROM public.part_vehicle_fitment;
-- DELETE FROM public.parts;
-- DELETE FROM public.vehicles;

-- 2. Insérer tous les véhicules Hyundai et Kia
INSERT INTO public.vehicles (make, model, year_start, year_end, engine) VALUES
-- Hyundai
('Hyundai', 'Tucson', 2019, 2021, '2.0L 4-Cyl'),
('Hyundai', 'Tucson', 2022, 2024, '2.5L 4-Cyl'),
('Hyundai', 'Elantra', 2020, 2023, '2.0L 4-Cyl'),
('Hyundai', 'Sonata', 2020, 2023, '2.5L 4-Cyl'),
('Hyundai', 'Santa Fe', 2019, 2023, '2.4L 4-Cyl'),
('Hyundai', 'Kona', 2020, 2023, '2.0L 4-Cyl'),
('Hyundai', 'Palisade', 2020, 2023, '3.8L V6'),

-- Kia
('Kia', 'Sportage', 2020, 2022, '2.4L 4-Cyl'),
('Kia', 'Sportage', 2023, 2024, '2.5L 4-Cyl'),
('Kia', 'Sorento', 2021, 2023, '2.5L 4-Cyl'),
('Kia', 'Forte', 2020, 2023, '2.0L 4-Cyl'),
('Kia', 'Telluride', 2020, 2023, '3.8L V6'),
('Kia', 'Seltos', 2020, 2023, '2.0L 4-Cyl'),
('Kia', 'Carnival', 2021, 2023, '3.5L V6')
ON CONFLICT DO NOTHING;

-- 3. Insérer toutes les pièces open source
DO $$
DECLARE
    -- Variables pour stocker les IDs
    air_filter_id uuid;
    oil_filter_id uuid;
    cabin_filter_id uuid;
    brake_pads_front_id uuid;
    brake_pads_rear_id uuid;
    brake_discs_id uuid;
    headlight_bulb_id uuid;
    fog_light_bulb_id uuid;
    spark_plug_id uuid;
    timing_belt_id uuid;
    shock_absorber_id uuid;
    spring_id uuid;
    
    -- Variables pour les véhicules
    tucson_2019_id uuid;
    tucson_2022_id uuid;
    elantra_id uuid;
    sonata_id uuid;
    santa_fe_id uuid;
    kona_id uuid;
    palisade_id uuid;
    sportage_2020_id uuid;
    sportage_2023_id uuid;
    sorento_id uuid;
    forte_id uuid;
    telluride_id uuid;
    seltos_id uuid;
    carnival_id uuid;
BEGIN
    -- Récupérer les IDs des véhicules
    SELECT id INTO tucson_2019_id FROM public.vehicles WHERE make = 'Hyundai' AND model = 'Tucson' AND year_start = 2019 LIMIT 1;
    SELECT id INTO tucson_2022_id FROM public.vehicles WHERE make = 'Hyundai' AND model = 'Tucson' AND year_start = 2022 LIMIT 1;
    SELECT id INTO elantra_id FROM public.vehicles WHERE make = 'Hyundai' AND model = 'Elantra' LIMIT 1;
    SELECT id INTO sonata_id FROM public.vehicles WHERE make = 'Hyundai' AND model = 'Sonata' LIMIT 1;
    SELECT id INTO santa_fe_id FROM public.vehicles WHERE make = 'Hyundai' AND model = 'Santa Fe' LIMIT 1;
    SELECT id INTO kona_id FROM public.vehicles WHERE make = 'Hyundai' AND model = 'Kona' LIMIT 1;
    SELECT id INTO palisade_id FROM public.vehicles WHERE make = 'Hyundai' AND model = 'Palisade' LIMIT 1;
    SELECT id INTO sportage_2020_id FROM public.vehicles WHERE make = 'Kia' AND model = 'Sportage' AND year_start = 2020 LIMIT 1;
    SELECT id INTO sportage_2023_id FROM public.vehicles WHERE make = 'Kia' AND model = 'Sportage' AND year_start = 2023 LIMIT 1;
    SELECT id INTO sorento_id FROM public.vehicles WHERE make = 'Kia' AND model = 'Sorento' LIMIT 1;
    SELECT id INTO forte_id FROM public.vehicles WHERE make = 'Kia' AND model = 'Forte' LIMIT 1;
    SELECT id INTO telluride_id FROM public.vehicles WHERE make = 'Kia' AND model = 'Telluride' LIMIT 1;
    SELECT id INTO seltos_id FROM public.vehicles WHERE make = 'Kia' AND model = 'Seltos' LIMIT 1;
    SELECT id INTO carnival_id FROM public.vehicles WHERE make = 'Kia' AND model = 'Carnival' LIMIT 1;

    -- Insérer les pièces
    INSERT INTO public.parts (part_number, oem_number, name, brand, price_krw, image_url) VALUES
    ('28113-2E100', '28113-2E000', 'Filtre à air moteur', 'Hyundai Genuine', 15000, '/placeholder-parts.svg'),
    ('26300-35505', '26300-35504', 'Filtre à huile moteur', 'Kia Genuine', 8000, '/placeholder-parts.svg'),
    ('28113-2E200', NULL, 'Filtre à air habitacle', 'Hyundai Genuine', 12000, '/placeholder-parts.svg'),
    ('58101-D3A01', NULL, 'Plaquettes de frein avant', 'Hyundai Mobis', 45000, '/placeholder-parts.svg'),
    ('58101-D3A02', NULL, 'Plaquettes de frein arrière', 'Hyundai Mobis', 35000, '/placeholder-parts.svg'),
    ('58101-D3A03', NULL, 'Disques de frein avant', 'Hyundai Mobis', 85000, '/placeholder-parts.svg'),
    ('92132-2E000', NULL, 'Ampoule phare principal', 'Hyundai Genuine', 25000, '/placeholder-parts.svg'),
    ('92132-2E001', NULL, 'Ampoule antibrouillard', 'Hyundai Genuine', 15000, '/placeholder-parts.svg'),
    ('28113-2E300', NULL, 'Bougie d''allumage', 'Hyundai Genuine', 12000, '/placeholder-parts.svg'),
    ('28113-2E301', NULL, 'Courroie de distribution', 'Hyundai Genuine', 35000, '/placeholder-parts.svg'),
    ('52910-2E000', NULL, 'Amortisseur avant', 'Hyundai Genuine', 95000, '/placeholder-parts.svg'),
    ('52910-2E001', NULL, 'Ressort de suspension', 'Hyundai Genuine', 45000, '/placeholder-parts.svg')
    RETURNING id INTO air_filter_id, oil_filter_id, cabin_filter_id, brake_pads_front_id, brake_pads_rear_id, brake_discs_id, headlight_bulb_id, fog_light_bulb_id, spark_plug_id, timing_belt_id, shock_absorber_id, spring_id;

    -- Créer les relations de compatibilité
    -- Filtre à air - compatible avec la plupart des véhicules
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES
    (air_filter_id, tucson_2019_id),
    (air_filter_id, elantra_id),
    (air_filter_id, sonata_id),
    (air_filter_id, kona_id),
    (air_filter_id, sportage_2020_id),
    (air_filter_id, forte_id),
    (air_filter_id, seltos_id);

    -- Filtre à huile - compatible avec tous les véhicules
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES
    (oil_filter_id, tucson_2019_id),
    (oil_filter_id, tucson_2022_id),
    (oil_filter_id, elantra_id),
    (oil_filter_id, sonata_id),
    (oil_filter_id, santa_fe_id),
    (oil_filter_id, kona_id),
    (oil_filter_id, palisade_id),
    (oil_filter_id, sportage_2020_id),
    (oil_filter_id, sportage_2023_id),
    (oil_filter_id, sorento_id),
    (oil_filter_id, forte_id),
    (oil_filter_id, telluride_id),
    (oil_filter_id, seltos_id),
    (oil_filter_id, carnival_id);

    -- Filtre habitacle - compatible avec les véhicules récents
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES
    (cabin_filter_id, tucson_2022_id),
    (cabin_filter_id, elantra_id),
    (cabin_filter_id, sonata_id),
    (cabin_filter_id, kona_id),
    (cabin_filter_id, sportage_2023_id),
    (cabin_filter_id, sorento_id),
    (cabin_filter_id, forte_id),
    (cabin_filter_id, seltos_id);

    -- Plaquettes de frein avant - véhicules compacts
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES
    (brake_pads_front_id, tucson_2019_id),
    (brake_pads_front_id, elantra_id),
    (brake_pads_front_id, kona_id),
    (brake_pads_front_id, sportage_2020_id),
    (brake_pads_front_id, forte_id),
    (brake_pads_front_id, seltos_id);

    -- Plaquettes de frein arrière - véhicules compacts
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES
    (brake_pads_rear_id, tucson_2019_id),
    (brake_pads_rear_id, elantra_id),
    (brake_pads_rear_id, kona_id),
    (brake_pads_rear_id, sportage_2020_id),
    (brake_pads_rear_id, forte_id),
    (brake_pads_rear_id, seltos_id);

    -- Disques de frein - Tucson uniquement
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES
    (brake_discs_id, tucson_2019_id);

    -- Ampoules phare - tous les véhicules
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES
    (headlight_bulb_id, tucson_2019_id),
    (headlight_bulb_id, tucson_2022_id),
    (headlight_bulb_id, elantra_id),
    (headlight_bulb_id, sonata_id),
    (headlight_bulb_id, santa_fe_id),
    (headlight_bulb_id, kona_id),
    (headlight_bulb_id, palisade_id),
    (headlight_bulb_id, sportage_2020_id),
    (headlight_bulb_id, sportage_2023_id),
    (headlight_bulb_id, sorento_id),
    (headlight_bulb_id, forte_id),
    (headlight_bulb_id, telluride_id),
    (headlight_bulb_id, seltos_id),
    (headlight_bulb_id, carnival_id);

    -- Ampoules antibrouillard - SUV uniquement
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES
    (fog_light_bulb_id, tucson_2019_id),
    (fog_light_bulb_id, tucson_2022_id),
    (fog_light_bulb_id, santa_fe_id),
    (fog_light_bulb_id, palisade_id),
    (fog_light_bulb_id, sportage_2020_id),
    (fog_light_bulb_id, sportage_2023_id),
    (fog_light_bulb_id, sorento_id),
    (fog_light_bulb_id, telluride_id);

    -- Bougies d'allumage - moteurs essence
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES
    (spark_plug_id, tucson_2019_id),
    (spark_plug_id, elantra_id),
    (spark_plug_id, sonata_id),
    (spark_plug_id, kona_id),
    (spark_plug_id, sportage_2020_id),
    (spark_plug_id, forte_id),
    (spark_plug_id, seltos_id);

    -- Courroie de distribution - Elantra uniquement
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES
    (timing_belt_id, elantra_id);

    -- Amortisseur avant - Tucson uniquement
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES
    (shock_absorber_id, tucson_2019_id);

    -- Ressort de suspension - Tucson uniquement
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES
    (spring_id, tucson_2019_id);

END $$;

-- 4. Vérifier les résultats
SELECT 
    'Véhicules' as table_name, 
    COUNT(*) as count 
FROM public.vehicles
UNION ALL
SELECT 
    'Pièces' as table_name, 
    COUNT(*) as count 
FROM public.parts
UNION ALL
SELECT 
    'Compatibilités' as table_name, 
    COUNT(*) as count 
FROM public.part_vehicle_fitment;

-- 5. Afficher un échantillon des données
SELECT 
    p.name as part_name,
    p.part_number,
    p.brand,
    p.price_krw,
    COUNT(pvf.vehicle_id) as compatible_vehicles
FROM public.parts p
LEFT JOIN public.part_vehicle_fitment pvf ON p.id = pvf.part_id
GROUP BY p.id, p.name, p.part_number, p.brand, p.price_krw
ORDER BY p.name;

SELECT 'Import terminé avec succès!' as message;
