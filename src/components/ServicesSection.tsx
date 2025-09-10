import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const services = [
  {
    icon: Search,
    title: "Sourcing Intelligent",
    description: "IA pour trouver les meilleurs produits coréens selon vos critères.",
    features: ["Recherche IA", "Comparaison auto", "Qualité vérifiée"]
  },
  {
    icon: Calculator,
    title: "Calcul Instantané",
    description: "Devis précis en temps réel incluant tous les frais.",
    features: ["Prix transparent", "Calcul auto", "Devis immédiat"]
  },
  {
    icon: Truck,
    title: "Transport Sécurisé",
    description: "Transport de Corée vers Gabon avec suivi complet.",
    features: ["Suivi temps réel", "Assurance incluse", "Livraison rapide"]
  },
  {
    icon: Shield,
    title: "Conformité",
    description: "Gestion complète des formalités et certifications.",
    features: ["Conformité garantie", "Dédouanement", "Certifications"]
  },
  {
    icon: MessageCircle,
    title: "Support Expert",
    description: "Accompagnement personnalisé par nos experts.",
    features: ["Conseils experts", "Support 24/7", "Suivi perso"]
  },
  {
    icon: Globe,
    title: "Multi-devises",
    description: "Paiements en XAF, KRW et EUR selon vos besoins.",
    features: ["Taux compétitifs", "Paiement sécurisé", "Multi-devises"]
  }
];

const processSteps = [
  {
    step: "01",
    title: "Recherche",
    description: "IA trouve vos produits",
    icon: Search
  },
  {
    step: "02", 
    title: "Devis",
    description: "Prix final instantané",
    icon: Calculator
  },
  {
    step: "03",
    title: "Commande",
    description: "Paiement sécurisé",
    icon: CheckCircle
  },
  {
    step: "04",
    title: "Livraison",
    description: "Suivi jusqu'à vous",
    icon: Truck
  }
];

export const ServicesSection = () => {
  const { t } = useLanguage();

  return (
    <section id="services" className="py-12 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold gradient-text mb-4">
            {t('nav.services')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Solution complète pour vos importations depuis la Corée du Sud
          </p>
        </div>

        {/* Services Carousel */}
        <div className="mb-12">
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent className="-ml-2 md:-ml-4">
              {services.map((service, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="card-elevated bg-card border border-border h-full">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                          <service.icon className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-bold text-foreground text-sm">
                          {service.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {service.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs px-2 py-1">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        {/* Compact Process */}
        <div className="bg-muted/30 rounded-xl p-6 mb-10">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-foreground mb-2">
              Comment ça marche ?
            </h3>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center relative flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full mx-auto mb-3">
                  <step.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-secondary-foreground">
                    {step.step}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-foreground mb-1">
                  {step.title}
                </h4>
                <p className="text-xs text-muted-foreground max-w-[80px]">
                  {step.description}
                </p>
                {index < processSteps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-6 -right-6 w-4 h-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Compact CTA */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground mb-3">
            Prêt à commencer ?
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="bg-primary hover:bg-primary-hover">
              <Search className="w-4 h-4 mr-2" />
              Rechercher
            </Button>
            <Button variant="outline">
              <Calculator className="w-4 h-4 mr-2" />
              Calculer
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};