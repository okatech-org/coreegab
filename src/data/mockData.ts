import { Product, Order, PriceSettings } from "@/types/database";

// Segments principaux de la boutique (organisés par gamme logique)
export const boutiqueSegments = {
  vehicles: {
    id: 'vehicles',
    name: 'Véhicules Coréens',
    description: 'Hyundai, Kia, Genesis - SUV, berlines, monospaces',
    icon: '🚗',
    categories: ['vehicles'],
    subcategories: ['SUV Premium', 'Berlines', 'Monospaces']
  },
  electronics: {
    id: 'electronics',
    name: 'Électronique Coréenne',
    description: 'Samsung, LG - Smartphones, TV, ordinateurs, audio',
    icon: '📱',
    categories: ['smartphones', 'electronics'],
    subcategories: ['Smartphones', 'TV & Audio', 'Ordinateurs & Tablettes']
  },
  appliances: {
    id: 'appliances',
    name: 'Électroménager Coréen',
    description: 'LG, Samsung - Gros et petit électroménager',
    icon: '🏠',
    categories: ['appliances'],
    subcategories: ['Gros Électroménager', 'Petit Électroménager']
  },
  parts: {
    id: 'parts',
    name: 'Pièces Automobiles',
    description: 'Pièces détachées pour véhicules coréens',
    icon: '🔧',
    categories: ['parts'],
    subcategories: ['Filtres', 'Freinage', 'Allumage', 'Distribution', 'Refroidissement', 'Électrique', 'Éclairage', 'Suspension', 'Transmission', 'Climatisation', 'Lubrifiants']
  }
};

// Mock Products Data (organisés par gamme et section logique)
export const mockProducts: Product[] = [
  // ===== VÉHICULES CORÉENS =====
  // SUV Premium
  { id: '11', name: 'Hyundai Tucson 2024', category: 'vehicles', price_krw: 35000000, weight: 1500, image_url: '/src/assets/hyundai-tucson.jpg', description: 'SUV hybride 7 places, moteur 2.5L, transmission automatique', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '12', name: 'Kia Sportage 2024', category: 'vehicles', price_krw: 32000000, weight: 1450, image_url: '/placeholder-car.svg', description: 'SUV compact moderne, moteur 2.4L, transmission automatique', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '13', name: 'Genesis GV70', category: 'vehicles', price_krw: 45000000, weight: 1800, image_url: '/placeholder-car.svg', description: 'SUV de luxe Genesis, moteur 3.5L V6, transmission automatique', in_stock: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  
  // Berlines
  { id: '14', name: 'Hyundai Elantra 2024', category: 'vehicles', price_krw: 25000000, weight: 1300, image_url: '/placeholder-car.svg', description: 'Berline élégante, moteur 2.0L, transmission automatique', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '15', name: 'Kia Carnival 2024', category: 'vehicles', price_krw: 40000000, weight: 2000, image_url: '/placeholder-car.svg', description: 'Monospace familial 8 places, moteur 3.5L V6', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },

  // ===== ÉLECTRONIQUE CORÉENNE =====
  // Smartphones Samsung
  { id: '1', name: 'Samsung Galaxy S24 Ultra', category: 'smartphones', price_krw: 1800000, weight: 0.5, image_url: '/src/assets/samsung-galaxy-s24.jpg', description: 'Smartphone haut de gamme avec caméra 200MP, S Pen inclus', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '2', name: 'Samsung Galaxy Z Fold 5', category: 'smartphones', price_krw: 2200000, weight: 0.6, image_url: '/placeholder-phone.svg', description: 'Smartphone pliable premium, écran 7.6"', in_stock: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '3', name: 'Samsung Galaxy S23', category: 'smartphones', price_krw: 1200000, weight: 0.4, image_url: '/placeholder-phone.svg', description: 'Smartphone compact performant, caméra 50MP', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  
  // Ordinateurs et Tablettes
  { id: '6', name: 'MacBook Pro M3', category: 'electronics', price_krw: 3200000, weight: 2.0, image_url: '/src/assets/macbook-pro-m3.jpg', description: 'Ordinateur portable professionnel, puce M3, 16GB RAM', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '7', name: 'iPad Pro 12.9"', category: 'electronics', price_krw: 1400000, weight: 0.7, image_url: '/placeholder-phone.svg', description: 'Tablette professionnelle, puce M2, 128GB', in_stock: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  
  // TV et Audio
  { id: '8', name: 'Samsung 65" QLED TV', category: 'electronics', price_krw: 2500000, weight: 25.0, image_url: '/placeholder-tv.svg', description: 'Téléviseur 4K QLED, Smart TV, HDR10+', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '9', name: 'Sony WH-1000XM5', category: 'electronics', price_krw: 500000, weight: 0.3, image_url: '/placeholder-headphones.svg', description: 'Casque à réduction de bruit, 30h autonomie', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '10', name: 'Nintendo Switch OLED', category: 'electronics', price_krw: 450000, weight: 0.4, image_url: '/placeholder-phone.svg', description: 'Console de jeu portable, écran OLED 7"', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },

  // ===== ÉLECTROMÉNAGER CORÉEN =====
  // Gros électroménager
  { id: '16', name: 'LG Réfrigérateur Inox', category: 'appliances', price_krw: 1500000, weight: 120, image_url: '/src/assets/lg-refrigerator.jpg', description: 'Réfrigérateur double porte 500L, technologie Inverter', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '17', name: 'Samsung Lave-linge', category: 'appliances', price_krw: 800000, weight: 70, image_url: '/placeholder-appliance.svg', description: 'Lave-linge 9kg avec AI, technologie EcoBubble', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '18', name: 'LG Climatiseur', category: 'appliances', price_krw: 1200000, weight: 45, image_url: '/placeholder-appliance.svg', description: 'Climatiseur split 24000 BTU, technologie Dual Inverter', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  
  // Petit électroménager
  { id: '19', name: 'Samsung Four Micro-ondes', category: 'appliances', price_krw: 300000, weight: 15, image_url: '/placeholder-appliance.svg', description: 'Four micro-ondes 28L, technologie Grill', in_stock: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '20', name: 'LG Aspirateur Robot', category: 'appliances', price_krw: 600000, weight: 5, image_url: '/placeholder-appliance.svg', description: 'Aspirateur robot intelligent, cartographie laser', in_stock: false, created_at: '2024-01-01', updated_at: '2024-01-01' },

  // Note: Les pièces détachées automobiles sont maintenant gérées par la base de données
  // et affichées via le sélecteur de véhicule dans la boutique
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
    name: 'Admin COREEGAB',
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

export const getProductsBySegment = (segmentId: keyof typeof boutiqueSegments): Product[] => {
  const segment = boutiqueSegments[segmentId];
  return mockProducts.filter(product => segment.categories.includes(product.category));
};

export const getSegmentStats = () => {
  return Object.entries(boutiqueSegments).map(([id, segment]) => ({
    ...segment,
    totalProducts: getProductsBySegment(id as keyof typeof boutiqueSegments).length,
    inStockProducts: getProductsBySegment(id as keyof typeof boutiqueSegments).filter(p => p.in_stock).length
  }));
};

export const formatPrice = (price: number): string => {
  return price.toLocaleString() + ' FCFA';
};