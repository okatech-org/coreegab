import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className,
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const spinner = (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && (
        <p className={cn('text-muted-foreground', textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Composant spécialisé pour les pages
export const PageLoader: React.FC<{ text?: string }> = ({ text = "Chargement..." }) => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" text={text} />
  </div>
);

// Composant pour les sections
export const SectionLoader: React.FC<{ text?: string; className?: string }> = ({ 
  text = "Chargement...", 
  className 
}) => (
  <div className={cn("flex items-center justify-center p-8", className)}>
    <LoadingSpinner size="md" text={text} />
  </div>
);

// Composant pour les boutons
export const ButtonLoader: React.FC = () => (
  <Loader2 className="h-4 w-4 animate-spin mr-2" />
);
