export interface Product {
  id: string;
  name: string;
  category: 'vehicles' | 'electronics' | 'appliances' | 'parts';
  price_krw: number;
  weight: number;
  image_url?: string;
  description?: string;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  client_id: string;
  commercial_id?: string;
  products: any; // JSONB
  supplier_price: number;
  transport_cost: number;
  customs_cost: number;
  margin: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered';
  created_at: string;
  updated_at: string;
}

export interface PriceSettings {
  id: string;
  exchange_rate_krw_xaf: number;
  transport_base: number;
  transport_per_kg: number;
  margin_rate: number;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  phone: string;
  full_name?: string;
  role: 'client' | 'commercial' | 'admin';
  is_demo?: boolean;
  email?: string;
  name?: string;
  created_at: string;
  updated_at: string;
}