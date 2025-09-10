import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/database';

export interface CreateProductData {
  name: string;
  description?: string;
  price_krw: number;
  category: string;
  image_url?: string;
  stock_quantity?: number;
  specifications?: any;
  is_active?: boolean;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export const productService = {
  // Récupérer tous les produits
  async getProducts(filters?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { data: null, error };
    }
  },

  // Récupérer un produit par ID
  async getProductById(id: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching product:', error);
      return { data: null, error };
    }
  },

  // Créer un nouveau produit
  async createProduct(productData: CreateProductData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error creating product:', error);
      return { data: null, error };
    }
  },

  // Mettre à jour un produit
  async updateProduct({ id, ...updates }: UpdateProductData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error updating product:', error);
      return { data: null, error };
    }
  },

  // Supprimer un produit (soft delete)
  async deleteProduct(id: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { data: null, error };
    }
  },

  // Récupérer les catégories avec compteurs
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .eq('is_active', true);

      if (error) throw error;

      // Compter les produits par catégorie
      const categoryCounts = data.reduce((acc: Record<string, number>, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {});

      return { data: categoryCounts, error: null };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { data: null, error };
    }
  },

  // Recherche avancée
  async searchProducts(query: string, filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
  }) {
    try {
      let supabaseQuery = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

      if (filters?.category) {
        supabaseQuery = supabaseQuery.eq('category', filters.category);
      }

      if (filters?.minPrice) {
        supabaseQuery = supabaseQuery.gte('price_krw', filters.minPrice);
      }

      if (filters?.maxPrice) {
        supabaseQuery = supabaseQuery.lte('price_krw', filters.maxPrice);
      }

      if (filters?.limit) {
        supabaseQuery = supabaseQuery.limit(filters.limit);
      }

      const { data, error } = await supabaseQuery.order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error searching products:', error);
      return { data: null, error };
    }
  }
};
