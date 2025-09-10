import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-muted text-foreground py-12 px-4 border-t border-border">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-4">COREGAB</h3>
            <p className="text-muted-foreground text-sm">
              Votre partenaire de confiance pour l'import de produits coréens au Gabon
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-foreground">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">+241 XX XX XX XX</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">contact@coregab.ga</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Libreville, Gabon</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-foreground">Nos Services</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>Import véhicules</div>
              <div>Électronique & High-tech</div>
              <div>Électroménager</div>
              <div>Pièces détachées</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 COREGAB. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};