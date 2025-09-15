import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Car, Fuel, Gauge, Users, Settings, Zap } from 'lucide-react';
import type { KoreanVehicle } from '@/services/koreanVehiclesData';

interface VehicleCardProps {
  vehicle: KoreanVehicle;
  onOrder?: (vehicle: KoreanVehicle) => void;
  onViewDetails?: (vehicle: KoreanVehicle) => void;
}

export default function VehicleCard({ 
  vehicle, 
  onOrder, 
  onViewDetails 
}: VehicleCardProps) {
  const { formatPrice } = useCurrency();
  
  return (
    <Card className="card-elevated bg-card border border-border hover:shadow-lg transition-all duration-300">
      <CardHeader className="p-0">
        <div className="relative">
          <img 
            src={vehicle.image_url} 
            alt={vehicle.name}
            className="w-full h-48 object-cover rounded-t-lg" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-car.svg';
            }}
          />
          <Badge 
            variant="secondary" 
            className="absolute top-2 right-2 bg-white/90 text-black"
          >
            {vehicle.year}
          </Badge>
          {!vehicle.in_stock && (
            <Badge 
              variant="destructive" 
              className="absolute top-2 left-2"
            >
              Rupture de stock
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground mb-1">
              {vehicle.name}
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {vehicle.brand}
            </Badge>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {vehicle.description}
        </p>
        
        {/* Spécifications principales */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="flex items-center gap-1">
            <Settings className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{vehicle.specifications.engine}</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{vehicle.specifications.fuelType}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{vehicle.specifications.power}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{vehicle.specifications.seating} places</span>
          </div>
        </div>
        
        {/* Prix et actions */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-primary">
              {formatPrice(vehicle.price_krw)}
            </span>
            {vehicle.stock_quantity && vehicle.stock_quantity > 0 && (
              <span className="text-xs text-muted-foreground">
                {vehicle.stock_quantity} disponible{vehicle.stock_quantity > 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails?.(vehicle)}
            >
              Détails
            </Button>
            <Button 
              variant="default"
              size="sm"
              onClick={() => onOrder?.(vehicle)}
              disabled={!vehicle.in_stock}
              className="bg-accent hover:bg-accent-hover"
            >
              {vehicle.in_stock ? 'Commander' : 'Rupture'}
            </Button>
          </div>
        </div>
        
        {/* Consommation et performance */}
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Consommation: {vehicle.specifications.fuelConsumption}</span>
            <span>0-100km/h: {vehicle.specifications.acceleration}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
