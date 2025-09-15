import { supabase } from '@/integrations/supabase/client';

export interface ExtendedVehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  sub_category?: string;
  description?: string;
  specifications?: any;
  features?: string[];
  images?: string[];
  supplier_price_krw: number;
  supplier_price_fcfa: number;
  transport_cost: number;
  customs_fees: number;
  margin: number;
  final_price_fcfa: number;
  availability?: string;
  import_source?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const vehicleService = {
  // Récupérer tous les véhicules étendus
  async getVehicles(filters?: {
    category?: string;
    brand?: string;
    search?: string;
    limit?: number;
    offset?: number;
    status?: string;
  }) {
    try {
      let query = supabase
        .from('products_extended')
        .select('*')
        .eq('status', 'active');

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.brand) {
        query = query.eq('brand', filters.brand);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,model.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vehicles:', error);
        // Si la table n'existe pas, retourner un tableau vide
        if (error.code === 'PGRST116' || error.message.includes('relation "products_extended" does not exist')) {
          console.log('Table products_extended non trouvée - mode démo');
          return { data: [], error: null };
        }
        throw error;
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      return { data: [], error };
    }
  },

  // Récupérer un véhicule par ID
  async getVehicleById(id: string) {
    try {
      const { data, error } = await supabase
        .from('products_extended')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { data: null, error: null };
        }
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      return { data: null, error };
    }
  },

  // Récupérer les marques disponibles
  async getBrands() {
    try {
      const { data, error } = await supabase
        .from('products_extended')
        .select('brand')
        .eq('status', 'active');

      if (error) {
        if (error.code === 'PGRST116') {
          return { data: [], error: null };
        }
        throw error;
      }

      // Extraire les marques uniques
      const brands = [...new Set((data || []).map((item: any) => item.brand).filter(Boolean))];
      return { data: brands, error: null };
    } catch (error) {
      console.error('Error fetching brands:', error);
      return { data: [], error };
    }
  },

  // Récupérer les catégories de véhicules
  async getVehicleCategories() {
    try {
      const { data, error } = await supabase
        .from('products_extended')
        .select('category')
        .eq('status', 'active');

      if (error) {
        if (error.code === 'PGRST116') {
          return { data: {}, error: null };
        }
        throw error;
      }

      // Compter les véhicules par catégorie
      const categoryCounts = (data || []).reduce((acc: Record<string, number>, vehicle: any) => {
        if (vehicle.category) {
          acc[vehicle.category] = (acc[vehicle.category] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      return { data: categoryCounts, error: null };
    } catch (error) {
      console.error('Error fetching vehicle categories:', error);
      return { data: {}, error };
    }
  },

  // Recherche de véhicules
  async searchVehicles(query: string, filters?: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
  }) {
    try {
      let supabaseQuery = supabase
        .from('products_extended')
        .select('*')
        .eq('status', 'active')
        .or(`name.ilike.%${query}%,brand.ilike.%${query}%,model.ilike.%${query}%,description.ilike.%${query}%`);

      if (filters?.category) {
        supabaseQuery = supabaseQuery.eq('category', filters.category);
      }

      if (filters?.brand) {
        supabaseQuery = supabaseQuery.eq('brand', filters.brand);
      }

      if (filters?.minPrice) {
        supabaseQuery = supabaseQuery.gte('final_price_fcfa', filters.minPrice);
      }

      if (filters?.maxPrice) {
        supabaseQuery = supabaseQuery.lte('final_price_fcfa', filters.maxPrice);
      }

      if (filters?.limit) {
        supabaseQuery = supabaseQuery.limit(filters.limit);
      }

      const { data, error } = await supabaseQuery.order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST116') {
          return { data: [], error: null };
        }
        throw error;
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error searching vehicles:', error);
      return { data: [], error };
    }
  }
};
