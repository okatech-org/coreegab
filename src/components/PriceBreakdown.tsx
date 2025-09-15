import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Info, Calculator, TrendingUp } from 'lucide-react';

interface PriceBreakdownProps {
  supplierPrice: number;
  transportCost: number;
  customsCost: number;
  margin: number;
  total: number;
  exchangeRate?: number;
  showDetails?: boolean;
}

export default function PriceBreakdown({
  supplierPrice,
  transportCost,
  customsCost,
  margin,
  total,
  exchangeRate = 0.65,
  showDetails = true
}: PriceBreakdownProps) {
  const priceKRW = supplierPrice / exchangeRate;

  const formatPrice = (price: number) => {
    return price.toLocaleString() + ' FCFA';
  };

  const formatPriceKRW = (price: number) => {
    return price.toLocaleString() + ' ₩';
  };

  const getPercentage = (amount: number) => {
    return ((amount / total) * 100).toFixed(1) + '%';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Détail du Prix
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {showDetails && (
          <>
            {/* Prix fournisseur */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm">Prix fournisseur</span>
                <Badge variant="secondary" className="text-xs">
                  {formatPriceKRW(priceKRW)}
                </Badge>
              </div>
              <div className="text-right">
                <span className="font-medium">{formatPrice(supplierPrice)}</span>
                <div className="text-xs text-muted-foreground">
                  {getPercentage(supplierPrice)}
                </div>
              </div>
            </div>

            {/* Transport */}
            <div className="flex justify-between items-center">
              <span className="text-sm">Transport</span>
              <div className="text-right">
                <span className="font-medium">{formatPrice(transportCost)}</span>
                <div className="text-xs text-muted-foreground">
                  {getPercentage(transportCost)}
                </div>
              </div>
            </div>

            {/* Douane */}
            <div className="flex justify-between items-center">
              <span className="text-sm">Frais de douane</span>
              <div className="text-right">
                <span className="font-medium">{formatPrice(customsCost)}</span>
                <div className="text-xs text-muted-foreground">
                  {getPercentage(customsCost)}
                </div>
              </div>
            </div>

            {/* Marge */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm">Marge COREEGAB</span>
                <TrendingUp className="w-3 h-3 text-muted-foreground" />
              </div>
              <div className="text-right">
                <span className="font-medium text-green-600">{formatPrice(margin)}</span>
                <div className="text-xs text-muted-foreground">
                  {getPercentage(margin)}
                </div>
              </div>
            </div>

            <Separator />
          </>
        )}

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Prix final</span>
          <span className="text-xl font-bold text-primary">
            {formatPrice(total)}
          </span>
        </div>

        {/* Informations complémentaires */}
        {showDetails && (
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Info className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Informations</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 ml-6">
              <li>• Taux de change: 1 KRW = {exchangeRate} FCFA</li>
              <li>• TVA incluse dans le prix final</li>
              <li>• Garantie internationale incluse</li>
              <li>• Délai de livraison: 7-14 jours</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}