import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

interface FeedbackIndicatorProps {
  type: 'success' | 'error' | 'info' | 'loading';
  message: string;
  onDismiss?: () => void;
  showIcon?: boolean;
}

export const FeedbackIndicator: React.FC<FeedbackIndicatorProps> = ({
  type,
  message,
  onDismiss,
  showIcon = true
}) => {
  const getIcon = () => {
    if (!showIcon) return null;
    
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-600" />;
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />;
      default:
        return null;
    }
  };

  const getVariant = () => {
    switch (type) {
      case 'success':
        return 'default' as const;
      case 'error':
        return 'destructive' as const;
      case 'info':
        return 'secondary' as const;
      case 'loading':
        return 'outline' as const;
      default:
        return 'secondary' as const;
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-md bg-background border">
      {getIcon()}
      <span className="text-sm">{message}</span>
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="h-6 w-6 p-0 ml-auto"
        >
          ×
        </Button>
      )}
    </div>
  );
};
