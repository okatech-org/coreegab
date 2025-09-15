import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '@/services/vehicleService';

// Hook pour récupérer tous les véhicules étendus
export const useVehicles = (filters?: {
  category?: string;
  brand?: string;
  search?: string;
  limit?: number;
  offset?: number;
  status?: string;
}, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['vehicles', filters],
    queryFn: () => vehicleService.getVehicles(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    enabled: options?.enabled ?? true,
  });
};

// Hook pour récupérer un véhicule par ID
export const useVehicle = (id: string) => {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehicleService.getVehicleById(id),
    enabled: !!id,
  });
};

// Hook pour récupérer les marques disponibles
export const useVehicleBrands = () => {
  return useQuery({
    queryKey: ['vehicle-brands'],
    queryFn: () => vehicleService.getBrands(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook pour récupérer les catégories de véhicules
export const useVehicleCategories = () => {
  return useQuery({
    queryKey: ['vehicle-categories'],
    queryFn: () => vehicleService.getVehicleCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook pour la recherche de véhicules
export const useVehicleSearch = () => {
  return useQuery({
    queryKey: ['vehicle-search'],
    queryFn: () => vehicleService.searchVehicles('', {}),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: false, // Désactivé par défaut, activé par la fonction de recherche
  });
};