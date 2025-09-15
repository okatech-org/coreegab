-- Enable RLS on tables that don't have it enabled
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.part_vehicle_fitment ENABLE ROW LEVEL SECURITY;

-- Create policies for parts table
CREATE POLICY "Anyone can view parts" ON public.parts
FOR SELECT USING (true);

CREATE POLICY "Only admins can manage parts" ON public.parts
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create policies for vehicles table
CREATE POLICY "Anyone can view vehicles" ON public.vehicles
FOR SELECT USING (true);

CREATE POLICY "Only admins can manage vehicles" ON public.vehicles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create policies for part_vehicle_fitment table
CREATE POLICY "Anyone can view part fitments" ON public.part_vehicle_fitment
FOR SELECT USING (true);

CREATE POLICY "Only admins can manage part fitments" ON public.part_vehicle_fitment
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);