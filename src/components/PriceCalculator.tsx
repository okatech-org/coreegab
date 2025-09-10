import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PriceBreakdown {
  supplierPrice: number;
  transportPrice: number;
  customsPrice: number;
  marginPrice: number;
  finalPrice: number;
}

export const PriceCalculator = () => {
  const [priceKRW, setPriceKRW] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [breakdown, setBreakdown] = useState<PriceBreakdown | null>(null);

  const calculatePrice = () => {
    const krwValue = parseFloat(priceKRW) || 0;
    const weightValue = parseFloat(weight) || 0;
    
    // Exchange rate: 1 KRW = 0.45 FCFA
    const exchangeRate = 0.45;
    
    // Calculations
    const supplierPrice = krwValue * exchangeRate;
    const transportPrice = 50000 + (weightValue * 1500); // Base + price per kg
    const customsRate = category === 'vehicles' ? 0.30 : 0.20;
    const customsPrice = supplierPrice * customsRate;
    const marginPrice = supplierPrice * 0.35;
    const finalPrice = supplierPrice + transportPrice + customsPrice + marginPrice;
    
    setBreakdown({
      supplierPrice,
      transportPrice,
      customsPrice,
      marginPrice,
      finalPrice
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <section className="py-12 lg:py-16 px-4 bg-background">
      <div className="container mx-auto max-w-4xl">
        <h3 className="text-2xl lg:text-3xl font-bold text-center mb-6 lg:mb-8 text-foreground">
          Calculateur de Prix Instantané
        </h3>
        <Card className="card-elevated bg-card border border-border">
          <CardHeader className="pb-4 lg:pb-6">
            <CardTitle className="text-lg lg:text-xl text-center text-card-foreground">
              Obtenez votre devis en temps réel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              <div className="space-y-2">
                <Label htmlFor="priceKRW" className="text-sm">Prix en Corée (KRW)</Label>
                <Input
                  id="priceKRW"
                  type="number"
                  placeholder="Ex: 5000000"
                  value={priceKRW}
                  onChange={(e) => setPriceKRW(e.target.value)}
                  className="h-10 lg:h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm">Catégorie</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-10 lg:h-12">
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Électronique</SelectItem>
                    <SelectItem value="vehicles">Véhicules</SelectItem>
                    <SelectItem value="appliances">Électroménager</SelectItem>
                    <SelectItem value="parts">Pièces détachées</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm">Poids (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Ex: 50"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="h-10 lg:h-12"
                />
              </div>
            </div>
            
            <div className="flex justify-center pt-2">
              <Button
                onClick={calculatePrice}
                variant="accent"
                size="lg"
                disabled={!priceKRW || !category || !weight}
                className="w-full sm:w-auto px-8 py-3"
              >
                Calculer le Prix
              </Button>
            </div>
            
            {breakdown && (
              <Card className="bg-card border border-primary/20 mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base lg:text-lg">Détail du Prix:</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 lg:space-y-3">
                  <div className="flex justify-between py-2 border-b border-border text-sm">
                    <span className="text-muted-foreground">Prix Fournisseur:</span>
                    <span className="font-semibold">{formatPrice(breakdown.supplierPrice)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border text-sm">
                    <span className="text-muted-foreground">Transport:</span>
                    <span className="font-semibold">{formatPrice(breakdown.transportPrice)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border text-sm">
                    <span className="text-muted-foreground">Douanes:</span>
                    <span className="font-semibold">{formatPrice(breakdown.customsPrice)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border text-sm">
                    <span className="text-muted-foreground">Notre Marge (35%):</span>
                    <span className="font-semibold">{formatPrice(breakdown.marginPrice)}</span>
                  </div>
                  <div className="flex justify-between py-3 text-lg lg:text-xl font-bold text-primary border-t-2 border-primary/20">
                    <span>PRIX FINAL:</span>
                    <span>{formatPrice(breakdown.finalPrice)}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};