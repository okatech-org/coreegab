import React from 'react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  onDemoLogin: (role: 'client' | 'commercial' | 'admin') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onDemoLogin }) => {
  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm fixed w-full z-50 border-b border-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold gradient-text">
          COREGAB
        </h1>
        <div className="hidden md:flex gap-3">
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
    </nav>
  );
};