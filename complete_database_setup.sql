-- Script SQL complet pour initialiser la base de données COREGAB
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Création de la table des véhicules
CREATE TABLE IF NOT EXISTS "public"."vehicles" (
    "id" uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "make" text NOT NULL,
    "model" text NOT NULL,
    "year_start" integer NOT NULL,
    "year_end" integer,
    "engine" text,
    "trim" text
);

-- 2. Création de la table des pièces automobiles
CREATE TABLE IF NOT EXISTS "public"."parts" (
    "id" uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "part_number" text NOT NULL,
    "oem_number" text,
    "name" text NOT NULL,
    "description" text,
    "brand" text,
    "price_krw" numeric,
    "stock_quantity" integer DEFAULT 0,
    "image_url" text
);

-- 3. Création de la table de compatibilité (Fitment)
CREATE TABLE IF NOT EXISTS "public"."part_vehicle_fitment" (
    "id" uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "part_id" uuid NOT NULL,
    "vehicle_id" uuid NOT NULL,
    "notes" text
);

-- 4. Ajout des contraintes et index
ALTER TABLE ONLY "public"."vehicles" ADD CONSTRAINT "vehicles_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."parts" ADD CONSTRAINT "parts_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."parts" ADD CONSTRAINT "parts_part_number_unique" UNIQUE (part_number);
ALTER TABLE ONLY "public"."part_vehicle_fitment" ADD CONSTRAINT "part_vehicle_fitment_pkey" PRIMARY KEY (id);

-- Clés étrangères
ALTER TABLE ONLY "public"."part_vehicle_fitment" 
ADD CONSTRAINT "part_vehicle_fitment_part_id_fkey" 
FOREIGN KEY (part_id) REFERENCES public.parts(id) ON DELETE CASCADE;

ALTER TABLE ONLY "public"."part_vehicle_fitment" 
ADD CONSTRAINT "part_vehicle_fitment_vehicle_id_fkey" 
FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;

-- Contrainte d'unicité
ALTER TABLE ONLY "public"."part_vehicle_fitment" 
ADD CONSTRAINT "part_vehicle_fitment_unique_part_vehicle" 
UNIQUE (part_id, vehicle_id);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS "idx_vehicles_make_model_year" ON "public"."vehicles" USING btree (make, model, year_start, year_end);
CREATE INDEX IF NOT EXISTS "idx_fitment_vehicle_id" ON "public"."part_vehicle_fitment" USING btree (vehicle_id);
CREATE INDEX IF NOT EXISTS "idx_fitment_part_id" ON "public"."part_vehicle_fitment" USING btree (part_id);

-- 5. Fonction RPC pour récupérer les pièces par véhicule
CREATE OR REPLACE FUNCTION get_parts_for_vehicle(
    p_vehicle_id uuid,
    p_search text DEFAULT NULL,
    p_limit integer DEFAULT 12,
    p_offset integer DEFAULT 0
)
RETURNS TABLE (
    id uuid,
    created_at timestamp with time zone,
    part_number text,
    oem_number text,
    name text,
    description text,
    brand text,
    price_krw numeric,
    stock_quantity integer,
    image_url text
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.created_at,
        p.part_number,
        p.oem_number,
        p.name,
        p.description,
        p.brand,
        p.price_krw,
        p.stock_quantity,
        p.image_url
    FROM
        public.parts p
    JOIN
        public.part_vehicle_fitment pvf ON p.id = pvf.part_id
    WHERE
        pvf.vehicle_id = p_vehicle_id
        AND (
            p_search IS NULL OR
            p.name ILIKE '%' || p_search || '%' OR
            p.part_number ILIKE '%' || p_search || '%' OR
            p.brand ILIKE '%' || p_search || '%'
        )
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- 6. Insertion de données de démonstration
-- Nettoyer les données existantes
DELETE FROM public.part_vehicle_fitment;
DELETE FROM public.parts;
DELETE FROM public.vehicles;

-- Insérer des véhicules individuellement
INSERT INTO public.vehicles (make, model, year_start, year_end, engine) VALUES
('Hyundai', 'Tucson', 2019, 2021, '2.0L 4-Cyl');

INSERT INTO public.vehicles (make, model, year_start, year_end, engine) VALUES
('Hyundai', 'Tucson', 2022, 2024, '2.5L 4-Cyl');

INSERT INTO public.vehicles (make, model, year_start, year_end, engine) VALUES
('Hyundai', 'Elantra', 2020, 2023, '2.0L 4-Cyl');

INSERT INTO public.vehicles (make, model, year_start, year_end, engine) VALUES
('Hyundai', 'Sonata', 2020, 2024, '2.5L 4-Cyl');

INSERT INTO public.vehicles (make, model, year_start, year_end, engine) VALUES
('Hyundai', 'Santa Fe', 2019, 2023, '2.4L 4-Cyl');

INSERT INTO public.vehicles (make, model, year_start, year_end, engine) VALUES
('Kia', 'Sportage', 2020, 2022, '2.4L 4-Cyl');

INSERT INTO public.vehicles (make, model, year_start, year_end, engine) VALUES
('Kia', 'Sportage', 2023, 2024, '2.5L 4-Cyl');

INSERT INTO public.vehicles (make, model, year_start, year_end, engine) VALUES
('Kia', 'Sorento', 2020, 2023, '2.5L 4-Cyl');

INSERT INTO public.vehicles (make, model, year_start, year_end, engine) VALUES
('Kia', 'Forte', 2019, 2023, '2.0L 4-Cyl');

INSERT INTO public.vehicles (make, model, year_start, year_end, engine) VALUES
('Kia', 'Telluride', 2020, 2024, '3.8L V6');

-- Insérer des pièces avec des IDs spécifiques pour les relations
DO $$
DECLARE
    tucson_2019_id uuid;
    tucson_2022_id uuid;
    elantra_2020_id uuid;
    sonata_2020_id uuid;
    santa_fe_2019_id uuid;
    sportage_2020_id uuid;
    sportage_2023_id uuid;
    sorento_2020_id uuid;
    forte_2019_id uuid;
    telluride_2020_id uuid;
    
    air_filter_id uuid;
    oil_filter_id uuid;
    brake_pads_id uuid;
    spark_plugs_id uuid;
    timing_belt_id uuid;
    water_pump_id uuid;
    alternator_id uuid;
    starter_id uuid;
    battery_id uuid;
    headlight_id uuid;
BEGIN
    -- Récupérer les IDs des véhicules
    SELECT id INTO tucson_2019_id FROM public.vehicles WHERE make = 'Hyundai' AND model = 'Tucson' AND year_start = 2019;
    SELECT id INTO tucson_2022_id FROM public.vehicles WHERE make = 'Hyundai' AND model = 'Tucson' AND year_start = 2022;
    SELECT id INTO elantra_2020_id FROM public.vehicles WHERE make = 'Hyundai' AND model = 'Elantra' AND year_start = 2020;
    SELECT id INTO sonata_2020_id FROM public.vehicles WHERE make = 'Hyundai' AND model = 'Sonata' AND year_start = 2020;
    SELECT id INTO santa_fe_2019_id FROM public.vehicles WHERE make = 'Hyundai' AND model = 'Santa Fe' AND year_start = 2019;
    SELECT id INTO sportage_2020_id FROM public.vehicles WHERE make = 'Kia' AND model = 'Sportage' AND year_start = 2020;
    SELECT id INTO sportage_2023_id FROM public.vehicles WHERE make = 'Kia' AND model = 'Sportage' AND year_start = 2023;
    SELECT id INTO sorento_2020_id FROM public.vehicles WHERE make = 'Kia' AND model = 'Sorento' AND year_start = 2020;
    SELECT id INTO forte_2019_id FROM public.vehicles WHERE make = 'Kia' AND model = 'Forte' AND year_start = 2019;
    SELECT id INTO telluride_2020_id FROM public.vehicles WHERE make = 'Kia' AND model = 'Telluride' AND year_start = 2020;

    -- Insérer des pièces avec images spécifiques
    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('28113-2E100', '28113-2E000', 'Filtre à air', 'Filtre à air pour moteur 2.0L et 2.4L', 'Hyundai Genuine', 15000, 25, '/src/assets/parts/air-filter.svg') RETURNING id INTO air_filter_id;
    
    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('26300-35505', '26300-35504', 'Filtre à huile', 'Filtre à huile standard', 'Kia Genuine', 8000, 50, '/src/assets/parts/oil-filter.svg') RETURNING id INTO oil_filter_id;
    
    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('58101-D3A01', '58101-D3A00', 'Plaquettes de frein avant', 'Plaquettes de frein avant céramique', 'Hyundai Mobis', 45000, 15, '/src/assets/parts/brake-pads.svg') RETURNING id INTO brake_pads_id;
    
    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('18890-2E000', '18890-2E001', 'Bougies d''allumage', 'Bougies d''allumage iridium', 'NGK', 12000, 30, '/src/assets/parts/spark-plugs.svg') RETURNING id INTO spark_plugs_id;
    
    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('24400-2E000', '24400-2E001', 'Courroie de distribution', 'Courroie de distribution renforcée', 'Gates', 35000, 8, '/src/assets/parts/timing-belt.svg') RETURNING id INTO timing_belt_id;
    
    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('21100-2E000', '21100-2E001', 'Pompe à eau', 'Pompe à eau avec joint', 'Hyundai Genuine', 28000, 12, '/src/assets/parts/water-pump.svg') RETURNING id INTO water_pump_id;
    
    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('37300-2E000', '37300-2E001', 'Alternateur', 'Alternateur 120A', 'Denso', 65000, 6, '/src/assets/parts/alternator.svg') RETURNING id INTO alternator_id;
    
    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('31100-2E000', '31100-2E001', 'Démarreur', 'Démarreur haute performance', 'Mitsubishi', 42000, 8, '/placeholder-parts.svg') RETURNING id INTO starter_id;
    
    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('BAT-2E000', 'BAT-2E001', 'Batterie', 'Batterie 12V 60Ah', 'Varta', 18000, 20, '/src/assets/parts/battery.svg') RETURNING id INTO battery_id;
    
    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('92101-2E000', '92101-2E001', 'Phare avant LED', 'Phare avant LED avec DRL', 'Hyundai Genuine', 85000, 4, '/src/assets/parts/headlight.svg') RETURNING id INTO headlight_id;

    -- Ajouter plus de pièces pour atteindre 20+
    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('28113-2E200', '28113-2E201', 'Filtre à air habitacle', 'Filtre à air pour système de climatisation', 'Hyundai Genuine', 12000, 30, '/src/assets/parts/air-filter.svg');

    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('58101-D3A02', '58101-D3A03', 'Plaquettes de frein arrière', 'Plaquettes de frein arrière céramique', 'Hyundai Mobis', 38000, 20, '/src/assets/parts/brake-pads.svg');

    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('58101-D3A03', '58101-D3A04', 'Disques de frein avant', 'Disques de frein avant ventilés', 'Hyundai Mobis', 85000, 8, '/src/assets/parts/brake-pads.svg');

    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('18890-2E001', '18890-2E002', 'Bougies d''allumage haute performance', 'Bougies d''allumage iridium pour moteurs 2.5L', 'NGK', 15000, 25, '/src/assets/parts/spark-plugs.svg');

    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('24400-2E001', '24400-2E002', 'Courroie de distribution 2.5L', 'Courroie de distribution pour moteurs 2.5L', 'Gates', 42000, 6, '/src/assets/parts/timing-belt.svg');

    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('21100-2E001', '21100-2E002', 'Pompe à eau 2.5L', 'Pompe à eau pour moteurs 2.5L', 'Hyundai Genuine', 32000, 10, '/src/assets/parts/water-pump.svg');

    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('37300-2E001', '37300-2E002', 'Alternateur 150A', 'Alternateur haute performance 150A', 'Denso', 75000, 4, '/src/assets/parts/alternator.svg');

    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('31100-2E001', '31100-2E002', 'Démarreur haute performance', 'Démarreur pour moteurs 2.5L', 'Mitsubishi', 48000, 6, '/placeholder-parts.svg');

    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('BAT-2E001', 'BAT-2E002', 'Batterie 12V 70Ah', 'Batterie haute capacité 12V 70Ah', 'Varta', 22000, 15, '/src/assets/parts/battery.svg');

    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('92111-2E000', '92111-2E001', 'Feu arrière LED', 'Feu arrière LED avec clignotant', 'Hyundai Genuine', 45000, 8, '/src/assets/parts/headlight.svg');

    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('54500-2E000', '54500-2E001', 'Amortisseur avant', 'Amortisseur avant hydraulique', 'Sachs', 75000, 6, '/placeholder-parts.svg');

    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('54500-2E001', '54500-2E002', 'Ressort de suspension', 'Ressort hélicoïdal pour suspension avant', 'Sachs', 45000, 8, '/placeholder-parts.svg');

    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('23200-2E000', '23200-2E001', 'Kit embrayage', 'Kit embrayage complet', 'Luk', 120000, 3, '/placeholder-parts.svg');

    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('97133-2E000', '97133-2E001', 'Filtre habitacle', 'Filtre habitacle avec charbon actif', 'Hyundai Genuine', 12000, 25, '/src/assets/parts/air-filter.svg');

    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('OIL-5W30', 'OIL-5W30-001', 'Huile moteur 5W-30', 'Huile moteur synthétique 5W-30', 'Shell', 25000, 20, '/placeholder-parts.svg');

    INSERT INTO public.parts (part_number, oem_number, name, description, brand, price_krw, stock_quantity, image_url) VALUES
    ('COOLANT-G12', 'COOLANT-G12-001', 'Liquide de refroidissement', 'Liquide de refroidissement G12+', 'Hyundai Genuine', 15000, 18, '/placeholder-parts.svg');

    -- Lier les pièces aux véhicules compatibles
    -- Filtre à air - compatible avec la plupart des véhicules
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES 
    (air_filter_id, tucson_2019_id),
    (air_filter_id, tucson_2022_id),
    (air_filter_id, elantra_2020_id),
    (air_filter_id, sonata_2020_id),
    (air_filter_id, santa_fe_2019_id),
    (air_filter_id, sportage_2020_id),
    (air_filter_id, sportage_2023_id),
    (air_filter_id, sorento_2020_id),
    (air_filter_id, forte_2019_id),
    (air_filter_id, telluride_2020_id);

    -- Filtre à huile - compatible avec tous
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES 
    (oil_filter_id, tucson_2019_id),
    (oil_filter_id, tucson_2022_id),
    (oil_filter_id, elantra_2020_id),
    (oil_filter_id, sonata_2020_id),
    (oil_filter_id, santa_fe_2019_id),
    (oil_filter_id, sportage_2020_id),
    (oil_filter_id, sportage_2023_id),
    (oil_filter_id, sorento_2020_id),
    (oil_filter_id, forte_2019_id),
    (oil_filter_id, telluride_2020_id);

    -- Plaquettes de frein - Tucson et Sportage
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES 
    (brake_pads_id, tucson_2019_id),
    (brake_pads_id, tucson_2022_id),
    (brake_pads_id, sportage_2020_id),
    (brake_pads_id, sportage_2023_id);

    -- Bougies d'allumage - moteurs 2.0L et 2.4L
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES 
    (spark_plugs_id, tucson_2019_id),
    (spark_plugs_id, elantra_2020_id),
    (spark_plugs_id, santa_fe_2019_id),
    (spark_plugs_id, sportage_2020_id),
    (spark_plugs_id, forte_2019_id);

    -- Courroie de distribution - moteurs 2.0L
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES 
    (timing_belt_id, tucson_2019_id),
    (timing_belt_id, elantra_2020_id),
    (timing_belt_id, forte_2019_id);

    -- Pompe à eau - moteurs 2.0L et 2.4L
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES 
    (water_pump_id, tucson_2019_id),
    (water_pump_id, santa_fe_2019_id),
    (water_pump_id, sportage_2020_id);

    -- Alternateur - véhicules récents
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES 
    (alternator_id, tucson_2022_id),
    (alternator_id, sonata_2020_id),
    (alternator_id, sportage_2023_id),
    (alternator_id, telluride_2020_id);

    -- Démarreur - véhicules 2020+
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES 
    (starter_id, elantra_2020_id),
    (starter_id, sonata_2020_id),
    (starter_id, sportage_2020_id),
    (starter_id, sorento_2020_id),
    (starter_id, telluride_2020_id);

    -- Batterie - tous les véhicules
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES 
    (battery_id, tucson_2019_id),
    (battery_id, tucson_2022_id),
    (battery_id, elantra_2020_id),
    (battery_id, sonata_2020_id),
    (battery_id, santa_fe_2019_id),
    (battery_id, sportage_2020_id),
    (battery_id, sportage_2023_id),
    (battery_id, sorento_2020_id),
    (battery_id, forte_2019_id),
    (battery_id, telluride_2020_id);

    -- Phares LED - véhicules récents
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES 
    (headlight_id, tucson_2022_id),
    (headlight_id, sonata_2020_id),
    (headlight_id, sportage_2023_id),
    (headlight_id, telluride_2020_id);

    -- Ajouter plus de relations pour atteindre 50+
    -- Relations pour les nouvelles pièces avec tous les véhicules compatibles
    -- Filtre à air habitacle - tous les véhicules
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) 
    SELECT p.id, v.id FROM public.parts p, public.vehicles v 
    WHERE p.part_number = '28113-2E200';

    -- Plaquettes de frein arrière - Tucson et Sportage
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) 
    SELECT p.id, v.id FROM public.parts p, public.vehicles v 
    WHERE p.part_number = '58101-D3A02' 
    AND (v.model = 'Tucson' OR v.model = 'Sportage');

    -- Disques de frein avant - Tucson
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) 
    SELECT p.id, v.id FROM public.parts p, public.vehicles v 
    WHERE p.part_number = '58101-D3A03' 
    AND v.model = 'Tucson';

    -- Bougies d'allumage haute performance - moteurs 2.5L
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) 
    SELECT p.id, v.id FROM public.parts p, public.vehicles v 
    WHERE p.part_number = '18890-2E001' 
    AND (v.engine LIKE '%2.5L%' OR v.model = 'Telluride');

    -- Courroie de distribution 2.5L - moteurs 2.5L
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) 
    SELECT p.id, v.id FROM public.parts p, public.vehicles v 
    WHERE p.part_number = '24400-2E001' 
    AND v.engine LIKE '%2.5L%';

    -- Pompe à eau 2.5L - moteurs 2.5L
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) 
    SELECT p.id, v.id FROM public.parts p, public.vehicles v 
    WHERE p.part_number = '21100-2E001' 
    AND v.engine LIKE '%2.5L%';

    -- Alternateur 150A - véhicules récents
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) 
    SELECT p.id, v.id FROM public.parts p, public.vehicles v 
    WHERE p.part_number = '37300-2E001' 
    AND v.year_start >= 2022;

    -- Démarreur haute performance - moteurs 2.5L
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) 
    SELECT p.id, v.id FROM public.parts p, public.vehicles v 
    WHERE p.part_number = '31100-2E001' 
    AND v.engine LIKE '%2.5L%';

    -- Batterie 70Ah - tous les véhicules
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) 
    SELECT p.id, v.id FROM public.parts p, public.vehicles v 
    WHERE p.part_number = 'BAT-2E001';

    -- Feu arrière LED - véhicules récents
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) 
    SELECT p.id, v.id FROM public.parts p, public.vehicles v 
    WHERE p.part_number = '92111-2E000' 
    AND v.year_start >= 2022;

    -- Amortisseur avant - Tucson et Sportage
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) 
    SELECT p.id, v.id FROM public.parts p, public.vehicles v 
    WHERE p.part_number = '54500-2E000' 
    AND (v.model = 'Tucson' OR v.model = 'Sportage');

    -- Ressort de suspension - Tucson et Sportage
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) 
    SELECT p.id, v.id FROM public.parts p, public.vehicles v 
    WHERE p.part_number = '54500-2E001' 
    AND (v.model = 'Tucson' OR v.model = 'Sportage');

    -- Kit embrayage - Elantra et Forte
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) 
    SELECT p.id, v.id FROM public.parts p, public.vehicles v 
    WHERE p.part_number = '23200-2E000' 
    AND (v.model = 'Elantra' OR v.model = 'Forte');

    -- Filtre habitacle - tous les véhicules
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) 
    SELECT p.id, v.id FROM public.parts p, public.vehicles v 
    WHERE p.part_number = '97133-2E000';

    -- Huile moteur - tous les véhicules
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) 
    SELECT p.id, v.id FROM public.parts p, public.vehicles v 
    WHERE p.part_number = 'OIL-5W30';

    -- Liquide de refroidissement - tous les véhicules
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) 
    SELECT p.id, v.id FROM public.parts p, public.vehicles v 
    WHERE p.part_number = 'COOLANT-G12';

END $$;

-- 7. Insérer des produits génériques pour la boutique
INSERT INTO public.products (name, description, price_krw, category, image_url, stock_quantity) VALUES
('Samsung Galaxy S24', 'Smartphone Samsung Galaxy S24 128GB', 1200000, 'smartphones', '/samsung-galaxy-s24.jpg', 10),
('MacBook Pro M3', 'MacBook Pro 14" avec puce M3', 2800000, 'electronics', '/macbook-pro-m3.jpg', 5),
('LG Réfrigérateur', 'Réfrigérateur LG 500L', 1800000, 'appliances', '/lg-refrigerator.jpg', 3),
('Hyundai Tucson 2023', 'SUV Hyundai Tucson 2.5L', 35000000, 'vehicles', '/hyundai-tucson.jpg', 2);

-- 8. Vérification des données
SELECT 'Véhicules insérés:' as info, COUNT(*) as count FROM public.vehicles;
SELECT 'Pièces insérées:' as info, COUNT(*) as count FROM public.parts;
SELECT 'Relations fitment:' as info, COUNT(*) as count FROM public.part_vehicle_fitment;
SELECT 'Produits génériques:' as info, COUNT(*) as count FROM public.products;

-- 9. Test de la fonction RPC
SELECT 'Test fonction RPC:' as info;
SELECT * FROM get_parts_for_vehicle(
    (SELECT id FROM public.vehicles WHERE make = 'Hyundai' AND model = 'Tucson' AND year_start = 2019 LIMIT 1),
    NULL,
    5,
    0
);