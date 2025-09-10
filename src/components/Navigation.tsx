import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface NavigationProps {
  onDemoLogin: (role: 'client' | 'commercial' | 'admin') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onDemoLogin }) => {
  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm fixed w-full z-50 border-b border-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold gradient-text">
          COREGAB
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-4">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Accueil
            </Link>
            <Link to="/boutique" className="text-foreground hover:text-primary transition-colors">
              Boutique
            </Link>
            <Link to="#services" className="text-foreground hover:text-primary transition-colors">
              Services
            </Link>
            <Link to="#contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
          
          <div className="flex gap-2">
            <Link to="/auth">
              <Button variant="outline" size="sm">
                Connexion
              </Button>
            </Link>
            <Button
              onClick={() => onDemoLogin('client')}
              variant="default"
              size="sm"
            >
              Démo Client
            </Button>
            <Button
              onClick={() => onDemoLogin('commercial')}
              variant="secondary"
              size="sm"
            >
              Démo Commercial
            </Button>
            <Button
              onClick={() => onDemoLogin('admin')}
              variant="accent"
              size="sm"
            >
              Démo Admin
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};