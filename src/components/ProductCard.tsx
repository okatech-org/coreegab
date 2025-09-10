import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Product } from "@/types/database";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ProductCardProps {
  product: Product;
  onOrder?: (product: Product) => void;
  calculateFinalPrice?: (product: Product) => number;
}

export default function ProductCard({ 
  product, 
  onOrder, 
  calculateFinalPrice 
}: ProductCardProps) {
  const { formatPrice, currency } = useCurrency();
  
  // Use the calculateFinalPrice function if provided, otherwise use the base price
  const basePrice = calculateFinalPrice ? calculateFinalPrice(product) : product.price_krw;
  
  // Format the price in the current currency
  const displayPrice = formatPrice(basePrice, 'XAF');
  
  return (
    <Card className="card-elevated bg-card border border-border">
      <CardContent className="p-4">
        {product.image_url && (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg mb-4" 
          />
        )}
        <h3 className="font-semibold text-lg mb-2 text-foreground">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-primary">
              {displayPrice}
            </span>
            {currency !== 'XAF' && (
              <span className="text-sm text-muted-foreground">
                {formatPrice(basePrice, 'XAF', 'XAF')}
              </span>
            )}
          </div>
          <Button 
            variant="default"
            size="sm"
            onClick={() => onOrder?.(product)}
            disabled={!product.in_stock}
            className="bg-accent hover:bg-accent-hover"
          >
            {product.in_stock ? 'Commander' : 'Rupture'}
          </Button>
        </div>
        {!product.in_stock && (
          <div className="mt-2 text-sm text-destructive">
            Produit en rupture de stock
          </div>
        )}
      </CardContent>
    </Card>
  );
}