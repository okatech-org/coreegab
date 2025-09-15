import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Vehicle } from '@/types/database';
import { useCallback, useMemo } from 'react';

// Fonction pour récupérer tous les véhicules
const fetchVehicles = async (): Promise<Vehicle[]> => {
  const { data, error } = await supabase.from('vehicles').select('*');
  if (error) throw new Error(error.message);
  return data;
};

// Hook principal pour utiliser les données des véhicules
export const useVehicles = () => {
  const { data: vehicles = [], isLoading, error } = useQuery<Vehicle[]>({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Debug log (commenté pour la production)
  // console.log('useVehicles Debug:', { vehicles: vehicles.length, isLoading, error });

  // Extraire les marques uniques (mémorisé)
  const makes = useMemo(() => {
    if (!vehicles || vehicles.length === 0) return [];
    return [...new Set(vehicles.map(v => v.make))].sort();
  }, [vehicles]);

  // Obtenir les modèles pour une marque sélectionnée (callback stable)
  const getModelsByMake = useCallback((make: string | null) => {
    if (!make || !vehicles || vehicles.length === 0) return [] as string[];
    return [...new Set(vehicles.filter(v => v.make === make).map(v => v.model))].sort();
  }, [vehicles]);

  // Obtenir les années pour un couple marque/modèle (callback stable)
  const getYearsByMakeAndModel = useCallback((make: string | null, model: string | null) => {
    if (!make || !model || !vehicles || vehicles.length === 0) return [] as number[];
    
    const relevantVehicles = vehicles.filter(v => v.make === make && v.model === model);
    const years = new Set<number>();

    relevantVehicles.forEach(v => {
      const endYear = v.year_end || new Date().getFullYear();
      for (let year = v.year_start; year <= endYear; year++) {
        years.add(year);
      }
    });

    return Array.from(years).sort((a, b) => b - a); // Trier de la plus récente à la plus ancienne
  }, [vehicles]);
  
  // Trouver l'ID du véhicule correspondant à la sélection (callback stable)
  const getVehicleId = useCallback((make: string | null, model: string | null, year: number | null) => {
    if (!make || !model || !year || !vehicles || vehicles.length === 0) return null;

    const vehicle = vehicles.find(v => 
      v.make === make &&
      v.model === model &&
      year >= v.year_start &&
      year <= (v.year_end || new Date().getFullYear())
    );

    return vehicle ? vehicle.id : null;
  }, [vehicles]);

  return {
    vehicles,
    makes,
    getModelsByMake,
    getYearsByMakeAndModel,
    getVehicleId,
    isLoading,
    error,
  };
};
