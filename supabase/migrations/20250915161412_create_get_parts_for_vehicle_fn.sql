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
