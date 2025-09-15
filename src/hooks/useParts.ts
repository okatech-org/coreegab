import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Part } from '@/types/database';

interface UsePartsParams {
  vehicleId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

// Fonction pour appeler la RPC de Supabase
const fetchPartsForVehicle = async (params: UsePartsParams): Promise<{ data: Part[], count: number }> => {
  if (!params.vehicleId) {
    return { data: [], count: 0 };
  }

  const rpcParams: { p_vehicle_id: string, p_search?: string, p_limit?: number, p_offset?: number } = {
    p_vehicle_id: params.vehicleId,
  };

  if (params.search) rpcParams.p_search = params.search;
  if (params.limit) rpcParams.p_limit = params.limit;
  if (params.offset) rpcParams.p_offset = params.offset;
  
  const { data, error, count } = await supabase
    .rpc('get_parts_for_vehicle', rpcParams, { count: 'exact' });

  if (error) {
    throw new Error(error.message);
  }

  return { data: data || [], count: count || 0 };
};


export const useParts = (params: UsePartsParams) => {
  return useQuery({
    queryKey: ['parts', params],
    queryFn: () => fetchPartsForVehicle(params),
    enabled: !!params.vehicleId, // Ne lancer la requête que si un vehicleId est fourni
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
