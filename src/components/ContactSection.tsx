import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "contact@coregab.com",
    description: "Réponse 24h"
  },
  {
    icon: Phone,
    title: "Téléphone",
    value: "+241 XX XX XX XX",
    description: "8h-18h"
  },
  {
    icon: MapPin,
    title: "Adresse",
    value: "Libreville, Gabon",
    description: "Sur RDV"
  }
];

const faqItems = [
  {
    question: "Quels produits puis-je importer ?",
    answer: "Électronique, véhicules, électroménager, pièces détachées, cosmétiques K-beauty..."
  },
  {
    question: "Délai de livraison ?",
    answer: "3-4 semaines de Corée vers Gabon, transport maritime inclus avec suivi complet."
  },
  {
    question: "Comment sont calculés les prix ?",
    answer: "Prix fournisseur + transport + douanes + assurance + marge. Calculateur disponible."
  },
  {
    question: "Quelles garanties ?",
    answer: "Garantie fabricant + assurance transport + support après-vente complet."
  }
];

export const ContactSection = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    urgency: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });

    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      urgency: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-12 bg-muted/20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold gradient-text mb-4">
            {t('nav.contact')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Notre équipe d'experts est là pour vous accompagner dans vos importations.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="contact" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="contact">Contact & Formulaire</TabsTrigger>
              <TabsTrigger value="faq">Questions Fréquentes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="contact" className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Contact Info - Compact */}
                <div className="lg:col-span-1">
                  <h3 className="text-xl font-bold text-foreground mb-6">Nos coordonnées</h3>
                  <div className="space-y-4">
                    {contactInfo.map((info, index) => (
                      <Card key={index} className="bg-card border border-border">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                              <info.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground text-sm">
                                {info.title}
                              </h4>
                              <p className="text-foreground text-sm">
                                {info.value}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {info.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Contact Form - Compact */}
                <div className="lg:col-span-2">
                  <Card className="card-elevated bg-card border border-border">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl text-foreground flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-primary" />
                        Envoyer un message
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label htmlFor="name" className="text-sm">Nom complet *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              placeholder="Votre nom"
                              className="h-9"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="email" className="text-sm">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="votre@email.com"
                              className="h-9"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label htmlFor="phone" className="text-sm">Téléphone</Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              placeholder="+241 XX XX XX XX"
                              className="h-9"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="urgency" className="text-sm">Urgence</Label>
                            <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent className="bg-card border border-border z-50">
                                <SelectItem value="low">Faible - 48h</SelectItem>
                                <SelectItem value="medium">Normale - 24h</SelectItem>
                                <SelectItem value="high">Élevée - 4h</SelectItem>
                                <SelectItem value="urgent">Urgente</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="subject" className="text-sm">Sujet *</Label>
                          <Input
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => handleInputChange('subject', e.target.value)}
                            placeholder="Objet de votre demande"
                            className="h-9"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="message" className="text-sm">Message *</Label>
                          <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            placeholder="Décrivez votre projet..."
                            rows={4}
                            required
                          />
                        </div>

                        <Button type="submit" className="w-full bg-primary hover:bg-primary-hover">
                          <Send className="w-4 h-4 mr-2" />
                          Envoyer le message
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="faq">
              {/* FAQ Section - Ultra Compact */}
              <Card className="bg-card border border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-foreground text-center">
                    Questions Fréquentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {faqItems.map((item, index) => (
                      <Card key={index} className="bg-background border border-border">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-foreground mb-2 text-sm">
                                {item.question}
                              </h4>
                              <p className="text-muted-foreground text-xs leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="text-center mt-6">
                    <p className="text-muted-foreground mb-3 text-sm">
                      Autre question ?
                    </p>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Nous contacter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};