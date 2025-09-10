import React from 'react';
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrency, type Currency } from '@/contexts/CurrencyContext';

const currencies = {
  XAF: { name: 'FCFA', symbol: 'FCFA', flag: '🇨🇫' },
  KRW: { name: '원 (Won)', symbol: '₩', flag: '🇰🇷' },
  EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺' }
};

export const CurrencySwitcher = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <DollarSign className="h-4 w-4" />
          <span className="hidden sm:inline">{currencies[currency].flag}</span>
          <span className="text-xs">{currencies[currency].symbol}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {Object.entries(currencies).map(([code, { name, symbol, flag }]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setCurrency(code as Currency)}
            className={`gap-2 ${currency === code ? 'bg-accent' : ''}`}
          >
            <span>{flag}</span>
            <span>{symbol}</span>
            <span className="text-xs text-muted-foreground">{name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};