import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Banknote
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';

// Initialiser Stripe (vous devrez remplacer par votre clé publique)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

interface PaymentFormProps {
  amount: number;
  currency: 'XAF' | 'EUR' | 'USD';
  orderId: string;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: any) => void;
}

// Composant de paiement par carte
const StripePaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency,
  orderId,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setIsLoading(false);
      return;
    }

    try {
      // Créer un Payment Intent côté serveur (vous devrez implémenter l'endpoint)
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Stripe utilise les centimes
          currency: currency.toLowerCase(),
          orderId,
        }),
      });

      const { client_secret } = await response.json();

      // Confirmer le paiement
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        onError(result.error);
        toast({
          title: "Erreur de paiement",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        onSuccess(result.paymentIntent);
        toast({
          title: "Paiement réussi",
          description: "Votre commande a été confirmée !",
        });
      }
    } catch (error) {
      onError(error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du paiement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || isLoading} 
        className="w-full"
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        <CreditCard className="w-4 h-4 mr-2" />
        Payer {amount} {currency}
      </Button>
    </form>
  );
};

// Composant de paiement mobile money
const MobileMoneyForm: React.FC<PaymentFormProps> = ({
  amount,
  currency,
  orderId,
  onSuccess,
  onError,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provider, setProvider] = useState<'orange' | 'mtn'>('orange');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Simuler l'API de paiement mobile money
      // En production, vous utiliseriez l'API Orange Money ou MTN Mobile Money
      
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulation
      
      // Simuler un succès (85% de chance)
      if (Math.random() > 0.15) {
        const mockPaymentResult = {
          id: `mm_${Date.now()}`,
          status: 'succeeded',
          amount,
          currency,
          orderId,
          provider,
          phoneNumber,
        };
        
        onSuccess(mockPaymentResult);
        toast({
          title: "Paiement mobile réussi",
          description: `Paiement de ${amount} ${currency} confirmé via ${provider.toUpperCase()}`,
        });
      } else {
        throw new Error('Paiement refusé par le fournisseur');
      }
    } catch (error) {
      onError(error);
      toast({
        title: "Erreur de paiement mobile",
        description: "Le paiement a échoué. Vérifiez votre solde et réessayez.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="provider">Opérateur</Label>
        <Select value={provider} onValueChange={(value: 'orange' | 'mtn') => setProvider(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir un opérateur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="orange">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                Orange Money
              </div>
            </SelectItem>
            <SelectItem value="mtn">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                MTN Mobile Money
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Numéro de téléphone</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+241 XX XX XX XX"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm">Montant à payer:</span>
          <span className="font-bold">{amount} {currency}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Frais de transaction:</span>
          <span>Inclus</span>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={!phoneNumber || isLoading} 
        className="w-full"
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        <Smartphone className="w-4 h-4 mr-2" />
        Payer avec {provider.toUpperCase()}
      </Button>
    </form>
  );
};

// Composant principal du système de paiement
interface PaymentSystemProps {
  amount: number;
  currency: 'XAF' | 'EUR' | 'USD';
  orderId: string;
  onSuccess: (result: any) => void;
  onError: (error: any) => void;
  className?: string;
}

export const PaymentSystem: React.FC<PaymentSystemProps> = ({
  amount,
  currency,
  orderId,
  onSuccess,
  onError,
  className,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile' | 'bank'>('mobile');
  const mobile = useMobileOptimizations();
  const { formatPrice } = useCurrency();

  // Méthodes de paiement recommandées selon la région/device
  const getRecommendedMethod = () => {
    if (currency === 'XAF') return 'mobile'; // Mobile Money pour l'Afrique
    if (mobile.isMobile) return 'mobile';
    return 'card';
  };

  const recommendedMethod = getRecommendedMethod();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Paiement sécurisé
        </CardTitle>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Commande #{orderId.slice(0, 8)}</span>
          <span className="text-lg font-bold">{formatPrice(amount, currency)}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mobile" className="flex items-center gap-1">
              <Smartphone className="w-3 h-3" />
              Mobile
              {recommendedMethod === 'mobile' && (
                <Badge variant="secondary" className="ml-1 text-xs">Recommandé</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="card" className="flex items-center gap-1">
              <CreditCard className="w-3 h-3" />
              Carte
              {recommendedMethod === 'card' && (
                <Badge variant="secondary" className="ml-1 text-xs">Recommandé</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="bank" className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              Virement
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mobile" className="space-y-4">
            <div className="text-center p-4">
              <Smartphone className="w-12 h-12 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Paiement Mobile Money</h3>
              <p className="text-sm text-muted-foreground">
                Paiement sécurisé via Orange Money ou MTN Mobile Money
              </p>
            </div>
            <MobileMoneyForm
              amount={amount}
              currency={currency}
              orderId={orderId}
              onSuccess={onSuccess}
              onError={onError}
            />
          </TabsContent>

          <TabsContent value="card" className="space-y-4">
            <div className="text-center p-4">
              <CreditCard className="w-12 h-12 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Paiement par Carte</h3>
              <p className="text-sm text-muted-foreground">
                Visa, Mastercard et cartes internationales acceptées
              </p>
            </div>
            <Elements stripe={stripePromise}>
              <StripePaymentForm
                amount={amount}
                currency={currency}
                orderId={orderId}
                onSuccess={onSuccess}
                onError={onError}
              />
            </Elements>
          </TabsContent>

          <TabsContent value="bank" className="space-y-4">
            <div className="text-center p-4">
              <Building2 className="w-12 h-12 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Virement Bancaire</h3>
              <p className="text-sm text-muted-foreground">
                Paiement par virement bancaire traditionnel
              </p>
            </div>
            
            <Card className="bg-muted/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Bénéficiaire:</span>
                  <span className="font-medium">COREEGAB SARL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">IBAN:</span>
                  <span className="font-mono text-sm">GA21 4002 0000 0000 0000 0001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">BIC/SWIFT:</span>
                  <span className="font-mono text-sm">BGBAGALX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Référence:</span>
                  <span className="font-mono text-sm">CMD-{orderId.slice(0, 8)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Montant:</span>
                  <span>{formatPrice(amount, currency)}</span>
                </div>
              </CardContent>
            </Card>

            <div className="text-xs text-muted-foreground p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <CheckCircle className="w-4 h-4 inline mr-1" />
              Votre commande sera confirmée dès réception du virement (24-48h).
            </div>

            <Button className="w-full" onClick={() => onSuccess({ method: 'bank_transfer' })}>
              <Banknote className="w-4 h-4 mr-2" />
              Confirmer les informations de virement
            </Button>
          </TabsContent>
        </Tabs>

        {/* Informations de sécurité */}
        <div className="mt-6 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Paiement 100% sécurisé</span>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            Vos données bancaires sont protégées par un cryptage SSL 256-bit
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Hook pour gérer les paiements
export const usePayment = () => {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const processPayment = async (
    amount: number,
    currency: 'XAF' | 'EUR' | 'USD',
    orderId: string,
    method: 'card' | 'mobile' | 'bank'
  ) => {
    setPaymentStatus('processing');
    
    try {
      // Logique de traitement du paiement selon la méthode
      const result = await new Promise((resolve, reject) => {
        // Simulation du traitement
        setTimeout(() => {
          if (Math.random() > 0.1) { // 90% de succès
            resolve({
              id: `pay_${Date.now()}`,
              amount,
              currency,
              orderId,
              method,
              status: 'succeeded',
            });
          } else {
            reject(new Error('Payment failed'));
          }
        }, 2000);
      });

      setPaymentResult(result);
      setPaymentStatus('success');
      return { success: true, result };
    } catch (error) {
      setPaymentStatus('error');
      return { success: false, error };
    }
  };

  const resetPayment = () => {
    setPaymentStatus('idle');
    setPaymentResult(null);
  };

  return {
    paymentStatus,
    paymentResult,
    processPayment,
    resetPayment,
  };
};

// PaymentSystem déjà exporté plus haut
