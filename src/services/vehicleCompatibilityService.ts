/**
 * Service de validation de compatibilité des pièces automobiles
 */

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  engine?: string;
  transmission?: string;
}

export interface Part {
  id: string;
  name: string;
  part_number: string;
  compatible_vehicles: string[];
  category: string;
  stock_quantity?: number;
}

export interface CompatibilityResult {
  isCompatible: boolean;
  reason?: string;
  alternatives?: Part[];
}

class VehicleCompatibilityService {
  // Base de données des véhicules (en production, ceci viendrait de la base de données)
  private vehicles: Vehicle[] = [
    { id: 'hyundai-tucson-2024', make: 'Hyundai', model: 'Tucson', year: 2024, engine: '2.5L', transmission: 'Automatic' },
    { id: 'kia-sportage-2024', make: 'Kia', model: 'Sportage', year: 2024, engine: '2.4L', transmission: 'Automatic' },
    { id: 'hyundai-elantra-2024', make: 'Hyundai', model: 'Elantra', year: 2024, engine: '2.0L', transmission: 'Automatic' },
    { id: 'kia-carnival-2024', make: 'Kia', model: 'Carnival', year: 2024, engine: '3.5L V6', transmission: 'Automatic' },
  ];

  // Base de données des pièces avec compatibilité
  private parts: Part[] = [
    {
      id: 'p1',
      name: 'Filtre à air Hyundai Tucson',
      part_number: 'HY-TUCSON-AIR-001',
      compatible_vehicles: ['hyundai-tucson-2024'],
      category: 'filters',
      stock_quantity: 10
    },
    {
      id: 'p2',
      name: 'Plaquettes de frein Kia Sportage',
      part_number: 'KIA-SPORT-BRAKE-002',
      compatible_vehicles: ['kia-sportage-2024'],
      category: 'braking',
      stock_quantity: 5
    },
    {
      id: 'p3',
      name: 'Bougie d\'allumage Hyundai',
      part_number: 'HY-SPARK-003',
      compatible_vehicles: ['hyundai-tucson-2024', 'hyundai-elantra-2024'],
      category: 'ignition',
      stock_quantity: 0
    },
    {
      id: 'p4',
      name: 'Filtre à huile universel',
      part_number: 'UNI-OIL-FILTER-004',
      compatible_vehicles: ['hyundai-tucson-2024', 'kia-sportage-2024', 'hyundai-elantra-2024', 'kia-carnival-2024'],
      category: 'filters',
      stock_quantity: 20
    }
  ];

  /**
   * Vérifie la compatibilité d'une pièce avec un véhicule
   */
  checkCompatibility(vehicleId: string, partId: string): CompatibilityResult {
    const vehicle = this.vehicles.find(v => v.id === vehicleId);
    const part = this.parts.find(p => p.id === partId);

    if (!vehicle) {
      return {
        isCompatible: false,
        reason: 'Véhicule non trouvé'
      };
    }

    if (!part) {
      return {
        isCompatible: false,
        reason: 'Pièce non trouvée'
      };
    }

    const isCompatible = part.compatible_vehicles.includes(vehicleId);

    if (!isCompatible) {
      // Chercher des alternatives
      const alternatives = this.parts.filter(p => 
        p.category === part.category && 
        p.compatible_vehicles.includes(vehicleId) &&
        p.id !== partId
      );

      return {
        isCompatible: false,
        reason: `Cette pièce n'est pas compatible avec ${vehicle.make} ${vehicle.model} ${vehicle.year}`,
        alternatives
      };
    }

    return {
      isCompatible: true
    };
  }

  /**
   * Obtient toutes les pièces compatibles avec un véhicule
   */
  getCompatibleParts(vehicleId: string): Part[] {
    return this.parts.filter(part => 
      part.compatible_vehicles.includes(vehicleId)
    );
  }

  /**
   * Obtient les informations d'un véhicule
   */
  getVehicle(vehicleId: string): Vehicle | null {
    return this.vehicles.find(v => v.id === vehicleId) || null;
  }

  /**
   * Obtient toutes les pièces d'une catégorie compatible avec un véhicule
   */
  getCompatiblePartsByCategory(vehicleId: string, category: string): Part[] {
    return this.parts.filter(part => 
      part.compatible_vehicles.includes(vehicleId) &&
      part.category === category
    );
  }

  /**
   * Valide le stock d'une pièce
   */
  validateStock(partId: string, requestedQuantity: number = 1): boolean {
    const part = this.parts.find(p => p.id === partId);
    if (!part) return false;
    
    return (part.stock_quantity || 0) >= requestedQuantity;
  }

  /**
   * Obtient les informations de stock d'une pièce
   */
  getStockInfo(partId: string): { available: number; inStock: boolean } {
    const part = this.parts.find(p => p.id === partId);
    if (!part) return { available: 0, inStock: false };
    
    const available = part.stock_quantity || 0;
    return {
      available,
      inStock: available > 0
    };
  }
}

export const vehicleCompatibilityService = new VehicleCompatibilityService();
