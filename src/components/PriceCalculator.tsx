import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { useMonitoring } from '@/lib/monitoring';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Calculator, TrendingUp, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
  const [isCalculating, setIsCalculating] = useState(false);
  const [priceSettings, setPriceSettings] = useState<any>(null);
  const [error, setError] = useState<string>('');
  
  const { toast } = useToast();
  const { trackEvent } = useMonitoring();
  const { formatPrice } = useCurrency();

  // Charger les paramètres de prix depuis Supabase
  useEffect(() => {
    const loadPriceSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('price_settings')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        setPriceSettings(data);
      } catch (error) {
        console.error('Error loading price settings:', error);
        // Utiliser des valeurs par défaut
        setPriceSettings({
          exchange_rate_krw_xaf: 0.65,
          transport_base: 50000,
          transport_per_kg: 1500,
          margin_rate: 0.35
        });
      }
    };

    loadPriceSettings();
  }, []);

  const validateInputs = () => {
    const krwValue = parseFloat(priceKRW);
    const weightValue = parseFloat(weight);

    if (!krwValue || krwValue <= 0) {
      setError('Veuillez entrer un prix valide en KRW');
      return false;
    }
    if (!category) {
      setError('Veuillez sélectionner une catégorie');
      return false;
    }
    if (!weightValue || weightValue <= 0) {
      setError('Veuillez entrer un poids valide');
      return false;
    }
    if (weightValue > 10000) {
      setError('Le poids ne peut pas dépasser 10 tonnes');
      return false;
    }

    setError('');
    return true;
  };

  const calculatePrice = async () => {
    if (!validateInputs() || !priceSettings) return;

    setIsCalculating(true);
    trackEvent('price_calculation_started', { 
      category, 
      priceKRW: parseFloat(priceKRW), 
      weight: parseFloat(weight) 
    });

    try {
      // Simuler un délai pour l'UX
      await new Promise(resolve => setTimeout(resolve, 800));

      const krwValue = parseFloat(priceKRW);
      const weightValue = parseFloat(weight);
      
      // Utiliser les paramètres réels de la base de données
      const exchangeRate = priceSettings.exchange_rate_krw_xaf;
      const transportBase = priceSettings.transport_base;
      const transportPerKg = priceSettings.transport_per_kg;
      const marginRate = priceSettings.margin_rate;
      
      // Calculs
      const supplierPrice = krwValue * exchangeRate;
      const transportPrice = transportBase + (weightValue * transportPerKg);
      
      // Taux de douane selon la catégorie
      const customsRates = {
        vehicles: 0.30,
        electronics: 0.15,
        appliances: 0.20,
        parts: 0.10
      };
      const customsRate = customsRates[category as keyof typeof customsRates] || 0.20;
      const customsPrice = supplierPrice * customsRate;
      const marginPrice = supplierPrice * marginRate;
      const finalPrice = supplierPrice + transportPrice + customsPrice + marginPrice;
      
      setBreakdown({
        supplierPrice,
        transportPrice,
        customsPrice,
        marginPrice,
        finalPrice
      });

      trackEvent('price_calculation_completed', { 
        category, 
        finalPrice,
        currency: 'XAF'
      });

      toast({
        title: "Calcul terminé",
        description: `Prix final: ${formatPrice(finalPrice)}`,
      });

    } catch (error) {
      setError('Erreur lors du calcul. Veuillez réessayer.');
      toast({
        title: "Erreur de calcul",
        description: "Une erreur est survenue lors du calcul",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const formatPriceLocal = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <section className="floating-spacing px-4 section-glass">
      <div className="container mx-auto max-w-4xl">
        <h3 className="text-2xl lg:text-3xl font-bold text-center mb-6 lg:mb-8 text-foreground">
          Calculateur de Prix Instantané
        </h3>
        <Card className="floating-card theme-transition">
          <CardHeader className="pb-4 lg:pb-6">
            <CardTitle className="text-lg lg:text-xl text-center text-card-foreground flex items-center justify-center gap-2">
              <Calculator className="w-5 h-5" />
              Obtenez votre devis en temps réel
            </CardTitle>
            {priceSettings && (
              <p className="text-sm text-muted-foreground text-center">
                Taux de change: 1 KRW = {priceSettings.exchange_rate_krw_xaf} FCFA
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4 lg:space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <span className="text-sm text-destructive">{error}</span>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              <div className="space-y-2">
                <Label htmlFor="priceKRW" className="text-sm font-medium">Prix en Corée (KRW)</Label>
                <Input
                  id="priceKRW"
                  type="number"
                  placeholder="Ex: 5000000"
                  value={priceKRW}
                  onChange={(e) => {
                    setPriceKRW(e.target.value);
                    setError('');
                  }}
                  className="h-10 lg:h-12"
                  min="1"
                  max="999999999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">Catégorie</Label>
                <Select value={category} onValueChange={(value) => {
                  setCategory(value);
                  setError('');
                }}>
                  <SelectTrigger className="h-10 lg:h-12">
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Électronique (15% douane)</SelectItem>
                    <SelectItem value="vehicles">Véhicules (30% douane)</SelectItem>
                    <SelectItem value="appliances">Électroménager (20% douane)</SelectItem>
                    <SelectItem value="parts">Pièces détachées (10% douane)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm font-medium">Poids (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Ex: 50"
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                    setError('');
                  }}
                  className="h-10 lg:h-12"
                  min="0.1"
                  max="10000"
                  step="0.1"
                />
              </div>
            </div>
            
            <div className="flex justify-center pt-2">
              <Button
                onClick={calculatePrice}
                size="lg"
                disabled={!priceKRW || !category || !weight || isCalculating || !priceSettings}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {isCalculating ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Calcul en cours...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculer le Prix
                  </>
                )}
              </Button>
            </div>
            
            {breakdown && (
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/50 dark:border-blue-800/50 mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base lg:text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Détail du Prix
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 lg:space-y-3">
                  <div className="flex justify-between py-2 border-b border-border/50 text-sm">
                    <span className="text-muted-foreground">Prix Fournisseur:</span>
                    <span className="font-semibold">{formatPriceLocal(breakdown.supplierPrice)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50 text-sm">
                    <span className="text-muted-foreground">Transport:</span>
                    <span className="font-semibold">{formatPriceLocal(breakdown.transportPrice)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50 text-sm">
                    <span className="text-muted-foreground">Douanes:</span>
                    <span className="font-semibold">{formatPriceLocal(breakdown.customsPrice)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50 text-sm">
                    <span className="text-muted-foreground">Notre Marge ({Math.round((priceSettings?.margin_rate || 0.35) * 100)}%):</span>
                    <span className="font-semibold">{formatPriceLocal(breakdown.marginPrice)}</span>
                  </div>
                  <div className="flex justify-between py-3 text-lg lg:text-xl font-bold text-blue-600 dark:text-blue-400 border-t-2 border-blue-200/50 dark:border-blue-800/50 bg-white/50 dark:bg-black/20 rounded-lg px-3">
                    <span>PRIX FINAL:</span>
                    <span>{formatPriceLocal(breakdown.finalPrice)}</span>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground text-center">
                      Prix calculé avec les taux actuels • Valable 48h
                    </p>
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