import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Order } from "@/types/database";

interface PriceBreakdownProps {
  order: Order;
  className?: string;
}

export default function PriceBreakdown({ order, className }: PriceBreakdownProps) {
  const formatPrice = (price: number) => price.toLocaleString();

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="text-lg">Détail des prix</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Prix fournisseur:</span>
          <span className="font-medium">{formatPrice(order.supplier_price)} FCFA</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Transport:</span>
          <span className="font-medium">{formatPrice(order.transport_cost)} FCFA</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Douanes:</span>
          <span className="font-medium">{formatPrice(order.customs_cost)} FCFA</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Marge (35%):</span>
          <span className="font-medium">{formatPrice(order.margin)} FCFA</span>
        </div>
        
        <Separator />
        
        <div className="flex justify-between items-center pt-2">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-xl font-bold text-primary">
            {formatPrice(order.total_price)} FCFA
          </span>
        </div>
      </CardContent>
    </Card>
  );
}