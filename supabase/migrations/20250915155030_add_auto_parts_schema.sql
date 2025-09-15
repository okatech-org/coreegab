-- supabase/migrations/20250915155030_add_auto_parts_schema.sql

-- 1. Création de la table des véhicules
CREATE TABLE "public"."vehicles" (
    "id" uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "make" text NOT NULL, -- Marque (ex: Hyundai, Kia)
    "model" text NOT NULL, -- Modèle (ex: Tucson, Sportage)
    "year_start" integer NOT NULL, -- Année de début de production
    "year_end" integer, -- Année de fin de production (peut être NULL)
    "engine" text, -- Motorisation (ex: 2.0L 4-Cyl)
    "trim" text -- Finition (ex: Limited, SEL)
);

ALTER TABLE "public"."vehicles" OWNER TO "postgres";
ALTER TABLE ONLY "public"."vehicles" ADD CONSTRAINT "vehicles_pkey" PRIMARY KEY (id);
CREATE INDEX "idx_vehicles_make_model_year" ON "public"."vehicles" USING btree (make, model, year_start, year_end);


-- 2. Création de la table des pièces automobiles
CREATE TABLE "public"."parts" (
    "id" uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "part_number" text NOT NULL, -- Référence fabricant
    "oem_number" text, -- Référence OEM (Original Equipment Manufacturer)
    "name" text NOT NULL, -- Nom de la pièce (ex: Filtre à air)
    "description" text,
    "brand" text, -- Marque de la pièce (ex: Hyundai Genuine, Bosch)
    "price_krw" numeric,
    "stock_quantity" integer DEFAULT 0,
    "image_url" text
);

ALTER TABLE "public"."parts" OWNER TO "postgres";
ALTER TABLE ONLY "public"."parts" ADD CONSTRAINT "parts_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."parts" ADD CONSTRAINT "parts_part_number_unique" UNIQUE (part_number);


-- 3. Création de la table de compatibilité (Fitment)
CREATE TABLE "public"."part_vehicle_fitment" (
    "id" uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "part_id" uuid NOT NULL,
    "vehicle_id" uuid NOT NULL,
    "notes" text -- Notes spécifiques sur la compatibilité
);

ALTER TABLE "public"."part_vehicle_fitment" OWNER TO "postgres";
ALTER TABLE ONLY "public"."part_vehicle_fitment" ADD CONSTRAINT "part_vehicle_fitment_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."part_vehicle_fitment" ADD CONSTRAINT "part_vehicle_fitment_part_id_fkey" FOREIGN KEY (part_id) REFERENCES public.parts(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."part_vehicle_fitment" ADD CONSTRAINT "part_vehicle_fitment_vehicle_id_fkey" FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."part_vehicle_fitment" ADD CONSTRAINT "part_vehicle_fitment_unique_part_vehicle" UNIQUE (part_id, vehicle_id);
CREATE INDEX "idx_fitment_vehicle_id" ON "public"."part_vehicle_fitment" USING btree (vehicle_id);
CREATE INDEX "idx_fitment_part_id" ON "public"."part_vehicle_fitment" USING btree (part_id);


-- 4. Insertion de données de démonstration
-- On doit déclarer les variables pour stocker les IDs générés
DO $$
DECLARE
    tucson_2021_id uuid;
    sportage_2022_id uuid;
    air_filter_id uuid;
    oil_filter_id uuid;
    brake_pads_id uuid;
BEGIN
    -- Insérer des véhicules
    INSERT INTO public.vehicles (make, model, year_start, year_end, engine)
    VALUES ('Hyundai', 'Tucson', 2019, 2021, '2.0L 4-Cyl') RETURNING id INTO tucson_2021_id;

    INSERT INTO public.vehicles (make, model, year_start, year_end, engine)
    VALUES ('Kia', 'Sportage', 2020, 2022, '2.4L 4-Cyl') RETURNING id INTO sportage_2022_id;

            -- Insérer des pièces
            INSERT INTO public.parts (part_number, oem_number, name, brand, price_krw, image_url)
            VALUES ('28113-2E100', '28113-2E000', 'Filtre à air', 'Hyundai Genuine', 15000, '/placeholder-parts.svg') RETURNING id INTO air_filter_id;

            INSERT INTO public.parts (part_number, oem_number, name, brand, price_krw, image_url)
            VALUES ('26300-35505', '26300-35504', 'Filtre à huile', 'Kia Genuine', 8000, '/placeholder-parts.svg') RETURNING id INTO oil_filter_id;

            INSERT INTO public.parts (part_number, name, brand, price_krw, image_url)
            VALUES ('58101-D3A01', 'Plaquettes de frein avant', 'Hyundai Mobis', 45000, '/placeholder-parts.svg') RETURNING id INTO brake_pads_id;

    -- Lier les pièces aux véhicules
    -- Le filtre à air est compatible avec le Tucson
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES (air_filter_id, tucson_2021_id);

    -- Le filtre à huile est compatible avec les deux
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES (oil_filter_id, tucson_2021_id);
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES (oil_filter_id, sportage_2022_id);

    -- Les plaquettes de frein sont pour le Tucson
    INSERT INTO public.part_vehicle_fitment (part_id, vehicle_id) VALUES (brake_pads_id, tucson_2021_id);
END $$;
