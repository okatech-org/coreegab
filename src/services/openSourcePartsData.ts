// Données open source de pièces automobiles Hyundai et Kia
// Basées sur des informations publiques et des standards industriels

export interface OpenSourcePart {
  partNumber: string;
  oemNumber?: string;
  name: string;
  description?: string;
  brand: string;
  category: string;
  priceEstimate?: number; // en KRW
  compatibleVehicles: string[];
  specifications?: Record<string, any>;
}

export const OPEN_SOURCE_PARTS: OpenSourcePart[] = [
  // Filtres
  {
    partNumber: '28113-2E100',
    oemNumber: '28113-2E000',
    name: 'Filtre à air',
    description: 'Filtre à air pour moteurs 2.0L et 2.4L',
    brand: 'Hyundai Genuine',
    category: 'Filtres',
    priceEstimate: 15000,
    compatibleVehicles: ['Hyundai Tucson 2019-2021', 'Hyundai Elantra 2020-2023', 'Kia Sportage 2020-2022'],
    specifications: {
      material: 'Papier filtrant',
      efficiency: '99.5%',
      dimensions: '200x150x30mm'
    }
  },
  {
    partNumber: '26300-35505',
    oemNumber: '26300-35504',
    name: 'Filtre à huile',
    description: 'Filtre à huile standard haute qualité',
    brand: 'Kia Genuine',
    category: 'Filtres',
    priceEstimate: 8000,
    compatibleVehicles: ['Kia Sportage 2020-2022', 'Kia Sorento 2020-2023', 'Hyundai Tucson 2019-2021'],
    specifications: {
      threadSize: 'M20x1.5',
      bypassPressure: '8-12 PSI',
      efficiency: '99.9%'
    }
  },
  {
    partNumber: '28113-3E000',
    name: 'Filtre à air moteur',
    description: 'Filtre à air pour moteurs 2.5L',
    brand: 'Hyundai Mobis',
    category: 'Filtres',
    priceEstimate: 18000,
    compatibleVehicles: ['Hyundai Tucson 2022-2024', 'Hyundai Sonata 2020-2024', 'Kia Sportage 2023-2024'],
    specifications: {
      material: 'Papier filtrant renforcé',
      efficiency: '99.7%',
      dimensions: '220x160x35mm'
    }
  },

  // Système de freinage
  {
    partNumber: '58101-D3A01',
    oemNumber: '58101-D3A00',
    name: 'Plaquettes de frein avant',
    description: 'Plaquettes de frein avant céramique haute performance',
    brand: 'Hyundai Mobis',
    category: 'Freinage',
    priceEstimate: 45000,
    compatibleVehicles: ['Hyundai Tucson 2019-2021', 'Hyundai Elantra 2020-2023'],
    specifications: {
      material: 'Céramique',
      thickness: '12mm',
      temperatureRange: '-40°C à +600°C'
    }
  },
  {
    partNumber: '58101-D4A01',
    name: 'Plaquettes de frein avant',
    description: 'Plaquettes de frein avant pour véhicules récents',
    brand: 'Hyundai Genuine',
    category: 'Freinage',
    priceEstimate: 52000,
    compatibleVehicles: ['Hyundai Tucson 2022-2024', 'Hyundai Sonata 2020-2024'],
    specifications: {
      material: 'Céramique renforcée',
      thickness: '13mm',
      temperatureRange: '-40°C à +650°C'
    }
  },
  {
    partNumber: '58201-D3A01',
    name: 'Plaquettes de frein arrière',
    description: 'Plaquettes de frein arrière',
    brand: 'Hyundai Mobis',
    category: 'Freinage',
    priceEstimate: 38000,
    compatibleVehicles: ['Hyundai Tucson 2019-2021', 'Hyundai Elantra 2020-2023'],
    specifications: {
      material: 'Céramique',
      thickness: '10mm',
      temperatureRange: '-40°C à +550°C'
    }
  },

  // Système d'allumage
  {
    partNumber: '18890-2E000',
    oemNumber: '18890-2E001',
    name: 'Bougies d\'allumage',
    description: 'Bougies d\'allumage iridium longue durée',
    brand: 'NGK',
    category: 'Allumage',
    priceEstimate: 12000,
    compatibleVehicles: ['Hyundai Tucson 2019-2021', 'Hyundai Elantra 2020-2023', 'Kia Sportage 2020-2022'],
    specifications: {
      type: 'Iridium',
      gap: '1.1mm',
      threadSize: 'M14x1.25',
      reach: '19mm'
    }
  },
  {
    partNumber: '18890-3E000',
    name: 'Bougies d\'allumage',
    description: 'Bougies d\'allumage pour moteurs 2.5L',
    brand: 'Denso',
    category: 'Allumage',
    priceEstimate: 15000,
    compatibleVehicles: ['Hyundai Tucson 2022-2024', 'Hyundai Sonata 2020-2024', 'Kia Sportage 2023-2024'],
    specifications: {
      type: 'Iridium TT',
      gap: '1.1mm',
      threadSize: 'M14x1.25',
      reach: '19mm'
    }
  },

  // Système de distribution
  {
    partNumber: '24400-2E000',
    oemNumber: '24400-2E001',
    name: 'Courroie de distribution',
    description: 'Courroie de distribution renforcée',
    brand: 'Gates',
    category: 'Distribution',
    priceEstimate: 35000,
    compatibleVehicles: ['Hyundai Tucson 2019-2021', 'Hyundai Elantra 2020-2023', 'Kia Forte 2019-2023'],
    specifications: {
      material: 'Caoutchouc renforcé',
      teeth: '120',
      width: '25mm',
      length: '1200mm'
    }
  },
  {
    partNumber: '24400-3E000',
    name: 'Courroie de distribution',
    description: 'Courroie de distribution pour moteurs 2.5L',
    brand: 'Gates',
    category: 'Distribution',
    priceEstimate: 42000,
    compatibleVehicles: ['Hyundai Tucson 2022-2024', 'Hyundai Sonata 2020-2024'],
    specifications: {
      material: 'Caoutchouc renforcé',
      teeth: '130',
      width: '25mm',
      length: '1300mm'
    }
  },

  // Système de refroidissement
  {
    partNumber: '21100-2E000',
    oemNumber: '21100-2E001',
    name: 'Pompe à eau',
    description: 'Pompe à eau avec joint étanche',
    brand: 'Hyundai Genuine',
    category: 'Refroidissement',
    priceEstimate: 28000,
    compatibleVehicles: ['Hyundai Tucson 2019-2021', 'Hyundai Santa Fe 2019-2023', 'Kia Sportage 2020-2022'],
    specifications: {
      material: 'Aluminium',
      impeller: 'Plastique renforcé',
      bearing: 'Roulement étanche'
    }
  },
  {
    partNumber: '21100-3E000',
    name: 'Pompe à eau',
    description: 'Pompe à eau pour moteurs 2.5L',
    brand: 'Hyundai Genuine',
    category: 'Refroidissement',
    priceEstimate: 32000,
    compatibleVehicles: ['Hyundai Tucson 2022-2024', 'Hyundai Sonata 2020-2024'],
    specifications: {
      material: 'Aluminium',
      impeller: 'Plastique renforcé',
      bearing: 'Roulement étanche haute performance'
    }
  },

  // Système électrique
  {
    partNumber: '37300-2E000',
    oemNumber: '37300-2E001',
    name: 'Alternateur',
    description: 'Alternateur 120A haute performance',
    brand: 'Denso',
    category: 'Électrique',
    priceEstimate: 65000,
    compatibleVehicles: ['Hyundai Tucson 2022-2024', 'Hyundai Sonata 2020-2024', 'Kia Sportage 2023-2024'],
    specifications: {
      output: '120A',
      voltage: '12V',
      weight: '4.2kg'
    }
  },
  {
    partNumber: '31100-2E000',
    oemNumber: '31100-2E001',
    name: 'Démarreur',
    description: 'Démarreur haute performance',
    brand: 'Mitsubishi',
    category: 'Électrique',
    priceEstimate: 42000,
    compatibleVehicles: ['Hyundai Elantra 2020-2023', 'Hyundai Sonata 2020-2024', 'Kia Sportage 2020-2022'],
    specifications: {
      power: '1.4kW',
      voltage: '12V',
      weight: '2.8kg'
    }
  },
  {
    partNumber: 'BAT-2E000',
    oemNumber: 'BAT-2E001',
    name: 'Batterie',
    description: 'Batterie 12V 60Ah maintenance-free',
    brand: 'Varta',
    category: 'Électrique',
    priceEstimate: 18000,
    compatibleVehicles: ['Tous véhicules Hyundai/Kia 2020+'],
    specifications: {
      capacity: '60Ah',
      voltage: '12V',
      cca: '540A',
      weight: '14.5kg'
    }
  },

  // Éclairage
  {
    partNumber: '92101-2E000',
    oemNumber: '92101-2E001',
    name: 'Phare avant LED',
    description: 'Phare avant LED avec DRL intégré',
    brand: 'Hyundai Genuine',
    category: 'Éclairage',
    priceEstimate: 85000,
    compatibleVehicles: ['Hyundai Tucson 2022-2024', 'Hyundai Sonata 2020-2024', 'Kia Sportage 2023-2024'],
    specifications: {
      type: 'LED',
      color: 'Blanc 6000K',
      power: '35W',
      lifespan: '50000h'
    }
  },
  {
    partNumber: '92111-2E000',
    name: 'Feu arrière LED',
    description: 'Feu arrière LED avec clignotant',
    brand: 'Hyundai Genuine',
    category: 'Éclairage',
    priceEstimate: 45000,
    compatibleVehicles: ['Hyundai Tucson 2022-2024', 'Hyundai Sonata 2020-2024'],
    specifications: {
      type: 'LED',
      color: 'Rouge',
      power: '15W',
      lifespan: '50000h'
    }
  },

  // Suspension
  {
    partNumber: '54500-2E000',
    name: 'Amortisseur avant',
    description: 'Amortisseur avant hydraulique',
    brand: 'Sachs',
    category: 'Suspension',
    priceEstimate: 75000,
    compatibleVehicles: ['Hyundai Tucson 2019-2021', 'Hyundai Elantra 2020-2023'],
    specifications: {
      type: 'Hydraulique',
      stroke: '150mm',
      diameter: '45mm'
    }
  },
  {
    partNumber: '54500-3E000',
    name: 'Amortisseur avant',
    description: 'Amortisseur avant pour véhicules récents',
    brand: 'Sachs',
    category: 'Suspension',
    priceEstimate: 85000,
    compatibleVehicles: ['Hyundai Tucson 2022-2024', 'Hyundai Sonata 2020-2024'],
    specifications: {
      type: 'Hydraulique haute performance',
      stroke: '160mm',
      diameter: '50mm'
    }
  },

  // Transmission
  {
    partNumber: '23200-2E000',
    name: 'Embrayage kit',
    description: 'Kit embrayage complet',
    brand: 'Luk',
    category: 'Transmission',
    priceEstimate: 120000,
    compatibleVehicles: ['Hyundai Elantra 2020-2023', 'Kia Forte 2019-2023'],
    specifications: {
      type: 'Embrayage à sec',
      diameter: '240mm',
      material: 'Céramique'
    }
  },

  // Climatisation
  {
    partNumber: '97133-2E000',
    name: 'Filtre habitacle',
    description: 'Filtre habitacle avec charbon actif',
    brand: 'Hyundai Genuine',
    category: 'Climatisation',
    priceEstimate: 12000,
    compatibleVehicles: ['Tous véhicules Hyundai/Kia 2020+'],
    specifications: {
      material: 'Charbon actif',
      efficiency: '99.9%',
      lifespan: '15000km'
    }
  },

  // Huiles et fluides
  {
    partNumber: 'OIL-5W30',
    name: 'Huile moteur 5W-30',
    description: 'Huile moteur synthétique 5W-30',
    brand: 'Shell',
    category: 'Lubrifiants',
    priceEstimate: 25000,
    compatibleVehicles: ['Tous véhicules Hyundai/Kia 2020+'],
    specifications: {
      viscosity: '5W-30',
      type: 'Synthétique',
      volume: '4L',
      standard: 'API SN/GF-5'
    }
  },
  {
    partNumber: 'COOLANT-G12',
    name: 'Liquide de refroidissement',
    description: 'Liquide de refroidissement G12+',
    brand: 'Hyundai Genuine',
    category: 'Lubrifiants',
    priceEstimate: 15000,
    compatibleVehicles: ['Tous véhicules Hyundai/Kia 2020+'],
    specifications: {
      type: 'G12+',
      color: 'Rose',
      volume: '5L',
      temperature: '-37°C à +129°C'
    }
  }
];

// Fonction pour obtenir les catégories uniques
export const getCategories = (): string[] => {
  return [...new Set(OPEN_SOURCE_PARTS.map(part => part.category))].sort();
};

// Fonction pour obtenir les marques uniques
export const getBrands = (): string[] => {
  return [...new Set(OPEN_SOURCE_PARTS.map(part => part.brand))].sort();
};

// Fonction pour filtrer les pièces
export const filterParts = (filters: {
  category?: string;
  brand?: string;
  searchTerm?: string;
}): OpenSourcePart[] => {
  return OPEN_SOURCE_PARTS.filter(part => {
    if (filters.category && part.category !== filters.category) return false;
    if (filters.brand && part.brand !== filters.brand) return false;
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        part.name.toLowerCase().includes(searchLower) ||
        part.partNumber.toLowerCase().includes(searchLower) ||
        part.brand.toLowerCase().includes(searchLower) ||
        part.description?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });
};
