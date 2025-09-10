import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/database';

export interface CreateOrderData {
  user_id: string;
  product_id: string;
  quantity: number;
  unit_price_krw: number;
  total_price_krw: number;
  shipping_cost_krw?: number;
  customs_cost_krw?: number;
  final_price_xaf: number;
  status?: 'pending' | 'confirmed' | 'shipping' | 'delivered';
  notes?: string;
}

export interface UpdateOrderData extends Partial<CreateOrderData> {
  id: string;
}

export const orderService = {
  // Récupérer toutes les commandes d'un utilisateur
  async getUserOrders(userId: string, filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          products (
            id,
            name,
            image_url,
            category
          )
        `)
        .eq('user_id', userId);

      if (filters?.status) {
        query = query.eq('status', filters.status);
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
      console.error('Error fetching user orders:', error);
      return { data: null, error };
    }
  },

  // Récupérer toutes les commandes (pour admin/commercial)
  async getAllOrders(filters?: {
    status?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          products (
            id,
            name,
            image_url,
            category
          ),
          profiles (
            id,
            name,
            email
          )
        `);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
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
      console.error('Error fetching all orders:', error);
      return { data: null, error };
    }
  },

  // Récupérer une commande par ID
  async getOrderById(id: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (
            id,
            name,
            description,
            image_url,
            category,
            specifications
          ),
          profiles (
            id,
            name,
            email
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching order:', error);
      return { data: null, error };
    }
  },

  // Créer une nouvelle commande
  async createOrder(orderData: CreateOrderData) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error creating order:', error);
      return { data: null, error };
    }
  },

  // Mettre à jour une commande
  async updateOrder({ id, ...updates }: UpdateOrderData) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error updating order:', error);
      return { data: null, error };
    }
  },

  // Mettre à jour le statut d'une commande
  async updateOrderStatus(id: string, status: 'pending' | 'confirmed' | 'shipping' | 'delivered') {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error updating order status:', error);
      return { data: null, error };
    }
  },

  // Supprimer une commande
  async deleteOrder(id: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error deleting order:', error);
      return { data: null, error };
    }
  },

  // Calculer le prix final d'une commande
  calculateFinalPrice(
    priceKrw: number,
    quantity: number,
    shippingCostKrw: number = 0,
    customsCostKrw: number = 0,
    exchangeRate: number = 0.65 // KRW to XAF
  ) {
    const totalKrw = (priceKrw * quantity) + shippingCostKrw + customsCostKrw;
    const totalXaf = totalKrw * exchangeRate;
    
    return {
      unit_price_krw: priceKrw,
      total_price_krw: priceKrw * quantity,
      shipping_cost_krw: shippingCostKrw,
      customs_cost_krw: customsCostKrw,
      subtotal_krw: totalKrw,
      final_price_xaf: Math.round(totalXaf),
      exchange_rate: exchangeRate
    };
  },

  // Statistiques des commandes
  async getOrderStats(userId?: string) {
    try {
      let query = supabase
        .from('orders')
        .select('status, final_price_xaf, created_at');

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Calculer les statistiques
      const stats = {
        total: data.length,
        pending: data.filter(order => order.status === 'pending').length,
        confirmed: data.filter(order => order.status === 'confirmed').length,
        shipping: data.filter(order => order.status === 'shipping').length,
        delivered: data.filter(order => order.status === 'delivered').length,
        totalValue: data.reduce((sum, order) => sum + (order.final_price_xaf || 0), 0),
        avgOrderValue: data.length > 0 ? 
          data.reduce((sum, order) => sum + (order.final_price_xaf || 0), 0) / data.length : 0
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching order stats:', error);
      return { data: null, error };
    }
  }
};
