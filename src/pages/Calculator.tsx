import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, TrendingUp, DollarSign, Truck, Building } from 'lucide-react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from '@/components/ThemeToggle';

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
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar />
        <div className="flex-1">
          {/* Header */}
          <header className="bg-card shadow-lg sticky top-0 z-40 border-b border-border">
            <div className="container mx-auto px-4 lg:px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SidebarTrigger />
                  <div className="flex items-center gap-2">
                    <Calculator className="w-6 h-6 text-primary" />
                    <h1 className="text-xl font-bold text-foreground">Calculateur de Prix</h1>
                  </div>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </header>

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
                          <SelectValue placeholder="Choisir une catégorie" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="electronics">Électronique</SelectItem>
                          <SelectItem value="vehicles">Véhicules</SelectItem>
                          <SelectItem value="appliances">Électroménager</SelectItem>
                          <SelectItem value="parts">Pièces détachées</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-foreground">Poids (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="Ex: 50"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="h-12 bg-background border-border"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button
                      onClick={calculatePrice}
                      size="lg"
                      disabled={!priceKRW || !category || !weight}
                      className="w-full md:w-auto bg-primary hover:bg-primary-hover text-primary-foreground"
                    >
                      <Calculator className="w-5 h-5 mr-2" />
                      Calculer le Prix
                    </Button>
                  </div>
                  
                  {breakdown && (
                    <Card className="bg-card border border-primary/20">
                      <CardHeader>
                        <CardTitle className="text-lg text-foreground">Détail du Prix:</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-border">
                              <div className="flex items-center gap-2">
                                <Building className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Prix Fournisseur:</span>
                              </div>
                              <span className="font-semibold text-foreground">{formatPrice(breakdown.supplierPrice)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-border">
                              <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Transport:</span>
                              </div>
                              <span className="font-semibold text-foreground">{formatPrice(breakdown.transportPrice)}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-border">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Douanes:</span>
                              </div>
                              <span className="font-semibold text-foreground">{formatPrice(breakdown.customsPrice)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-border">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Notre Marge (35%):</span>
                              </div>
                              <span className="font-semibold text-foreground">{formatPrice(breakdown.marginPrice)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center py-4 text-xl font-bold text-primary border-t-2 border-primary/20 bg-primary/5 rounded-lg px-4">
                          <span>PRIX FINAL:</span>
                          <span>{formatPrice(breakdown.finalPrice)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>

              {/* Information Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-card border border-border">
                  <CardContent className="p-6 text-center">
                    <Building className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Prix Fournisseur</h3>
                    <p className="text-sm text-muted-foreground">
                      Prix du produit en Corée converti en FCFA (taux: 1 KRW = 0.45 FCFA)
                    </p>
                  </CardContent>
                </Card>

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
                    <DollarSign className="w-12 h-12 text-accent mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Douanes & Marge</h3>
                    <p className="text-sm text-muted-foreground">
                      Droits de douane (20-30%) + Notre marge de service (35%)
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}