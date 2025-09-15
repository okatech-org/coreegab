import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, TrendingUp, DollarSign, Truck, Building } from 'lucide-react';
import { NewVerticalMenu } from '@/components/NewVerticalMenu';
import { DesktopHeader } from '@/components/DesktopHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PriceBreakdown {
  supplierPrice: number;
  transportPrice: number;
  customsPrice: number;
  marginPrice: number;
  finalPrice: number;
}

export default function CalculatorPage() {
  const [priceKRW, setPriceKRW] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [breakdown, setBreakdown] = useState<PriceBreakdown | null>(null);
  const { t } = useLanguage();
  const { formatPrice, currency, exchangeRates } = useCurrency();

  const calculatePrice = () => {
    const krwValue = parseFloat(priceKRW) || 0;
    const weightValue = parseFloat(weight) || 0;
    
    // Convert from KRW to XAF using current exchange rates
    // Since XAF is base currency, we need to convert KRW to XAF
    const krwToXafRate = 1 / exchangeRates.KRW; // Inverse rate since XAF is base
    
    // Calculations in XAF
    const supplierPrice = krwValue * krwToXafRate;
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

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="fixed top-4 left-4 bottom-4 z-50 hidden lg:block">
        <NewVerticalMenu />
      </div>
      <div className="flex-1 lg:pl-[340px]">
        {/* Header unifié */}
        <DesktopHeader 
          title="Calculateur de Prix" 
          showNavigation={false}
        >
          <Calculator className="w-5 h-5 text-primary ml-2" />
        </DesktopHeader>

        <main className="container mx-auto px-4 lg:px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Calculateur de Prix Instantané
              </h2>
              <p className="text-lg text-muted-foreground">
                Obtenez votre devis en temps réel pour vos importations de Corée
              </p>
            </div>

            {/* Main Calculator Card */}
            <Card className="card-elevated bg-card border border-border mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-center text-foreground">
                  Calculez votre prix final
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="priceKRW" className="text-foreground">Prix en Corée (KRW)</Label>
                    <Input
                      id="priceKRW"
                      type="number"
                      placeholder="Ex: 5000000"
                      value={priceKRW}
                      onChange={(e) => setPriceKRW(e.target.value)}
                      className="h-12 bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-foreground">Catégorie</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="h-12 bg-background border-border">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Électronique</SelectItem>
                        <SelectItem value="clothing">Vêtements</SelectItem>
                        <SelectItem value="cosmetics">Cosmétiques</SelectItem>
                        <SelectItem value="vehicles">Véhicules</SelectItem>
                        <SelectItem value="home">Maison & Décoration</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-foreground">Poids (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 2.5"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="h-12 bg-background border-border"
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button 
                    onClick={calculatePrice} 
                    className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={!priceKRW || !category || !weight}
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculer le Prix Final
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {breakdown && (
              <Card className="card-elevated bg-card border border-border mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <TrendingUp className="w-5 h-5" />
                    Détail du Calcul
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">Prix Fournisseur</span>
                          </div>
                          <span className="font-semibold text-foreground">{formatPrice(breakdown.supplierPrice, 'XAF')}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">Transport</span>
                          </div>
                          <span className="font-semibold text-foreground">{formatPrice(breakdown.transportPrice, 'XAF')}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">Douanes</span>
                          </div>
                          <span className="font-semibold text-foreground">{formatPrice(breakdown.customsPrice, 'XAF')}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <div className="flex items-center gap-2">
                            <Calculator className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">Marge COREEGAB</span>
                          </div>
                          <span className="font-semibold text-foreground">{formatPrice(breakdown.marginPrice, 'XAF')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-4 text-xl font-bold text-primary border-t-2 border-primary/20 bg-primary/5 rounded-lg px-4">
                      <span>Prix Final</span>
                      <div className="text-right">
                        <div>{formatPrice(breakdown.finalPrice, 'XAF')}</div>
                        <div className="text-sm text-muted-foreground">
                          Tous frais inclus
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Information Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-card border border-border">
                <CardContent className="p-6 text-center">
                  <Truck className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Transport</h3>
                  <p className="text-sm text-muted-foreground">
                    50,000 FCFA de base + 1,500 FCFA par kg de marchandise
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardContent className="p-6 text-center">
                  <Building className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Douanes</h3>
                  <p className="text-sm text-muted-foreground">
                    Droits de douane (20-30%) selon la catégorie de produit
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardContent className="p-6 text-center">
                  <DollarSign className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Service COREEGAB</h3>
                  <p className="text-sm text-muted-foreground">
                    Marge de service (35%) pour notre accompagnement complet
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}