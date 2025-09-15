// Service pour l'API NHTSA (National Highway Traffic Safety Administration)
// Source: https://vpic.nhtsa.dot.gov/api/
// Gratuit et open source

export interface NHTSAVehicle {
  Make_ID: number;
  Make_Name: string;
  Model_ID: number;
  Model_Name: string;
  Model_Year: number;
}

export interface NHTSAVehicleVariable {
  Variable: string;
  VariableId: number;
  DataType: string;
  Description: string;
}

export interface NHTSAVehicleVariableValue {
  Variable: string;
  VariableId: number;
  Value: string;
  ValueId: string;
}

export class NHTSAService {
  private static readonly BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';

  // Récupérer toutes les marques
  static async getAllMakes(): Promise<{ Make_ID: number; Make_Name: string }[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/getallmakes?format=json`);
      const data = await response.json();
      return data.Results || [];
    } catch (error) {
      console.error('Error fetching makes from NHTSA:', error);
      return [];
    }
  }

  // Récupérer les modèles pour une marque
  static async getModelsForMake(make: string): Promise<{ Model_ID: number; Model_Name: string }[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/getmodelsformake/${make}?format=json`);
      const data = await response.json();
      return data.Results || [];
    } catch (error) {
      console.error('Error fetching models from NHTSA:', error);
      return [];
    }
  }

  // Récupérer les années pour un modèle
  static async getYearsForModel(make: string, model: string): Promise<number[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/getmodelyearsformakeyear/make/${make}/modelyear/2024?format=json`);
      const data = await response.json();
      const years = data.Results
        ?.filter((item: any) => item.Model_Name.toLowerCase().includes(model.toLowerCase()))
        ?.map((item: any) => item.Model_Year)
        ?.filter((year: number) => year >= 2000) // Filtrer les années récentes
        ?.sort((a: number, b: number) => b - a) || [];
      
      return [...new Set(years)]; // Supprimer les doublons
    } catch (error) {
      console.error('Error fetching years from NHTSA:', error);
      return [];
    }
  }

  // Décoder un VIN pour obtenir les informations du véhicule
  static async decodeVIN(vin: string): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/decodevin/${vin}?format=json`);
      const data = await response.json();
      return data.Results?.[0] || null;
    } catch (error) {
      console.error('Error decoding VIN:', error);
      return null;
    }
  }

  // Récupérer les variables disponibles pour un véhicule
  static async getVehicleVariables(): Promise<NHTSAVehicleVariable[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/getvehiclevariablelist?format=json`);
      const data = await response.json();
      return data.Results || [];
    } catch (error) {
      console.error('Error fetching vehicle variables:', error);
      return [];
    }
  }

  // Rechercher des véhicules par critères
  static async searchVehicles(make?: string, model?: string, year?: number): Promise<NHTSAVehicle[]> {
    try {
      let url = `${this.BASE_URL}/getvehiclesformakeyear/make/${make || 'hyundai'}/modelyear/${year || 2023}?format=json`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      let results = data.Results || [];
      
      // Filtrer par modèle si spécifié
      if (model) {
        results = results.filter((vehicle: NHTSAVehicle) => 
          vehicle.Model_Name.toLowerCase().includes(model.toLowerCase())
        );
      }
      
      return results;
    } catch (error) {
      console.error('Error searching vehicles:', error);
      return [];
    }
  }
}
