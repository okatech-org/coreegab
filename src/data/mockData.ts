import { Product, Order, PriceSettings } from "@/types/database";

// Mock Products Data (10 products per category)
export const mockProducts: Product[] = [
  // Electronics
  { id: '1', name: 'Samsung Galaxy S24 Ultra', category: 'electronics', price_krw: 1800000, weight: 0.5, image_url: '/src/assets/samsung-galaxy-s24.jpg', description: 'Smartphone haut de gamme avec caméra 200MP', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '2', name: 'iPhone 15 Pro', category: 'electronics', price_krw: 1600000, weight: 0.45, image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', description: 'iPhone avec processeur A17 Pro', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '3', name: 'MacBook Pro M3', category: 'electronics', price_krw: 3200000, weight: 2.0, image_url: '/src/assets/macbook-pro-m3.jpg', description: 'Ordinateur portable professionnel', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '4', name: 'Sony WH-1000XM5', category: 'electronics', price_krw: 500000, weight: 0.3, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', description: 'Casque à réduction de bruit', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '5', name: 'iPad Pro 12.9"', category: 'electronics', price_krw: 1400000, weight: 0.7, image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', description: 'Tablette professionnelle', in_stock: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '6', name: 'Nintendo Switch OLED', category: 'electronics', price_krw: 450000, weight: 0.4, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', description: 'Console de jeu portable', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '7', name: 'Samsung 65" QLED TV', category: 'electronics', price_krw: 2500000, weight: 25.0, image_url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', description: 'Téléviseur 4K QLED', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '8', name: 'Canon EOS R5', category: 'electronics', price_krw: 4500000, weight: 1.5, image_url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400', description: 'Appareil photo professionnel', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '9', name: 'DJI Mavic Air 2', category: 'electronics', price_krw: 1200000, weight: 0.8, image_url: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=400', description: 'Drone avec caméra 4K', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '10', name: 'Apple Watch Series 9', category: 'electronics', price_krw: 600000, weight: 0.1, image_url: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400', description: 'Montre connectée', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },

  // Vehicles
  { id: '11', name: 'Hyundai Tucson 2024', category: 'vehicles', price_krw: 35000000, weight: 1500, image_url: '/src/assets/hyundai-tucson.jpg', description: 'SUV hybride 7 places', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '12', name: 'Kia Sportage 2024', category: 'vehicles', price_krw: 32000000, weight: 1450, image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400', description: 'SUV compact moderne', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '13', name: 'Genesis GV70', category: 'vehicles', price_krw: 45000000, weight: 1800, image_url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400', description: 'SUV de luxe', in_stock: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '14', name: 'Hyundai Elantra', category: 'vehicles', price_krw: 25000000, weight: 1300, image_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400', description: 'Berline élégante', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '15', name: 'Kia Carnival', category: 'vehicles', price_krw: 40000000, weight: 2000, image_url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400', description: 'Monospace familial', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '16', name: 'Hyundai Santa Fe', category: 'vehicles', price_krw: 38000000, weight: 1700, image_url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400', description: 'Grand SUV 7 places', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '17', name: 'Kia Sorento', category: 'vehicles', price_krw: 36000000, weight: 1650, image_url: 'https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?w=400', description: 'SUV familial', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '18', name: 'Genesis G90', category: 'vehicles', price_krw: 80000000, weight: 2100, image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400', description: 'Berline de luxe', in_stock: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '19', name: 'Hyundai Ioniq 5', category: 'vehicles', price_krw: 50000000, weight: 1900, image_url: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400', description: 'SUV électrique', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '20', name: 'Kia EV6', category: 'vehicles', price_krw: 48000000, weight: 1850, image_url: 'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=400', description: 'Crossover électrique', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },

  // Appliances
  { id: '21', name: 'LG Réfrigérateur Inox', category: 'appliances', price_krw: 1500000, weight: 120, image_url: '/src/assets/lg-refrigerator.jpg', description: 'Réfrigérateur double porte 500L', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '22', name: 'Samsung Lave-linge', category: 'appliances', price_krw: 800000, weight: 70, image_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400', description: 'Lave-linge 9kg avec AI', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '23', name: 'LG Climatiseur', category: 'appliances', price_krw: 1200000, weight: 45, image_url: 'https://images.unsplash.com/photo-1631545872984-59473b6ac224?w=400', description: 'Climatiseur split 24000 BTU', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '24', name: 'Samsung Four Micro-ondes', category: 'appliances', price_krw: 300000, weight: 15, image_url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400', description: 'Four micro-ondes 28L', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '25', name: 'LG Aspirateur Robot', category: 'appliances', price_krw: 600000, weight: 5, image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', description: 'Aspirateur robot intelligent', in_stock: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '26', name: 'Samsung Lave-vaisselle', category: 'appliances', price_krw: 900000, weight: 50, image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', description: 'Lave-vaisselle 14 couverts', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '27', name: 'LG Cuisinière Gaz', category: 'appliances', price_krw: 400000, weight: 35, image_url: 'https://images.unsplash.com/photo-1556909114-4bb1ba2e86b8?w=400', description: 'Cuisinière 4 feux avec four', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '28', name: 'Samsung Sèche-linge', category: 'appliances', price_krw: 700000, weight: 60, image_url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400', description: 'Sèche-linge pompe à chaleur', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '29', name: 'LG Purificateur d\'air', category: 'appliances', price_krw: 500000, weight: 8, image_url: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400', description: 'Purificateur HEPA UV', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '30', name: 'Samsung Friteuse Air', category: 'appliances', price_krw: 250000, weight: 4, image_url: 'https://images.unsplash.com/photo-1581783186308-ea10c6b82338?w=400', description: 'Friteuse sans huile 5L', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },

  // Parts
  { id: '31', name: 'Plaquettes de frein Hyundai', category: 'parts', price_krw: 80000, weight: 2, image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400', description: 'Plaquettes avant et arrière', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '32', name: 'Filtre à air moteur', category: 'parts', price_krw: 35000, weight: 0.5, image_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400', description: 'Filtre haute performance', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '33', name: 'Amortisseurs Kia', category: 'parts', price_krw: 200000, weight: 5, image_url: 'https://images.unsplash.com/photo-1621789840756-1b78e6df98f7?w=400', description: 'Paire d\'amortisseurs avant', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '34', name: 'Bougies d\'allumage', category: 'parts', price_krw: 15000, weight: 0.2, image_url: 'https://images.unsplash.com/photo-1609741199743-d3b7b32e5b9b?w=400', description: 'Jeu de 4 bougies', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '35', name: 'Courroie de distribution', category: 'parts', price_krw: 120000, weight: 1, image_url: 'https://images.unsplash.com/photo-1558659388-a4c6f8d6b6e2?w=400', description: 'Kit complet avec galets', in_stock: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '36', name: 'Rétroviseurs Hyundai', category: 'parts', price_krw: 150000, weight: 2, image_url: 'https://images.unsplash.com/photo-1621789840756-1b78e6df98f7?w=400', description: 'Rétroviseurs chauffants', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '37', name: 'Batterie 12V', category: 'parts', price_krw: 180000, weight: 20, image_url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400', description: 'Batterie haute capacité', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '38', name: 'Phares LED Kia', category: 'parts', price_krw: 300000, weight: 3, image_url: 'https://images.unsplash.com/photo-1621789840756-1b78e6df98f7?w=400', description: 'Phares LED adaptatifs', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '39', name: 'Embrayage Hyundai', category: 'parts', price_krw: 450000, weight: 8, image_url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400', description: 'Kit embrayage complet', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '40', name: 'Pneus Michelin', category: 'parts', price_krw: 600000, weight: 40, image_url: 'https://images.unsplash.com/photo-1558659005-a1d17e1dd80d?w=400', description: 'Jeu de 4 pneus 225/60R16', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' }
];

// Mock Orders Data
export const mockOrders: Order[] = [
  {
    id: 'CMD001',
    client_id: 'client-1',
    commercial_id: 'commercial-1',
    products: [{ id: '1', quantity: 1, name: 'Samsung Galaxy S24 Ultra' }],
    supplier_price: 1800000,
    transport_cost: 50000,
    customs_cost: 180000,
    margin: 630000,
    total_price: 2660000,
    status: 'pending',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'CMD002',
    client_id: 'client-2',
    commercial_id: 'commercial-1',
    products: [{ id: '21', quantity: 1, name: 'LG Réfrigérateur Inox' }],
    supplier_price: 1500000,
    transport_cost: 120000,
    customs_cost: 150000,
    margin: 525000,
    total_price: 2295000,
    status: 'shipping',
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-14T09:15:00Z'
  },
  {
    id: 'CMD003',
    client_id: 'client-1',
    commercial_id: 'commercial-1',
    products: [{ id: '31', quantity: 4, name: 'Plaquettes de frein Hyundai' }],
    supplier_price: 320000,
    transport_cost: 50000,
    customs_cost: 32000,
    margin: 112000,
    total_price: 514000,
    status: 'delivered',
    created_at: '2024-01-05T16:45:00Z',
    updated_at: '2024-01-12T11:20:00Z'
  },
  {
    id: 'CMD004',
    client_id: 'client-3',
    commercial_id: 'commercial-1',
    products: [{ id: '11', quantity: 1, name: 'Hyundai Tucson 2024' }],
    supplier_price: 35000000,
    transport_cost: 1500000,
    customs_cost: 3500000,
    margin: 12250000,
    total_price: 52250000,
    status: 'confirmed',
    created_at: '2024-01-20T08:00:00Z',
    updated_at: '2024-01-21T14:30:00Z'
  },
  {
    id: 'CMD005',
    client_id: 'client-2',
    commercial_id: 'commercial-1',
    products: [{ id: '3', quantity: 1, name: 'MacBook Pro M3' }],
    supplier_price: 3200000,
    transport_cost: 50000,
    customs_cost: 320000,
    margin: 1120000,
    total_price: 4690000,
    status: 'pending',
    created_at: '2024-01-22T12:15:00Z',
    updated_at: '2024-01-22T12:15:00Z'
  }
];

// Price Settings
export const mockPriceSettings: PriceSettings = {
  id: 'settings-1',
  exchange_rate_krw_xaf: 0.65,
  transport_base: 50000,
  transport_per_kg: 1000,
  margin_rate: 0.35,
  updated_at: '2024-01-01T00:00:00Z'
};

// Demo Accounts
export const demoAccounts = {
  client: {
    id: 'client-1',
    email: 'client@demo.com',
    name: 'Jean Dupont',
    role: 'client' as const,
    phone: '+241 XX XX XX XX'
  },
  commercial: {
    id: 'commercial-1',
    email: 'commercial@demo.com',
    name: 'Marie Claire',
    role: 'commercial' as const,
    phone: '+241 XX XX XX XX'
  },
  admin: {
    id: 'admin-1',
    email: 'admin@demo.com',
    name: 'Admin COREGAB',
    role: 'admin' as const,
    phone: '+241 XX XX XX XX'
  }
};

// Utility functions
export const calculateFinalPrice = (product: Product, settings: PriceSettings = mockPriceSettings): number => {
  const supplierPrice = product.price_krw * settings.exchange_rate_krw_xaf;
  const transportCost = settings.transport_base + (product.weight * settings.transport_per_kg);
  const customsCost = supplierPrice * 0.10; // 10% customs
  const margin = (supplierPrice + transportCost + customsCost) * settings.margin_rate;
  
  return Math.round(supplierPrice + transportCost + customsCost + margin);
};

export const getProductsByCategory = (category: Product['category']): Product[] => {
  return mockProducts.filter(product => product.category === category);
};

export const formatPrice = (price: number): string => {
  return price.toLocaleString() + ' FCFA';
};