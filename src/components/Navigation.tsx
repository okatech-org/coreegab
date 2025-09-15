import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CurrencySwitcher } from './CurrencySwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavigationProps {
  onDemoLogin?: (role: 'client' | 'commercial' | 'admin') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onDemoLogin }) => {
  const { t } = useLanguage();
  return (
    <nav className="bg-background/95 backdrop-blur-sm shadow-lg sticky top-0 z-40 border-b border-border">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="openart-logo flex items-center gap-3">
          <img 
            src="/lovable-uploads/ff7ce1b8-d2a2-4701-acda-806f793d401b.png" 
            alt="COREEGAB Logo" 
            className="w-8 h-8"
          />
          <span className="text-foreground font-bold text-xl">COREEGAB</span>
        </Link>
        
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              {t('nav.home')}
            </Link>
            <Link to="/boutique" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              {t('nav.shop')}
            </Link>
            <Link to="/calculator" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              {t('nav.calculator')}
            </Link>
            <a href="/#services" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              {t('nav.services')}
            </a>
            <a href="/#contact" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              {t('nav.contact')}
            </a>
          </div>
          
          <div className="flex gap-3">
            <div className="hidden md:flex gap-3">
              <CurrencySwitcher />
              <LanguageSwitcher />
              <ThemeToggle />
              <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-primary hover:text-primary-foreground">
                {t('nav.upgrade')}
              </Button>
            </div>
            <Link to="/auth">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary-hover">
                {t('nav.login')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};