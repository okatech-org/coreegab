import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Phone, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PhoneAuth() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 8) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un numéro de téléphone valide",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      toast({
        title: "Code envoyé",
        description: `Un code de vérification a été envoyé au ${phoneNumber}`,
      });
    }, 1500);
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir le code à 6 chiffres",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Demo logic: different codes redirect to different dashboards
      if (otpCode === '123456') {
        localStorage.setItem('userRole', 'client');
        localStorage.setItem('isAuthenticated', 'true');
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre espace client",
        });
        navigate('/client-dashboard');
      } else if (otpCode === '654321') {
        localStorage.setItem('userRole', 'commercial');
        localStorage.setItem('isAuthenticated', 'true');
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre espace commercial",
        });
        navigate('/commercial-dashboard');
      } else if (otpCode === '111111') {
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('isAuthenticated', 'true');
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre espace administrateur",
        });
        navigate('/admin-dashboard');
      } else {
        toast({
          title: "Code incorrect",
          description: "Le code de vérification est invalide. Codes démo: 123456 (client), 654321 (commercial), 111111 (admin)",
          variant: "destructive"
        });
      }
    }, 1000);
  };

  const resendCode = () => {
    toast({
      title: "Code renvoyé",
      description: `Un nouveau code a été envoyé au ${phoneNumber}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            COREGAB
          </h1>
          <p className="text-muted-foreground mt-2">
            Connectez-vous à votre compte
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center space-y-1">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              {step === 'phone' ? (
                <Phone className="w-6 h-6 text-blue-600" />
              ) : (
                <Shield className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <CardTitle className="text-xl">
              {step === 'phone' ? 'Numéro de téléphone' : 'Code de vérification'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {step === 'phone' 
                ? 'Entrez votre numéro pour recevoir un code de vérification'
                : `Code envoyé au ${phoneNumber}`
              }
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {step === 'phone' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-sm">
                      +241
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="XX XX XX XX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="rounded-l-none"
                      maxLength={10}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Format: 06 12 34 56 78 ou 07 12 34 56 78
                  </p>
                </div>

                <Button 
                  onClick={handleSendOtp} 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Envoi en cours...' : 'Recevoir le code'}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp">Code de vérification</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      value={otpCode}
                      onChange={(value) => setOtpCode(value)}
                      maxLength={6}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <div className="text-center">
                    <button 
                      onClick={resendCode}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Renvoyer le code
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={handleVerifyOtp} 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Vérification...' : 'Se connecter'}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => setStep('phone')}
                    className="w-full"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-900 mb-1">Codes de démonstration :</p>
                  <div className="text-xs text-blue-800 space-y-1">
                    <div>• <span className="font-mono">123456</span> - Accès Client</div>
                    <div>• <span className="font-mono">654321</span> - Accès Commercial</div>
                    <div>• <span className="font-mono">111111</span> - Accès Administrateur</div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}