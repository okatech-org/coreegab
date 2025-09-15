import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, Wrench, Star } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Part } from '@/types/database';

interface PartCardProps {
  part: Part;
  onAddToCart?: (part: Part) => void;
  onOrderNow?: (part: Part) => void;
  showActions?: boolean;
}

// Mapping des catégories vers les icônes
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Filtres': Package,
  'Freinage': Wrench,
  'Allumage': Star,
  'Distribution': Wrench,
  'Refroidissement': Package,
  'Électrique': Star,
  'Éclairage': Star,
  'Suspension': Wrench,
  'Transmission': Wrench,
  'Climatisation': Package,
  'Lubrifiants': Package,
};

// Mapping des marques vers les couleurs
const brandColors: Record<string, string> = {
  'Hyundai Genuine': 'bg-blue-100 text-blue-800',
  'Kia Genuine': 'bg-green-100 text-green-800',
  'Hyundai Mobis': 'bg-purple-100 text-purple-800',
  'NGK': 'bg-orange-100 text-orange-800',
  'Denso': 'bg-red-100 text-red-800',
  'Gates': 'bg-gray-100 text-gray-800',
  'Mitsubishi': 'bg-indigo-100 text-indigo-800',
  'Varta': 'bg-yellow-100 text-yellow-800',
  'Sachs': 'bg-pink-100 text-pink-800',
  'Luk': 'bg-teal-100 text-teal-800',
  'Shell': 'bg-cyan-100 text-cyan-800',
};

export const PartCard: React.FC<PartCardProps> = ({ 
  part, 
  onAddToCart, 
  onOrderNow, 
  showActions = true 
}) => {
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  const { user } = useAuth();

  const CategoryIcon = categoryIcons[part.brand || ''] || Package;
  const brandColorClass = brandColors[part.brand || ''] || 'bg-gray-100 text-gray-800';

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des produits au panier",
        variant: "destructive",
      });
      return;
    }
    
    if (onAddToCart) {
      onAddToCart(part);
      toast({
        title: "Pièce ajoutée",
        description: `${part.name} a été ajoutée au panier`,
      });
    }
  };

  const handleOrderNow = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour passer une commande",
        variant: "destructive",
      });
      return;
    }
    
    if (onOrderNow) {
      onOrderNow(part);
    }
  };

  const getStockStatus = (stock?: number) => {
    if (!stock || stock === 0) return { text: 'Rupture de stock', color: 'bg-red-100 text-red-800' };
    if (stock < 5) return { text: 'Stock faible', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'En stock', color: 'bg-green-100 text-green-800' };
  };

  const stockStatus = getStockStatus(part.stock_quantity);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg overflow-hidden">
          {part.image_url ? (
            <img
              src={part.image_url}
              alt={part.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/placeholder-parts.svg';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <CategoryIcon className="h-16 w-16 text-gray-400" />
            </div>
          )}
          
          {/* Stock Badge */}
          <div className="absolute top-2 right-2">
            <Badge className={`text-xs ${stockStatus.color}`}>
              {stockStatus.text}
            </Badge>
          </div>

          {/* Brand Badge */}
          {part.brand && (
            <div className="absolute top-2 left-2">
              <Badge className={`text-xs ${brandColorClass}`}>
                {part.brand}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title and Part Number */}
          <div className="space-y-1">
            <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
              {part.name}
            </h3>
            {part.part_number && (
              <p className="text-xs text-gray-500 font-mono">
                Ref: {part.part_number}
              </p>
            )}
            {part.oem_number && part.oem_number !== part.part_number && (
              <p className="text-xs text-gray-400 font-mono">
                OEM: {part.oem_number}
              </p>
            )}
          </div>

          {/* Description */}
          {part.description && (
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {part.description}
            </p>
          )}

          {/* Price and Stock */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-lg text-primary">
                {formatPrice(part.price_krw || 0, 'KRW')}
              </div>
              {part.stock_quantity && part.stock_quantity > 0 && (
                <div className="text-xs text-gray-500">
                  {part.stock_quantity} en stock
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddToCart}
                className="flex-1 text-xs"
                disabled={!part.stock_quantity || part.stock_quantity === 0}
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                Panier
              </Button>
              <Button
                size="sm"
                onClick={handleOrderNow}
                className="flex-1 text-xs"
                disabled={!part.stock_quantity || part.stock_quantity === 0}
              >
                Commander
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
