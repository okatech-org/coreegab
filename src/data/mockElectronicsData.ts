// src/data/mockElectronicsData.ts

export interface MockElectronics {
  id: string;
  name: string;
  name_kr?: string;
  description: string;
  type: 'electronics' | 'appliance';
  category: string;
  subcategory: string;
  brand: string;
  model: string;
  price: number; // Prix en KRW
  inStock: boolean;
  stockQuantity: number;
  images: string[];
  powerConsumption?: number; // en watts
  energyRating?: string; // A+++, A++, A+, A, B, C, D
  warrantyYears?: number;
  specifications?: Record<string, any>;
  features?: string[];
  colors?: string[];
}

export const mockElectronics: MockElectronics[] = [
  // === SMARTPHONES SAMSUNG ===
  {
    id: "electronics-001",
    name: "Samsung Galaxy S24 Ultra",
    name_kr: "삼성 갤럭시 S24 울트라",
    description: "Smartphone premium avec écran Dynamic AMOLED 2X 6.8\", processeur Snapdragon 8 Gen 3, 12GB RAM, 256GB stockage, caméra 200MP.",
    type: "electronics",
    category: "Smartphones",
    subcategory: "Premium",
    brand: "Samsung",
    model: "SM-S928B",
    price: 1500000,
    inStock: true,
    stockQuantity: 25,
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"],
    powerConsumption: 5, // Watts en charge
    warrantyYears: 2,
    specifications: {
      screen: "6.8\" Dynamic AMOLED 2X",
      resolution: "3120 x 1440",
      processor: "Snapdragon 8 Gen 3",
      ram: "12GB",
      storage: "256GB",
      camera: "200MP + 50MP + 10MP + 10MP",
      battery: "5000mAh",
      os: "Android 14"
    },
    features: ["5G", "S Pen", "Déverrouillage facial", "Charge rapide 45W", "Résistant à l'eau IP68"],
    colors: ["Titanium Noir", "Titanium Gris", "Titanium Violet", "Titanium Jaune"]
  },
  {
    id: "electronics-002",
    name: "Samsung Galaxy S24+",
    name_kr: "삼성 갤럭시 S24 플러스",
    description: "Smartphone haut de gamme avec écran Dynamic AMOLED 2X 6.7\", processeur Snapdragon 8 Gen 3, 12GB RAM, 256GB stockage.",
    type: "electronics",
    category: "Smartphones",
    subcategory: "Premium",
    brand: "Samsung",
    model: "SM-S926B",
    price: 1200000,
    inStock: true,
    stockQuantity: 30,
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"],
    powerConsumption: 4,
    warrantyYears: 2,
    specifications: {
      screen: "6.7\" Dynamic AMOLED 2X",
      resolution: "3120 x 1440",
      processor: "Snapdragon 8 Gen 3",
      ram: "12GB",
      storage: "256GB",
      camera: "50MP + 10MP + 10MP",
      battery: "4900mAh",
      os: "Android 14"
    },
    features: ["5G", "Déverrouillage facial", "Charge rapide 45W", "Résistant à l'eau IP68"],
    colors: ["Onyx Noir", "Marble Gris", "Cobalt Violet", "Amber Jaune"]
  },
  {
    id: "electronics-003",
    name: "Samsung Galaxy A55 5G",
    name_kr: "삼성 갤럭시 A55 5G",
    description: "Smartphone milieu de gamme avec écran Super AMOLED 6.6\", processeur Exynos 1480, 8GB RAM, 128GB stockage, caméra 50MP.",
    type: "electronics",
    category: "Smartphones",
    subcategory: "Milieu de gamme",
    brand: "Samsung",
    model: "SM-A556B",
    price: 450000,
    inStock: true,
    stockQuantity: 50,
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"],
    powerConsumption: 3,
    warrantyYears: 2,
    specifications: {
      screen: "6.6\" Super AMOLED",
      resolution: "2340 x 1080",
      processor: "Exynos 1480",
      ram: "8GB",
      storage: "128GB",
      camera: "50MP + 12MP + 5MP",
      battery: "5000mAh",
      os: "Android 14"
    },
    features: ["5G", "Déverrouillage facial", "Charge rapide 25W", "Résistant à l'eau IP67"],
    colors: ["Awesome Iceblue", "Awesome Lilac", "Awesome Navy", "Awesome Lemon"]
  },

  // === SMARTPHONES LG ===
  {
    id: "electronics-004",
    name: "LG V60 ThinQ 5G",
    name_kr: "LG V60 씬큐 5G",
    description: "Smartphone premium LG avec écran OLED 6.8\", processeur Snapdragon 865, 8GB RAM, 128GB stockage, audio Quad DAC.",
    type: "electronics",
    category: "Smartphones",
    subcategory: "Premium",
    brand: "LG",
    model: "LM-V600",
    price: 800000,
    inStock: true,
    stockQuantity: 15,
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"],
    powerConsumption: 4,
    warrantyYears: 2,
    specifications: {
      screen: "6.8\" OLED",
      resolution: "2460 x 1080",
      processor: "Snapdragon 865",
      ram: "8GB",
      storage: "128GB",
      camera: "64MP + 13MP + 0.3MP",
      battery: "5000mAh",
      os: "Android 10"
    },
    features: ["5G", "Quad DAC", "Déverrouillage facial", "Charge rapide 25W", "Résistant à l'eau IP68"],
    colors: ["Classy Blue", "Classy White"]
  },

  // === TV SAMSUNG ===
  {
    id: "electronics-005",
    name: "Samsung QN90C Neo QLED 4K 55\"",
    name_kr: "삼성 QN90C 네오 QLED 4K 55인치",
    description: "TV Neo QLED 4K 55\" avec technologie Quantum Mini LED, processeur Neural Quantum 4K, HDR10+, Dolby Vision, Smart TV Tizen.",
    type: "electronics",
    category: "TV & Audio",
    subcategory: "TV 4K",
    brand: "Samsung",
    model: "QN55QN90CAFXZA",
    price: 1800000,
    inStock: true,
    stockQuantity: 12,
    images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400"],
    powerConsumption: 120,
    energyRating: "A+",
    warrantyYears: 2,
    specifications: {
      screen: "55\" Neo QLED",
      resolution: "4K UHD (3840 x 2160)",
      processor: "Neural Quantum 4K",
      hdr: "HDR10+, Dolby Vision",
      smart: "Tizen OS",
      connectivity: "WiFi 6E, Bluetooth 5.2, 4x HDMI 2.1"
    },
    features: ["Quantum Mini LED", "Object Tracking Sound", "Gaming Hub", "AirPlay 2", "Alexa Built-in"],
    colors: ["Noir"]
  },
  {
    id: "electronics-006",
    name: "Samsung The Frame 4K 43\"",
    name_kr: "삼성 더 프레임 4K 43인치",
    description: "TV The Frame 4K 43\" avec design cadre photo, écran QLED, Art Mode, Smart TV Tizen, cadre interchangeable.",
    type: "electronics",
    category: "TV & Audio",
    subcategory: "TV Design",
    brand: "Samsung",
    model: "QN43LS03BAFXZA",
    price: 1200000,
    inStock: true,
    stockQuantity: 8,
    images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400"],
    powerConsumption: 85,
    energyRating: "A",
    warrantyYears: 2,
    specifications: {
      screen: "43\" QLED",
      resolution: "4K UHD (3840 x 2160)",
      processor: "Quantum Processor 4K",
      smart: "Tizen OS",
      connectivity: "WiFi, Bluetooth, 3x HDMI"
    },
    features: ["Art Mode", "One Connect Box", "No Gap Wall Mount", "SmartThings", "Bixby"],
    colors: ["Blanc", "Beige", "Noir"]
  },

  // === TV LG ===
  {
    id: "electronics-007",
    name: "LG OLED C3 4K 48\"",
    name_kr: "LG OLED C3 4K 48인치",
    description: "TV OLED 4K 48\" avec processeur α9 AI Processor Gen6, Dolby Vision IQ, Dolby Atmos, Smart TV webOS.",
    type: "electronics",
    category: "TV & Audio",
    subcategory: "TV OLED",
    brand: "LG",
    model: "OLED48C3PSA",
    price: 1500000,
    inStock: true,
    stockQuantity: 10,
    images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400"],
    powerConsumption: 95,
    energyRating: "A",
    warrantyYears: 2,
    specifications: {
      screen: "48\" OLED",
      resolution: "4K UHD (3840 x 2160)",
      processor: "α9 AI Processor Gen6",
      hdr: "Dolby Vision IQ, HDR10 Pro",
      smart: "webOS 23",
      connectivity: "WiFi 6, Bluetooth 5.0, 4x HDMI 2.1"
    },
    features: ["OLED evo", "Dolby Atmos", "Gaming Optimizer", "Magic Remote", "ThinQ AI"],
    colors: ["Noir"]
  },

  // === ORDINATEURS PORTABLES SAMSUNG ===
  {
    id: "electronics-008",
    name: "Samsung Galaxy Book4 Pro 16\"",
    name_kr: "삼성 갤럭시 북4 프로 16인치",
    description: "Ordinateur portable 16\" avec écran AMOLED 3K, processeur Intel Core i7-1360P, 16GB RAM, 512GB SSD, Windows 11.",
    type: "electronics",
    category: "Ordinateurs & Tablettes",
    subcategory: "Laptops",
    brand: "Samsung",
    model: "NP960XFG-KA1FR",
    price: 2200000,
    inStock: true,
    stockQuantity: 6,
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"],
    powerConsumption: 65,
    warrantyYears: 2,
    specifications: {
      screen: "16\" AMOLED 3K",
      resolution: "2880 x 1800",
      processor: "Intel Core i7-1360P",
      ram: "16GB LPDDR5",
      storage: "512GB SSD",
      graphics: "Intel Iris Xe",
      os: "Windows 11 Home"
    },
    features: ["Écran AMOLED", "S Pen", "Charge rapide", "WiFi 6E", "Bluetooth 5.1"],
    colors: ["Graphite", "Silver"]
  },
  {
    id: "electronics-009",
    name: "Samsung Galaxy Tab S9 Ultra 14.6\"",
    name_kr: "삼성 갤럭시 탭 S9 울트라 14.6인치",
    description: "Tablette 14.6\" avec écran Dynamic AMOLED 2X, processeur Snapdragon 8 Gen 2, 12GB RAM, 256GB stockage, S Pen inclus.",
    type: "electronics",
    category: "Ordinateurs & Tablettes",
    subcategory: "Tablettes",
    brand: "Samsung",
    model: "SM-X910",
    price: 1400000,
    inStock: true,
    stockQuantity: 15,
    images: ["https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400"],
    powerConsumption: 15,
    warrantyYears: 2,
    specifications: {
      screen: "14.6\" Dynamic AMOLED 2X",
      resolution: "2960 x 1848",
      processor: "Snapdragon 8 Gen 2",
      ram: "12GB",
      storage: "256GB",
      battery: "11200mAh",
      os: "Android 13"
    },
    features: ["S Pen inclus", "5G", "Déverrouillage facial", "Charge rapide 45W", "Résistant à l'eau IP68"],
    colors: ["Graphite", "Beige"]
  },

  // === AUDIO SAMSUNG ===
  {
    id: "electronics-010",
    name: "Samsung Galaxy Buds2 Pro",
    name_kr: "삼성 갤럭시 버즈2 프로",
    description: "Écouteurs sans fil avec réduction de bruit active, son Hi-Fi 24-bit, charge rapide, résistant à l'eau IPX7.",
    type: "electronics",
    category: "TV & Audio",
    subcategory: "Audio",
    brand: "Samsung",
    model: "SM-R510",
    price: 250000,
    inStock: true,
    stockQuantity: 40,
    images: ["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400"],
    powerConsumption: 2,
    warrantyYears: 1,
    specifications: {
      drivers: "2-way (11mm + 6.5mm)",
      codec: "Samsung Seamless Codec",
      battery: "61mAh (écouteurs) + 515mAh (étui)",
      autonomy: "5h + 18h (étui)",
      connectivity: "Bluetooth 5.3"
    },
    features: ["Réduction de bruit active", "Son Hi-Fi 24-bit", "Charge rapide", "Résistant à l'eau IPX7", "Spatial Audio"],
    colors: ["Graphite", "White", "Bora Purple"]
  },

  // === RÉFRIGÉRATEURS LG ===
  {
    id: "electronics-011",
    name: "LG InstaView Door-in-Door 4 Portes 615L",
    name_kr: "LG 인스타뷰 도어인도어 4도어 615L",
    description: "Réfrigérateur 4 portes 615L avec technologie InstaView, Door-in-Door, compresseur Inverter Linear, classe énergétique A+++.",
    type: "appliance",
    category: "Gros Électroménager",
    subcategory: "Réfrigérateurs",
    brand: "LG",
    model: "GSJ961MCAA",
    price: 2800000,
    inStock: true,
    stockQuantity: 5,
    images: ["https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400"],
    powerConsumption: 180,
    energyRating: "A+++",
    warrantyYears: 2,
    specifications: {
      capacity: "615L",
      doors: "4 portes",
      compressor: "Inverter Linear",
      technology: "InstaView, Door-in-Door",
      dimensions: "91.2 x 73.7 x 185.5 cm"
    },
    features: ["InstaView", "Door-in-Door", "Compartiment fraîcheur", "Filtre à eau", "Éclairage LED"],
    colors: ["Inox", "Noir Inox"]
  },
  {
    id: "electronics-012",
    name: "LG Side-by-Side 2 Portes 680L",
    name_kr: "LG 사이드바이사이드 2도어 680L",
    description: "Réfrigérateur Side-by-Side 2 portes 680L avec distributeur d'eau et glace, compresseur Inverter, classe énergétique A++.",
    type: "appliance",
    category: "Gros Électroménager",
    subcategory: "Réfrigérateurs",
    brand: "LG",
    model: "GSX961MCAA",
    price: 2200000,
    inStock: true,
    stockQuantity: 8,
    images: ["https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400"],
    powerConsumption: 200,
    energyRating: "A++",
    warrantyYears: 2,
    specifications: {
      capacity: "680L",
      doors: "2 portes Side-by-Side",
      compressor: "Inverter",
      technology: "Distributeur d'eau et glace",
      dimensions: "91.2 x 73.7 x 185.5 cm"
    },
    features: ["Distributeur d'eau et glace", "Compartiment fraîcheur", "Filtre à eau", "Éclairage LED", "Contrôle électronique"],
    colors: ["Inox", "Noir Inox"]
  },

  // === LAVE-LINGE LG ===
  {
    id: "electronics-013",
    name: "LG AI DD F4V9RWP2E Lave-linge 9kg",
    name_kr: "LG AI DD F4V9RWP2E 세탁기 9kg",
    description: "Lave-linge 9kg avec technologie AI DD (Direct Drive), moteur Inverter, 6 Motion, classe énergétique A+++.",
    type: "appliance",
    category: "Gros Électroménager",
    subcategory: "Lave-linge",
    brand: "LG",
    model: "F4V9RWP2E",
    price: 1200000,
    inStock: true,
    stockQuantity: 12,
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    powerConsumption: 1200,
    energyRating: "A+++",
    warrantyYears: 2,
    specifications: {
      capacity: "9kg",
      technology: "AI DD (Direct Drive)",
      motor: "Inverter",
      programs: "14 programmes",
      dimensions: "60 x 55 x 85 cm"
    },
    features: ["AI DD", "6 Motion", "Vapeur", "Allergie Care", "SmartThinQ"],
    colors: ["Blanc", "Inox"]
  },
  {
    id: "electronics-014",
    name: "LG TwinWash F2J5WN2W Lave-linge 8kg",
    name_kr: "LG 트윈워시 F2J5WN2W 세탁기 8kg",
    description: "Lave-linge 8kg avec technologie TwinWash, moteur Inverter, 6 Motion, classe énergétique A+++.",
    type: "appliance",
    category: "Gros Électroménager",
    subcategory: "Lave-linge",
    brand: "LG",
    model: "F2J5WN2W",
    price: 1000000,
    inStock: true,
    stockQuantity: 15,
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    powerConsumption: 1100,
    energyRating: "A+++",
    warrantyYears: 2,
    specifications: {
      capacity: "8kg",
      technology: "TwinWash",
      motor: "Inverter",
      programs: "12 programmes",
      dimensions: "60 x 55 x 85 cm"
    },
    features: ["TwinWash", "6 Motion", "Vapeur", "Allergie Care", "SmartThinQ"],
    colors: ["Blanc", "Inox"]
  },

  // === SÉCHE-LINGE LG ===
  {
    id: "electronics-015",
    name: "LG Heat Pump T9DP2S Sèche-linge 9kg",
    name_kr: "LG 히트펌프 T9DP2S 건조기 9kg",
    description: "Sèche-linge 9kg avec technologie Heat Pump, moteur Inverter, classe énergétique A+++, réservoir d'eau amovible.",
    type: "appliance",
    category: "Gros Électroménager",
    subcategory: "Sèche-linge",
    brand: "LG",
    model: "T9DP2S",
    price: 1400000,
    inStock: true,
    stockQuantity: 8,
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    powerConsumption: 800,
    energyRating: "A+++",
    warrantyYears: 2,
    specifications: {
      capacity: "9kg",
      technology: "Heat Pump",
      motor: "Inverter",
      programs: "12 programmes",
      dimensions: "60 x 55 x 85 cm"
    },
    features: ["Heat Pump", "Réservoir d'eau amovible", "Allergie Care", "SmartThinQ", "Vapeur"],
    colors: ["Blanc", "Inox"]
  },

  // === LAVE-VAISSELLE LG ===
  {
    id: "electronics-016",
    name: "LG QuadWash DFB325HS Lave-vaisselle 14 couverts",
    name_kr: "LG 쿼드워시 DFB325HS 식기세척기 14인용",
    description: "Lave-vaisselle 14 couverts avec technologie QuadWash, moteur Inverter, classe énergétique A+++, programme rapide 30min.",
    type: "appliance",
    category: "Gros Électroménager",
    subcategory: "Lave-vaisselle",
    brand: "LG",
    model: "DFB325HS",
    price: 800000,
    inStock: true,
    stockQuantity: 10,
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    powerConsumption: 1800,
    energyRating: "A+++",
    warrantyYears: 2,
    specifications: {
      capacity: "14 couverts",
      technology: "QuadWash",
      motor: "Inverter",
      programs: "8 programmes",
      dimensions: "60 x 55 x 85 cm"
    },
    features: ["QuadWash", "Programme rapide 30min", "Vapeur", "SmartThinQ", "Auto Door"],
    colors: ["Blanc", "Inox"]
  },

  // === FOUR MICRO-ONDES LG ===
  {
    id: "electronics-017",
    name: "LG NeoChef MS23K3513AW Micro-ondes 23L",
    name_kr: "LG 네오셰프 MS23K3513AW 전자레인지 23L",
    description: "Four micro-ondes 23L avec technologie NeoChef, 10 niveaux de puissance, 8 programmes automatiques, classe énergétique A.",
    type: "appliance",
    category: "Petit Électroménager",
    subcategory: "Micro-ondes",
    brand: "LG",
    model: "MS23K3513AW",
    price: 180000,
    inStock: true,
    stockQuantity: 20,
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    powerConsumption: 1000,
    energyRating: "A",
    warrantyYears: 2,
    specifications: {
      capacity: "23L",
      technology: "NeoChef",
      power: "1000W",
      programs: "8 programmes automatiques",
      dimensions: "48.2 x 30.8 x 35.8 cm"
    },
    features: ["NeoChef", "10 niveaux de puissance", "8 programmes automatiques", "Minuterie", "Décongélation"],
    colors: ["Blanc", "Inox"]
  },

  // === ASPIRATEUR SAMSUNG ===
  {
    id: "electronics-018",
    name: "Samsung Jet 90 Complete Aspirateur sans fil",
    name_kr: "삼성 제트 90 컴플리트 무선 청소기",
    description: "Aspirateur sans fil avec technologie Jet Cyclone, batterie 60min, puissance 200W, filtre HEPA, classe énergétique A.",
    type: "appliance",
    category: "Petit Électroménager",
    subcategory: "Aspirateurs",
    brand: "Samsung",
    model: "VS20T7031T4",
    price: 350000,
    inStock: true,
    stockQuantity: 25,
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    powerConsumption: 200,
    energyRating: "A",
    warrantyYears: 2,
    specifications: {
      technology: "Jet Cyclone",
      power: "200W",
      battery: "60min",
      filter: "HEPA",
      weight: "2.7kg"
    },
    features: ["Jet Cyclone", "Batterie 60min", "Filtre HEPA", "Charge rapide", "Accessoires multiples"],
    colors: ["Noir", "Rouge"]
  },

  // === ROBOT ASPIRATEUR SAMSUNG ===
  {
    id: "electronics-019",
    name: "Samsung Jet Bot AI+ Robot aspirateur",
    name_kr: "삼성 제트봇 AI+ 로봇 청소기",
    description: "Robot aspirateur avec IA, technologie Jet Cyclone, caméra 3D, navigation intelligente, classe énergétique A.",
    type: "appliance",
    category: "Petit Électroménager",
    subcategory: "Robots aspirateurs",
    brand: "Samsung",
    model: "VR30T85513W",
    price: 800000,
    inStock: true,
    stockQuantity: 12,
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    powerConsumption: 30,
    energyRating: "A",
    warrantyYears: 2,
    specifications: {
      technology: "Jet Cyclone + IA",
      navigation: "Caméra 3D",
      battery: "90min",
      filter: "HEPA",
      dimensions: "35.3 x 35.3 x 9.6 cm"
    },
    features: ["IA", "Caméra 3D", "Navigation intelligente", "Jet Cyclone", "SmartThings"],
    colors: ["Blanc", "Noir"]
  },

  // === CLIMATISEUR LG ===
  {
    id: "electronics-020",
    name: "LG Dual Cool Inverter Climatiseur 12000 BTU",
    name_kr: "LG 듀얼쿨 인버터 에어컨 12000 BTU",
    description: "Climatiseur 12000 BTU avec technologie Dual Cool Inverter, classe énergétique A+++, Wi-Fi, SmartThinQ.",
    type: "appliance",
    category: "Gros Électroménager",
    subcategory: "Climatiseurs",
    brand: "LG",
    model: "S12ET",
    price: 1800000,
    inStock: true,
    stockQuantity: 6,
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    powerConsumption: 1200,
    energyRating: "A+++",
    warrantyYears: 2,
    specifications: {
      capacity: "12000 BTU",
      technology: "Dual Cool Inverter",
      efficiency: "A+++",
      connectivity: "Wi-Fi",
      dimensions: "84.5 x 29.5 x 21.5 cm"
    },
    features: ["Dual Cool Inverter", "Wi-Fi", "SmartThinQ", "Filtre anti-allergène", "Mode éco"],
    colors: ["Blanc"]
  }
];
