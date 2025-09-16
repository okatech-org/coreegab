// Service pour récupérer des données de pièces automobiles depuis des sources ouvertes
// Sources: APIs gouvernementales, bases de données publiques, et données structurées

import { OPEN_SOURCE_PARTS, getCategories, getBrands, filterParts, type OpenSourcePart } from './openSourcePartsData';

// Export OpenSourcePart type for external use
export type { OpenSourcePart };

export interface VehicleSpec {
  make: string;
  model: string;
  year: number;
  engine?: string;
  trim?: string;
}

export class PartsDataService {
  // Utiliser les données open source étendues
  private static readonly COMMON_PARTS: OpenSourcePart[] = OPEN_SOURCE_PARTS;

  // Récupérer toutes les pièces communes
  static getAllCommonParts(): OpenSourcePart[] {
    return this.COMMON_PARTS;
  }

  // Rechercher des pièces par critères
  static searchParts(criteria: {
    category?: string;
    brand?: string;
    vehicle?: VehicleSpec;
    searchTerm?: string;
  }): OpenSourcePart[] {
    return filterParts(criteria);
  }

  // Récupérer les catégories disponibles
  static getCategories(): string[] {
    return getCategories();
  }

  // Récupérer les marques disponibles
  static getBrands(): string[] {
    return getBrands();
  }

  // Convertir une pièce open source en format base de données
  static convertToDatabaseFormat(part: OpenSourcePart, vehicleId: string) {
    return {
      part_number: part.partNumber,
      oem_number: part.oemNumber,
      name: part.name,
      description: part.description,
      brand: part.brand,
      price_krw: part.priceEstimate || 0,
      stock_quantity: Math.floor(Math.random() * 50) + 10, // Stock aléatoire pour la démo
      image_url: '/placeholder-parts.svg'
    };
  }

  // Générer des données de compatibilité pour une pièce
  static generateFitmentData(part: OpenSourcePart, vehicleIds: string[]) {
    return vehicleIds.map(vehicleId => ({
      part_id: '', // Sera rempli après insertion
      vehicle_id: vehicleId,
      notes: `Compatible avec ${part.compatibleVehicles.join(', ')}`
    }));
  }
}