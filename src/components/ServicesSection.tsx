import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Truck, 
  Calculator, 
  Search, 
  MessageCircle, 
  Shield, 
  Globe, 
  Clock, 
  Star,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const services = [
  {
    icon: Search,
    title: "Sourcing Intelligent",
    description: "Notre IA trouve les meilleurs produits coréens selon vos critères spécifiques.",
    features: ["Recherche IA avancée", "Comparaison automatique", "Vérification qualité"]
  },
  {
    icon: Calculator,
    title: "Calcul de Prix Instantané",
    description: "Obtenez un devis précis en temps réel incluant tous les frais.",
    features: ["Prix transparent", "Calcul automatique", "Devis immédiat"]
  },
  {
    icon: Truck,
    title: "Transport & Logistique",
    description: "Transport sécurisé de la Corée vers le Gabon avec suivi complet.",
    features: ["Suivi en temps réel", "Assurance incluse", "Livraison rapide"]
  },
  {
    icon: Shield,
    title: "Conformité & Douanes",
    description: "Gestion complète des formalités douanières et certifications.",
    features: ["Conformité garantie", "Dédouanement rapide", "Certifications"]
  },
  {
    icon: MessageCircle,
    title: "Support Commercial",
    description: "Accompagnement personnalisé par nos experts commerciaux.",
    features: ["Conseils experts", "Support 24/7", "Suivi personnalisé"]
  },
  {
    icon: Globe,
    title: "Multi-devises",
    description: "Paiements et conversions en XAF, KRW et EUR selon vos besoins.",
    features: ["Taux compétitifs", "Paiement sécurisé", "Multi-devises"]
  }
];

const processSteps = [
  {
    step: "01",
    title: "Recherche & Sélection",
    description: "Utilisez notre IA pour trouver les produits parfaits",
    icon: Search
  },
  {
    step: "02", 
    title: "Devis Instantané",
    description: "Obtenez votre prix final en quelques clics",
    icon: Calculator
  },
  {
    step: "03",
    title: "Commande & Paiement",
    description: "Finalisez votre commande en toute sécurité",
    icon: CheckCircle
  },
  {
    step: "04",
    title: "Transport & Livraison",
    description: "Suivez votre commande jusqu'à la livraison",
    icon: Truck
  }
];

export const ServicesSection = () => {
  const { t } = useLanguage();

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold gradient-text mb-6">
            {t('nav.services')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Une solution complète pour vos importations depuis la Corée du Sud, 
            de la recherche de produits à la livraison finale.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <Card key={index} className="card-elevated bg-card border border-border group hover:scale-105 transition-transform duration-300">
              <CardContent className="p-8">
                <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Section */}
        <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Comment ça marche ?
            </h3>
            <p className="text-lg text-muted-foreground">
              Un processus simple et transparent en 4 étapes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="flex items-center justify-center w-20 h-20 bg-primary rounded-full mx-auto mb-6">
                  <step.icon className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-secondary-foreground">
                    {step.step}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-foreground mb-3">
                  {step.title}
                </h4>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
                {index < processSteps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-10 -right-4 w-6 h-6 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Prêt à commencer ?
          </h3>
          <p className="text-muted-foreground mb-8">
            Découvrez nos produits ou calculez votre devis dès maintenant
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary-hover">
              <Search className="w-5 h-5 mr-2" />
              Rechercher des produits
            </Button>
            <Button size="lg" variant="outline">
              <Calculator className="w-5 h-5 mr-2" />
              Calculer un devis
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};