import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CurrencySwitcher } from './CurrencySwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import coregabLogo from '@/assets/coregab-logo-horizontal.png';

interface NavigationProps {
  onDemoLogin?: (role: 'client' | 'commercial' | 'admin') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onDemoLogin }) => {
  const { t } = useLanguage();
  return (
    <nav className="bg-background/95 backdrop-blur-sm shadow-lg fixed w-full z-50 border-b border-border">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src={coregabLogo} 
            alt="COREGAB" 
            className="h-8 w-auto object-contain"
          />
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              {t('nav.home')}
            </Link>
            <Link to="/boutique" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              {t('nav.shop')}
            </Link>
            <Link to="#services" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              {t('nav.services')}
            </Link>
            <Link to="#contact" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              {t('nav.contact')}
            </Link>
          </div>
          
          <div className="flex gap-3">
            <CurrencySwitcher />
            <LanguageSwitcher />
            <ThemeToggle />
            <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-primary hover:text-primary-foreground">
              {t('nav.upgrade')}
            </Button>
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