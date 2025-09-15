/**
 * Service de données de véhicules coréens en open source
 * Données basées sur les modèles populaires de Hyundai, Kia et Genesis
 */

export interface KoreanVehicle {
  id: string;
  name: string;
  brand: 'Hyundai' | 'Kia' | 'Genesis';
  model: string;
  year: number;
  category: 'vehicles';
  price_krw: number;
  image_url: string;
  description: string;
  specifications: {
    engine: string;
    transmission: string;
    fuelType: string;
    power: string;
    torque: string;
    acceleration: string;
    topSpeed: string;
    fuelConsumption: string;
    seating: number;
    drivetrain: string;
  };
  features: string[];
  in_stock: boolean;
  stock_quantity?: number;
  part_number?: string;
}

// Données de véhicules coréens populaires
export const koreanVehicles: KoreanVehicle[] = [
  // Hyundai
  {
    id: 'hyundai-tucson-2024',
    name: 'Hyundai Tucson 2024',
    brand: 'Hyundai',
    model: 'Tucson',
    year: 2024,
    category: 'vehicles',
    price_krw: 35000000,
    image_url: '/src/assets/hyundai-tucson.jpg',
    description: 'SUV compact moderne avec design audacieux et technologies avancées. Parfait pour les familles urbaines.',
    specifications: {
      engine: '2.5L GDI 4-cylindres',
      transmission: 'Automatique 8 vitesses',
      fuelType: 'Essence',
      power: '190 ch',
      torque: '247 Nm',
      acceleration: '0-100 km/h en 8.8s',
      topSpeed: '200 km/h',
      fuelConsumption: '7.8L/100km',
      seating: 5,
      drivetrain: 'Traction avant / 4WD'
    },
    features: [
      'Système de navigation 10.25"',
      'Caméra de recul',
      'Freinage automatique d\'urgence',
      'Régulateur de vitesse adaptatif',
      'Climatisation automatique',
      'Sièges chauffants',
      'Toit ouvrant panoramique',
      'Système audio premium'
    ],
    in_stock: true,
    stock_quantity: 3
  },
  {
    id: 'hyundai-elantra-2024',
    name: 'Hyundai Elantra 2024',
    brand: 'Hyundai',
    model: 'Elantra',
    year: 2024,
    category: 'vehicles',
    price_krw: 25000000,
    image_url: '/src/assets/hyundai-elantra.jpg',
    description: 'Berline compacte élégante avec un design dynamique et des performances efficaces.',
    specifications: {
      engine: '2.0L MPI 4-cylindres',
      transmission: 'CVT',
      fuelType: 'Essence',
      power: '147 ch',
      torque: '179 Nm',
      acceleration: '0-100 km/h en 9.2s',
      topSpeed: '195 km/h',
      fuelConsumption: '6.2L/100km',
      seating: 5,
      drivetrain: 'Traction avant'
    },
    features: [
      'Écran tactile 8"',
      'Apple CarPlay / Android Auto',
      'Aide au stationnement',
      'Détection d\'angle mort',
      'Climatisation automatique',
      'Volant multifonction',
      'Rétroviseurs électriques',
      'Système de sécurité avancé'
    ],
    in_stock: true,
    stock_quantity: 5
  },
  {
    id: 'hyundai-santa-fe-2024',
    name: 'Hyundai Santa Fe 2024',
    brand: 'Hyundai',
    model: 'Santa Fe',
    year: 2024,
    category: 'vehicles',
    price_krw: 42000000,
    image_url: '/src/assets/hyundai-santa-fe.jpg',
    description: 'SUV 7 places spacieux et confortable, idéal pour les grandes familles.',
    specifications: {
      engine: '2.5L Turbo GDI',
      transmission: 'Automatique 8 vitesses',
      fuelType: 'Essence',
      power: '281 ch',
      torque: '422 Nm',
      acceleration: '0-100 km/h en 7.8s',
      topSpeed: '210 km/h',
      fuelConsumption: '8.5L/100km',
      seating: 7,
      drivetrain: '4WD'
    },
    features: [
      'Écran tactile 12.3"',
      'Système de navigation premium',
      'Caméras 360°',
      'Freinage automatique d\'urgence',
      'Régulateur de vitesse adaptatif',
      'Climatisation tri-zone',
      'Sièges en cuir',
      'Toit ouvrant panoramique',
      'Système audio Harman Kardon'
    ],
    in_stock: true,
    stock_quantity: 2
  },

  // Kia
  {
    id: 'kia-sportage-2024',
    name: 'Kia Sportage 2024',
    brand: 'Kia',
    model: 'Sportage',
    year: 2024,
    category: 'vehicles',
    price_krw: 32000000,
    image_url: '/src/assets/kia-sportage.jpg',
    description: 'SUV compact avec un design moderne et des technologies innovantes.',
    specifications: {
      engine: '2.4L GDI 4-cylindres',
      transmission: 'Automatique 8 vitesses',
      fuelType: 'Essence',
      power: '185 ch',
      torque: '241 Nm',
      acceleration: '0-100 km/h en 8.5s',
      topSpeed: '195 km/h',
      fuelConsumption: '7.5L/100km',
      seating: 5,
      drivetrain: 'Traction avant / 4WD'
    },
    features: [
      'Écran tactile 10.25"',
      'Système de navigation',
      'Caméra de recul',
      'Freinage automatique d\'urgence',
      'Régulateur de vitesse adaptatif',
      'Climatisation automatique',
      'Sièges chauffants',
      'Toit ouvrant',
      'Système audio premium'
    ],
    in_stock: true,
    stock_quantity: 4
  },
  {
    id: 'kia-sorento-2024',
    name: 'Kia Sorento 2024',
    brand: 'Kia',
    model: 'Sorento',
    year: 2024,
    category: 'vehicles',
    price_krw: 38000000,
    image_url: '/src/assets/kia-sorento.jpg',
    description: 'SUV 7 places premium avec un design sophistiqué et des performances exceptionnelles.',
    specifications: {
      engine: '2.5L Turbo GDI',
      transmission: 'Automatique 8 vitesses',
      fuelType: 'Essence',
      power: '281 ch',
      torque: '422 Nm',
      acceleration: '0-100 km/h en 7.5s',
      topSpeed: '205 km/h',
      fuelConsumption: '8.2L/100km',
      seating: 7,
      drivetrain: '4WD'
    },
    features: [
      'Écran tactile 12.3"',
      'Système de navigation premium',
      'Caméras 360°',
      'Freinage automatique d\'urgence',
      'Régulateur de vitesse adaptatif',
      'Climatisation tri-zone',
      'Sièges en cuir Nappa',
      'Toit ouvrant panoramique',
      'Système audio Bose',
      'Éclairage LED'
    ],
    in_stock: true,
    stock_quantity: 3
  },
  {
    id: 'kia-ev6-2024',
    name: 'Kia EV6 2024',
    brand: 'Kia',
    model: 'EV6',
    year: 2024,
    category: 'vehicles',
    price_krw: 45000000,
    image_url: '/src/assets/kia-ev6.jpg',
    description: 'Véhicule électrique révolutionnaire avec une autonomie exceptionnelle et un design futuriste.',
    specifications: {
      engine: 'Moteur électrique',
      transmission: 'Automatique 1 vitesse',
      fuelType: 'Électrique',
      power: '325 ch',
      torque: '605 Nm',
      acceleration: '0-100 km/h en 5.2s',
      topSpeed: '185 km/h',
      fuelConsumption: '18.5 kWh/100km',
      seating: 5,
      drivetrain: '4WD'
    },
    features: [
      'Écran tactile 12.3"',
      'Système de navigation',
      'Recharge rapide 800V',
      'Autonomie 500+ km',
      'Freinage automatique d\'urgence',
      'Régulateur de vitesse adaptatif',
      'Climatisation automatique',
      'Sièges chauffants',
      'Toit ouvrant panoramique',
      'Système audio Meridian'
    ],
    in_stock: true,
    stock_quantity: 2
  },

  // Genesis
  {
    id: 'genesis-gv80-2024',
    name: 'Genesis GV80 2024',
    brand: 'Genesis',
    model: 'GV80',
    year: 2024,
    category: 'vehicles',
    price_krw: 65000000,
    image_url: '/src/assets/genesis-gv80.jpg',
    description: 'SUV de luxe premium avec un raffinement exceptionnel et des technologies de pointe.',
    specifications: {
      engine: '3.5L V6 Turbo',
      transmission: 'Automatique 8 vitesses',
      fuelType: 'Essence',
      power: '375 ch',
      torque: '530 Nm',
      acceleration: '0-100 km/h en 6.8s',
      topSpeed: '220 km/h',
      fuelConsumption: '9.8L/100km',
      seating: 7,
      drivetrain: '4WD'
    },
    features: [
      'Écran tactile 14.5"',
      'Système de navigation premium',
      'Caméras 360°',
      'Freinage automatique d\'urgence',
      'Régulateur de vitesse adaptatif',
      'Climatisation quadri-zone',
      'Sièges en cuir Nappa',
      'Toit ouvrant panoramique',
      'Système audio Lexicon',
      'Éclairage LED adaptatif',
      'Suspension pneumatique'
    ],
    in_stock: true,
    stock_quantity: 1
  },
  {
    id: 'genesis-g90-2024',
    name: 'Genesis G90 2024',
    brand: 'Genesis',
    model: 'G90',
    year: 2024,
    category: 'vehicles',
    price_krw: 75000000,
    image_url: '/src/assets/genesis-g90.jpg',
    description: 'Berline de luxe ultime avec un confort exceptionnel et des performances remarquables.',
    specifications: {
      engine: '3.5L V6 Turbo',
      transmission: 'Automatique 8 vitesses',
      fuelType: 'Essence',
      power: '375 ch',
      torque: '530 Nm',
      acceleration: '0-100 km/h en 6.2s',
      topSpeed: '230 km/h',
      fuelConsumption: '9.5L/100km',
      seating: 5,
      drivetrain: '4WD'
    },
    features: [
      'Écran tactile 12.3"',
      'Système de navigation premium',
      'Caméras 360°',
      'Freinage automatique d\'urgence',
      'Régulateur de vitesse adaptatif',
      'Climatisation tri-zone',
      'Sièges en cuir Nappa',
      'Toit ouvrant',
      'Système audio Lexicon',
      'Éclairage LED adaptatif',
      'Suspension pneumatique',
      'Sièges massants'
    ],
    in_stock: true,
    stock_quantity: 1
  }
];

// Fonction pour obtenir tous les véhicules
export const getAllKoreanVehicles = (): KoreanVehicle[] => {
  return koreanVehicles;
};

// Fonction pour obtenir les véhicules par marque
export const getVehiclesByBrand = (brand: 'Hyundai' | 'Kia' | 'Genesis'): KoreanVehicle[] => {
  return koreanVehicles.filter(vehicle => vehicle.brand === brand);
};

// Fonction pour obtenir un véhicule par ID
export const getVehicleById = (id: string): KoreanVehicle | undefined => {
  return koreanVehicles.find(vehicle => vehicle.id === id);
};

// Fonction pour obtenir les véhicules en stock
export const getAvailableVehicles = (): KoreanVehicle[] => {
  return koreanVehicles.filter(vehicle => vehicle.in_stock && (vehicle.stock_quantity || 0) > 0);
};

// Fonction pour obtenir les véhicules par gamme de prix
export const getVehiclesByPriceRange = (minPrice: number, maxPrice: number): KoreanVehicle[] => {
  return koreanVehicles.filter(vehicle => 
    vehicle.price_krw >= minPrice && vehicle.price_krw <= maxPrice
  );
};
