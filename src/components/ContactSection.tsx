import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    description: "Réponse sous 24h"
  },
  {
    icon: Phone,
    title: "Téléphone",
    value: "+241 XX XX XX XX",
    description: "Lun-Ven 8h-18h"
  },
  {
    icon: MapPin,
    title: "Adresse",
    value: "Libreville, Gabon",
    description: "Rendez-vous sur RDV"
  },
  {
    icon: Clock,
    title: "Horaires",
    value: "8h00 - 18h00",
    description: "Du lundi au vendredi"
  }
];

const faqItems = [
  {
    question: "Quels types de produits puis-je importer ?",
    answer: "Nous importons une large gamme de produits coréens : électronique (Samsung, LG), véhicules (Hyundai, Kia), électroménager, pièces détachées, cosmétiques K-beauty, et bien plus."
  },
  {
    question: "Combien de temps prend une livraison ?",
    answer: "Le délai moyen est de 3-4 semaines de la Corée vers le Gabon, incluant le transport maritime et les formalités douanières. Un suivi complet est fourni."
  },
  {
    question: "Comment sont calculés les prix ?",
    answer: "Nos prix incluent : prix fournisseur coréen, transport maritime, droits de douane, assurance, et notre marge de service. Utilisez notre calculateur pour un devis instantané."
  },
  {
    question: "Quelles sont les garanties ?",
    answer: "Tous nos produits sont garantis selon les standards du fabricant. Nous assurons également le transport et offrons un support après-vente complet."
  },
  {
    question: "Puis-je payer en plusieurs devises ?",
    answer: "Oui, nous acceptons les paiements en XAF (FCFA), KRW (Won coréen) et EUR avec des taux de change compétitifs mis à jour quotidiennement."
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
    
    // Simulate form submission
    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });

    // Reset form
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
    <section id="contact" className="py-20 bg-muted/20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold gradient-text mb-6">
            {t('nav.contact')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Une question ? Un projet d'importation ? Notre équipe d'experts 
            est là pour vous accompagner dans toutes vos démarches.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 mb-20">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-foreground mb-8">
              Informations de contact
            </h3>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="card-elevated bg-card border border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                        <info.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          {info.title}
                        </h4>
                        <p className="text-lg text-foreground mb-1">
                          {info.value}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="card-elevated bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-primary" />
                  Envoyer un message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+241 XX XX XX XX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="urgency">Niveau d'urgence</Label>
                      <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border border-border z-50">
                          <SelectItem value="low">Faible - Réponse sous 48h</SelectItem>
                          <SelectItem value="medium">Normale - Réponse sous 24h</SelectItem>
                          <SelectItem value="high">Élevée - Réponse sous 4h</SelectItem>
                          <SelectItem value="urgent">Urgente - Appel immédiat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Objet de votre demande"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Décrivez votre projet ou votre question en détail..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary-hover">
                    <Send className="w-5 h-5 mr-2" />
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-card rounded-2xl p-6 md:p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Questions Fréquentes
            </h3>
            <p className="text-muted-foreground">
              Trouvez rapidement les réponses à vos questions
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {faqItems.map((item, index) => (
              <Card key={index} className="bg-background border border-border">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 text-sm">
                        {item.question}
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-3 text-sm">
              Vous ne trouvez pas la réponse à votre question ?
            </p>
            <Button variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contactez-nous directement
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};