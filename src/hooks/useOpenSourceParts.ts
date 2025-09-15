import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PartsDataService, OpenSourcePart, VehicleSpec } from '@/services/partsDataService';
import { NHTSAService } from '@/services/nhtsaService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Hook pour récupérer les pièces depuis les sources ouvertes
export const useOpenSourceParts = (criteria?: {
  category?: string;
  brand?: string;
  vehicle?: VehicleSpec;
  searchTerm?: string;
}) => {
  return useQuery({
    queryKey: ['openSourceParts', criteria],
    queryFn: () => PartsDataService.searchParts(criteria || {}),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook pour récupérer les catégories de pièces
export const usePartsCategories = () => {
  return useQuery({
    queryKey: ['partsCategories'],
    queryFn: () => PartsDataService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook pour récupérer les marques de pièces
export const usePartsBrands = () => {
  return useQuery({
    queryKey: ['partsBrands'],
    queryFn: () => PartsDataService.getBrands(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook pour importer des pièces open source dans la base de données
export const useImportOpenSourceParts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: {
      parts: OpenSourcePart[];
      vehicleIds: string[];
    }) => {
      const { parts, vehicleIds } = params;
      const results = [];

      for (const part of parts) {
        try {
          // Convertir la pièce au format base de données
          const partData = PartsDataService.convertToDatabaseFormat(part, vehicleIds[0]);
          
          // Insérer la pièce
          const { data: insertedPart, error: partError } = await supabase
            .from('parts')
            .insert(partData)
            .select()
            .single();

          if (partError) {
            console.error('Error inserting part:', partError);
            continue;
          }

          // Créer les relations de compatibilité
          const fitmentData = vehicleIds.map(vehicleId => ({
            part_id: insertedPart.id,
            vehicle_id: vehicleId
          }));

          const { error: fitmentError } = await supabase
            .from('part_vehicle_fitment')
            .insert(fitmentData);

          if (fitmentError) {
            console.error('Error inserting fitment:', fitmentError);
          }

          results.push(insertedPart);
        } catch (error) {
          console.error('Error processing part:', error);
        }
      }

      return results;
    },
    onSuccess: (results) => {
      // Invalider les queries liées
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      
      toast({
        title: "Import réussi",
        description: `${results.length} pièces ont été importées avec succès`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur d'import",
        description: "Une erreur est survenue lors de l'import des pièces",
        variant: "destructive",
      });
    },
  });
};

// Hook pour récupérer les données NHTSA
export const useNHTSAData = () => {
  const { data: makes, isLoading: makesLoading } = useQuery({
    queryKey: ['nhtsa-makes'],
    queryFn: () => NHTSAService.getAllMakes(),
    staleTime: 60 * 60 * 1000, // 1 heure
  });

  const { data: vehicleVariables, isLoading: variablesLoading } = useQuery({
    queryKey: ['nhtsa-variables'],
    queryFn: () => NHTSAService.getVehicleVariables(),
    staleTime: 60 * 60 * 1000, // 1 heure
  });

  return {
    makes: makes?.filter(make => 
      ['HYUNDAI', 'KIA', 'GENESIS'].includes(make.Make_Name.toUpperCase())
    ) || [],
    vehicleVariables: vehicleVariables || [],
    isLoading: makesLoading || variablesLoading,
  };
};

// Hook pour rechercher des véhicules NHTSA
export const useNHTSAVehicleSearch = (make?: string, model?: string, year?: number) => {
  return useQuery({
    queryKey: ['nhtsa-vehicles', make, model, year],
    queryFn: () => NHTSAService.searchVehicles(make, model, year),
    enabled: !!make,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook pour synchroniser les données NHTSA avec la base locale
export const useSyncNHTSAData = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: {
      make: string;
      models: string[];
      years: number[];
    }) => {
      const { make, models, years } = params;
      const vehicles = [];

      for (const model of models) {
        for (const year of years) {
          try {
            // Vérifier si le véhicule existe déjà
            const { data: existing } = await supabase
              .from('vehicles')
              .select('id')
              .eq('make', make)
              .eq('model', model)
              .eq('year_start', year)
              .single();

            if (existing) continue;

            // Insérer le nouveau véhicule
            const { data: vehicle, error } = await supabase
              .from('vehicles')
              .insert({
                make,
                model,
                year_start: year,
                year_end: year,
                engine: '2.0L 4-Cyl' // Valeur par défaut
              })
              .select()
              .single();

            if (error) {
              console.error('Error inserting vehicle:', error);
              continue;
            }

            vehicles.push(vehicle);
          } catch (error) {
            console.error('Error processing vehicle:', error);
          }
        }
      }

      return vehicles;
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      
      toast({
        title: "Synchronisation réussie",
        description: `${results.length} véhicules ont été ajoutés`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur de synchronisation",
        description: "Une erreur est survenue lors de la synchronisation",
        variant: "destructive",
      });
    },
  });
};
