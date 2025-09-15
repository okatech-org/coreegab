export interface Product {
  id: string;
  name: string;
  category: 'vehicles' | 'electronics' | 'appliances' | 'parts' | 'smartphones';
  price_krw: number;
  weight: number;
  image_url?: string;
  description?: string;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  created_at: string;
  make: string;
  model: string;
  year_start: number;
  year_end?: number;
  engine?: string;
  trim?: string;
}

export interface Part {
  id: string;
  created_at: string;
  part_number: string;
  oem_number?: string;
  name: string;
  description?: string;
  brand?: string;
  price_krw?: number;
  stock_quantity?: number;
  image_url?: string;
}

export interface PartVehicleFitment {
  id: string;
  part_id: string;
  vehicle_id: string;
  notes?: string;
}

export interface Order {
  id: string;
  client_id: string;
  commercial_id?: string;
  products: Record<string, unknown>; // JSONB
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