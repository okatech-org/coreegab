-- Add missing columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS name TEXT;

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('vehicles', 'electronics', 'appliances', 'parts')),
  price_krw DECIMAL(15,2) NOT NULL,
  weight DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  description TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.profiles(user_id),
  commercial_id UUID REFERENCES public.profiles(user_id),
  products JSONB NOT NULL,
  supplier_price DECIMAL(15,2) NOT NULL,
  transport_cost DECIMAL(15,2) NOT NULL,
  customs_cost DECIMAL(15,2) NOT NULL,
  margin DECIMAL(15,2) NOT NULL,
  total_price DECIMAL(15,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipping', 'delivered')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create price_settings table
CREATE TABLE IF NOT EXISTS public.price_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exchange_rate_krw_xaf DECIMAL(10,4) NOT NULL,
  transport_base DECIMAL(10,2) NOT NULL,
  transport_per_kg DECIMAL(10,2) NOT NULL,
  margin_rate DECIMAL(5,4) NOT NULL DEFAULT 0.35,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (
  client_id = auth.uid() OR 
  commercial_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Clients can create orders" ON public.orders FOR INSERT WITH CHECK (
  client_id = auth.uid()
);

CREATE POLICY "Commercial and admins can update orders" ON public.orders FOR UPDATE USING (
  commercial_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'commercial'))
);

-- RLS Policies for price_settings
CREATE POLICY "Anyone can view price settings" ON public.price_settings FOR SELECT USING (true);
CREATE POLICY "Only admins can manage price settings" ON public.price_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Create triggers for updated_at columns
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_price_settings_updated_at
  BEFORE UPDATE ON public.price_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default price settings
INSERT INTO public.price_settings (exchange_rate_krw_xaf, transport_base, transport_per_kg, margin_rate)
VALUES (0.65, 50000, 1000, 0.35)
ON CONFLICT DO NOTHING;