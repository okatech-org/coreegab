import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';

interface NavigationProps {
  onDemoLogin?: (role: 'client' | 'commercial' | 'admin') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onDemoLogin }) => {
  return (
    <nav className="bg-background/95 backdrop-blur-sm shadow-lg fixed w-full z-50 border-b border-border">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="openart-logo">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">C</span>
          </div>
          COREGAB
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Accueil
            </Link>
            <Link to="/boutique" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Boutique
            </Link>
            <Link to="#services" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Services
            </Link>
            <Link to="#contact" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Contact
            </Link>
          </div>
          
          <div className="flex gap-3">
            <ThemeToggle />
            <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-primary hover:text-primary-foreground">
              Upgrade
            </Button>
            <Link to="/auth">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary-hover">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};