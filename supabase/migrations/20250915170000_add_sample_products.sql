-- Add sample products for testing
INSERT INTO public.products (name, category, price_krw, weight, image_url, description, in_stock) VALUES
('Samsung Galaxy S24 Ultra', 'electronics', 1500000, 0.233, '/samsung-galaxy-s24.jpg', 'Smartphone haut de gamme avec écran 6.8" Dynamic AMOLED 2X', true),
('Hyundai Tucson 2023', 'vehicles', 35000000, 1600, '/hyundai-tucson.jpg', 'SUV compact avec moteur hybride et transmission intégrale', true),
('LG Réfrigérateur InstaView', 'appliances', 2800000, 120, '/lg-refrigerator.jpg', 'Réfrigérateur américain 635L avec technologie InstaView Door-in-Door', true),
('MacBook Pro M3 14"', 'electronics', 2500000, 1.6, '/macbook-pro-m3.jpg', 'Ordinateur portable professionnel avec puce M3 et écran Liquid Retina XDR', true),
('Samsung QLED 65" 4K', 'electronics', 1800000, 25, '/placeholder-parts.svg', 'Téléviseur QLED 65 pouces avec résolution 4K et HDR10+', true),
('Kia Sportage Hybrid', 'vehicles', 32000000, 1650, '/placeholder-parts.svg', 'SUV hybride avec design moderne et technologies avancées', true);
