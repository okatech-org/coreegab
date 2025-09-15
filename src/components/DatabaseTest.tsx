import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const DatabaseTest: React.FC = () => {
  // Test des produits
  const { data: products, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['test-products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').limit(5);
      if (error) throw error;
      return data;
    },
  });

  // Test des véhicules
  const { data: vehicles, isLoading: vehiclesLoading, error: vehiclesError } = useQuery({
    queryKey: ['test-vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('vehicles').select('*').limit(5);
      if (error) throw error;
      return data;
    },
  });

  // Test des pièces
  const { data: parts, isLoading: partsLoading, error: partsError } = useQuery({
    queryKey: ['test-parts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('parts').select('*').limit(5);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Test de Connexion Base de Données</h2>
      
      {/* Test Produits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Produits
            <Badge variant={productsError ? "destructive" : "secondary"}>
              {productsLoading ? "Chargement..." : products?.length || 0}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {productsError && (
            <p className="text-destructive">Erreur: {productsError.message}</p>
          )}
          {products && (
            <div className="space-y-2">
              {products.map((product: any) => (
                <div key={product.id} className="p-2 border rounded">
                  <strong>{product.name}</strong> - {product.category} - {product.price_krw} KRW
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Véhicules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Véhicules
            <Badge variant={vehiclesError ? "destructive" : "secondary"}>
              {vehiclesLoading ? "Chargement..." : vehicles?.length || 0}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vehiclesError && (
            <p className="text-destructive">Erreur: {vehiclesError.message}</p>
          )}
          {vehicles && (
            <div className="space-y-2">
              {vehicles.map((vehicle: any) => (
                <div key={vehicle.id} className="p-2 border rounded">
                  <strong>{vehicle.make} {vehicle.model}</strong> ({vehicle.year_start}-{vehicle.year_end}) - {vehicle.engine}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Pièces */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Pièces
            <Badge variant={partsError ? "destructive" : "secondary"}>
              {partsLoading ? "Chargement..." : parts?.length || 0}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {partsError && (
            <p className="text-destructive">Erreur: {partsError.message}</p>
          )}
          {parts && (
            <div className="space-y-2">
              {parts.map((part: any) => (
                <div key={part.id} className="p-2 border rounded">
                  <strong>{part.name}</strong> - {part.part_number} - {part.brand} - {part.price_krw} KRW
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
