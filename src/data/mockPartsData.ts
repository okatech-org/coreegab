// src/data/mockPartsData.ts

export interface MockPart {
  id: string;
  name: string;
  name_kr?: string;
  description: string;
  category: string;
  partNumber: string;
  oemNumber?: string;
  compatibleVehicles: string[]; // IDs des véhicules compatibles
  compatibleModels: string[]; // Noms des modèles compatibles
  isGenuine: boolean;
  warrantyMonths: number;
  price: number; // Prix en KRW
  inStock: boolean;
  stockQuantity: number;
  images: string[];
}

export const mockParts: MockPart[] = [
  // === PIÈCES MOTEUR ===
  {
    id: "part-001",
    name: "Filtre à huile Hyundai/Kia",
    name_kr: "현대/기아 오일 필터",
    description: "Filtre à huile d'origine pour moteurs essence 1.6L et 2.0L. Compatible avec la plupart des modèles Hyundai et Kia récents.",
    category: "Moteur",
    partNumber: "26300-35505",
    oemNumber: "26300-35505",
    compatibleVehicles: ["1", "2", "3", "4", "5", "6"], // Tucson, Sportage, Santa Fe, Sorento, Elantra, K5
    compatibleModels: ["Tucson", "Sportage", "Santa Fe", "Sorento", "Elantra", "K5"],
    isGenuine: true,
    warrantyMonths: 12,
    price: 15000,
    inStock: true,
    stockQuantity: 50,
    images: ["https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400"]
  },
  {
    id: "part-002",
    name: "Courroie de distribution Gates",
    name_kr: "게이츠 타이밍 벨트",
    description: "Courroie de distribution haute performance pour moteurs diesel 2.0L CRDi. Durée de vie prolongée.",
    category: "Moteur",
    partNumber: "24312-2A100",
    oemNumber: "24312-2A100",
    compatibleVehicles: ["1", "3", "4"], // Tucson, Santa Fe, Sorento
    compatibleModels: ["Tucson", "Santa Fe", "Sorento"],
    isGenuine: false,
    warrantyMonths: 24,
    price: 85000,
    inStock: true,
    stockQuantity: 15,
    images: ["https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400"]
  },
  {
    id: "part-003",
    name: "Bougie d'allumage NGK Iridium",
    name_kr: "NGK 이리듐 점화 플러그",
    description: "Bougies d'allumage iridium haute performance. Set de 4 pièces pour moteurs essence.",
    category: "Moteur",
    partNumber: "18855-10062",
    compatibleVehicles: ["2", "5", "6"], // Sportage, Elantra, K5
    compatibleModels: ["Sportage", "Elantra", "K5"],
    isGenuine: false,
    warrantyMonths: 36,
    price: 120000,
    inStock: true,
    stockQuantity: 25,
    images: ["https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400"]
  },

  // === PIÈCES FREINAGE ===
  {
    id: "part-004",
    name: "Plaquettes de frein avant Hyundai Mobis",
    name_kr: "현대모비스 앞 브레이크 패드",
    description: "Plaquettes de frein avant d'origine Hyundai Mobis. Faible niveau de bruit et longue durée de vie.",
    category: "Freinage",
    partNumber: "58101-3SA00",
    oemNumber: "58101-3SA00",
    compatibleVehicles: ["1", "3"], // Tucson, Santa Fe
    compatibleModels: ["Tucson", "Santa Fe"],
    isGenuine: true,
    warrantyMonths: 24,
    price: 95000,
    inStock: true,
    stockQuantity: 30,
    images: ["https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400"]
  },
  {
    id: "part-005",
    name: "Disques de frein avant Brembo",
    name_kr: "브렘보 앞 브레이크 디스크",
    description: "Disques de frein ventilés haute performance. Vendus par paire. Diamètre 320mm.",
    category: "Freinage",
    partNumber: "51712-3N000",
    compatibleVehicles: ["3", "4", "7"], // Santa Fe, Sorento, Genesis GV70
    compatibleModels: ["Santa Fe", "Sorento", "Genesis GV70"],
    isGenuine: false,
    warrantyMonths: 36,
    price: 280000,
    inStock: true,
    stockQuantity: 10,
    images: ["https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400"]
  },

  // === PIÈCES SUSPENSION ===
  {
    id: "part-006",
    name: "Amortisseur avant Monroe",
    name_kr: "먼로 앞 쇼크 업소버",
    description: "Amortisseur avant à gaz Monroe. Confort et tenue de route optimisés. Vendu à l'unité.",
    category: "Suspension",
    partNumber: "54650-2S000",
    compatibleVehicles: ["1", "2"], // Tucson, Sportage
    compatibleModels: ["Tucson", "Sportage"],
    isGenuine: false,
    warrantyMonths: 24,
    price: 145000,
    inStock: true,
    stockQuantity: 20,
    images: ["https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400"]
  },
  {
    id: "part-007",
    name: "Ressorts de suspension Eibach Pro-Kit",
    name_kr: "아이바흐 프로킷 스프링",
    description: "Kit de ressorts sport abaissant le véhicule de 25mm. Améliore la tenue de route et l'esthétique.",
    category: "Suspension",
    partNumber: "E10-42-051-01-22",
    compatibleVehicles: ["5", "6"], // Elantra, K5
    compatibleModels: ["Elantra", "K5"],
    isGenuine: false,
    warrantyMonths: 60,
    price: 320000,
    inStock: false,
    stockQuantity: 0,
    images: ["https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400"]
  },

  // === PIÈCES TRANSMISSION ===
  {
    id: "part-008",
    name: "Kit d'embrayage LuK",
    name_kr: "루크 클러치 키트",
    description: "Kit d'embrayage complet incluant disque, plateau et butée. Pour boîte manuelle 6 vitesses.",
    category: "Transmission",
    partNumber: "41100-39500",
    compatibleVehicles: ["1", "2", "3"], // Tucson, Sportage, Santa Fe
    compatibleModels: ["Tucson", "Sportage", "Santa Fe"],
    isGenuine: false,
    warrantyMonths: 24,
    price: 480000,
    inStock: true,
    stockQuantity: 5,
    images: ["https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400"]
  },

  // === PIÈCES ÉLECTRIQUES ===
  {
    id: "part-009",
    name: "Batterie Delkor AGM 80Ah",
    name_kr: "델코 AGM 배터리 80Ah",
    description: "Batterie AGM haute performance avec technologie Start/Stop. 80Ah, 800CCA.",
    category: "Électrique",
    partNumber: "37110-3V100",
    compatibleVehicles: ["1", "2", "3", "4", "7", "8"], // La plupart des modèles
    compatibleModels: ["Tucson", "Sportage", "Santa Fe", "Sorento", "Genesis GV70", "Genesis G80"],
    isGenuine: true,
    warrantyMonths: 36,
    price: 280000,
    inStock: true,
    stockQuantity: 15,
    images: ["https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400"]
  },
  {
    id: "part-010",
    name: "Alternateur Valeo 150A",
    name_kr: "발레오 알터네이터 150A",
    description: "Alternateur haute capacité 150A pour véhicules avec équipements électriques nombreux.",
    category: "Électrique",
    partNumber: "37300-2G500",
    compatibleVehicles: ["3", "4", "7", "8"], // Santa Fe, Sorento, Genesis
    compatibleModels: ["Santa Fe", "Sorento", "Genesis GV70", "Genesis G80"],
    isGenuine: false,
    warrantyMonths: 24,
    price: 420000,
    inStock: true,
    stockQuantity: 8,
    images: ["https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400"]
  },

  // === FILTRES ===
  {
    id: "part-011",
    name: "Filtre à air K&N Performance",
    name_kr: "K&N 고성능 에어필터",
    description: "Filtre à air haute performance réutilisable. Améliore le flux d'air et la puissance.",
    category: "Filtres",
    partNumber: "28113-3X000",
    compatibleVehicles: ["1", "2", "3", "4"], // SUVs
    compatibleModels: ["Tucson", "Sportage", "Santa Fe", "Sorento"],
    isGenuine: false,
    warrantyMonths: 120,
    price: 85000,
    inStock: true,
    stockQuantity: 20,
    images: ["https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400"]
  },
  {
    id: "part-012",
    name: "Filtre habitacle charbon actif",
    name_kr: "활성탄 캐빈 필터",
    description: "Filtre habitacle avec charbon actif pour éliminer les odeurs et purifier l'air de l'habitacle.",
    category: "Filtres",
    partNumber: "97133-2E210",
    compatibleVehicles: ["1", "2", "3", "4", "5", "6"], // Tous sauf Genesis
    compatibleModels: ["Tucson", "Sportage", "Santa Fe", "Sorento", "Elantra", "K5"],
    isGenuine: true,
    warrantyMonths: 12,
    price: 35000,
    inStock: true,
    stockQuantity: 40,
    images: ["https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400"]
  },

  // === CARROSSERIE ===
  {
    id: "part-013",
    name: "Rétroviseur extérieur gauche",
    name_kr: "좌측 사이드 미러",
    description: "Rétroviseur extérieur gauche avec clignotant intégré et dégivrage. Couleur à peindre.",
    category: "Carrosserie",
    partNumber: "87610-2S550",
    compatibleVehicles: ["1", "2"], // Tucson, Sportage
    compatibleModels: ["Tucson", "Sportage"],
    isGenuine: true,
    warrantyMonths: 24,
    price: 180000,
    inStock: true,
    stockQuantity: 5,
    images: ["https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400"]
  },
  {
    id: "part-014",
    name: "Pare-chocs avant",
    name_kr: "앞 범퍼",
    description: "Pare-chocs avant d'origine, livré apprêté prêt à peindre. Capteurs de stationnement non inclus.",
    category: "Carrosserie",
    partNumber: "86511-3S000",
    compatibleVehicles: ["3"], // Santa Fe
    compatibleModels: ["Santa Fe"],
    isGenuine: true,
    warrantyMonths: 12,
    price: 580000,
    inStock: false,
    stockQuantity: 0,
    images: ["https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400"]
  },

  // === ÉCLAIRAGE ===
  {
    id: "part-015",
    name: "Phare avant LED gauche",
    name_kr: "좌측 LED 헤드램프",
    description: "Phare avant full LED avec feux de jour intégrés. Technology Matrix LED adaptative.",
    category: "Éclairage",
    partNumber: "92101-3S500",
    compatibleVehicles: ["3", "4", "7"], // Modèles haut de gamme
    compatibleModels: ["Santa Fe", "Sorento", "Genesis GV70"],
    isGenuine: true,
    warrantyMonths: 36,
    price: 1200000,
    inStock: true,
    stockQuantity: 3,
    images: ["https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400"]
  },
  {
    id: "part-016",
    name: "Ampoules LED H7 Philips",
    name_kr: "필립스 H7 LED 전구",
    description: "Kit d'ampoules LED H7 Philips Ultinon. 200% plus de luminosité, blanc pur 6000K.",
    category: "Éclairage",
    partNumber: "PH-11972ULX2",
    compatibleVehicles: ["1", "2", "5", "6"], // Modèles avec phares halogènes
    compatibleModels: ["Tucson", "Sportage", "Elantra", "K5"],
    isGenuine: false,
    warrantyMonths: 24,
    price: 120000,
    inStock: true,
    stockQuantity: 25,
    images: ["https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400"]
  },

  // === INTÉRIEUR ===
  {
    id: "part-017",
    name: "Tapis de sol caoutchouc WeatherTech",
    name_kr: "웨더텍 고무 바닥 매트",
    description: "Tapis de sol en caoutchouc haute qualité, protection maximale contre l'eau et la saleté. Set complet.",
    category: "Intérieur",
    partNumber: "WT-444751",
    compatibleVehicles: ["1", "3"], // Tucson, Santa Fe
    compatibleModels: ["Tucson", "Santa Fe"],
    isGenuine: false,
    warrantyMonths: 60,
    price: 180000,
    inStock: true,
    stockQuantity: 15,
    images: ["https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400"]
  },
  {
    id: "part-018",
    name: "Housse de siège cuir premium",
    name_kr: "프리미엄 가죽 시트 커버",
    description: "Housses de sièges en cuir véritable, design sur mesure. Installation facile, set complet pour 5 places.",
    category: "Intérieur",
    partNumber: "SC-Premium-5",
    compatibleVehicles: ["1", "2", "3", "4"], // SUVs
    compatibleModels: ["Tucson", "Sportage", "Santa Fe", "Sorento"],
    isGenuine: false,
    warrantyMonths: 24,
    price: 680000,
    inStock: true,
    stockQuantity: 8,
    images: ["https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400"]
  },

  // === ACCESSOIRES ===
  {
    id: "part-019",
    name: "Barres de toit Thule",
    name_kr: "툴레 루프 레일",
    description: "Barres de toit universelles Thule avec système de fixation rapide. Charge max 75kg.",
    category: "Accessoires",
    partNumber: "TH-7104",
    compatibleVehicles: ["1", "2", "3", "4"], // SUVs
    compatibleModels: ["Tucson", "Sportage", "Santa Fe", "Sorento"],
    isGenuine: false,
    warrantyMonths: 60,
    price: 320000,
    inStock: true,
    stockQuantity: 10,
    images: ["https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400"]
  },
  {
    id: "part-020",
    name: "Attelage remorque Westfalia",
    name_kr: "웨스트팔리아 트레일러 히치",
    description: "Attelage de remorque amovible avec faisceau électrique 13 broches. Capacité de remorquage 2000kg.",
    category: "Accessoires",
    partNumber: "WF-305460",
    compatibleVehicles: ["3", "4"], // Santa Fe, Sorento
    compatibleModels: ["Santa Fe", "Sorento"],
    isGenuine: false,
    warrantyMonths: 36,
    price: 580000,
    inStock: false,
    stockQuantity: 0,
    images: ["https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400"]
  }
];
