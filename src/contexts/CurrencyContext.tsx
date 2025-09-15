import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'XAF' | 'KRW' | 'EUR' | 'USD';

interface ExchangeRates {
  XAF: number; // Base currency
  KRW: number; // Korean Won
  EUR: number; // Euro
  USD: number; // US Dollar
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchangeRates: ExchangeRates;
  setExchangeRates: (rates: ExchangeRates) => void;
  convertPrice: (price: number, fromCurrency: Currency, toCurrency?: Currency) => number;
  formatPrice: (price: number, fromCurrency?: Currency, targetCurrency?: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: React.ReactNode;
}

// Default exchange rates (XAF as base)
const defaultExchangeRates: ExchangeRates = {
  XAF: 1, // Base currency
  KRW: 0.95, // 1 XAF = 0.95 KRW (approximate)
  EUR: 0.0015, // 1 XAF = 0.0015 EUR (approximate)
  USD: 0.0016, // 1 XAF = 0.0016 USD (approximate)
};

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('currency');
    return (saved as Currency) || 'XAF';
  });

  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(() => {
    const saved = localStorage.getItem('exchangeRates');
    return saved ? JSON.parse(saved) : defaultExchangeRates;
  });

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('exchangeRates', JSON.stringify(exchangeRates));
  }, [exchangeRates]);

  const convertPrice = (price: number, fromCurrency: Currency, toCurrency?: Currency): number => {
    const targetCurrency = toCurrency || currency;
    
    if (fromCurrency === targetCurrency) {
      return price;
    }

    // Convert to XAF first (base currency)
    let priceInXAF = price;
    if (fromCurrency !== 'XAF') {
      priceInXAF = price / exchangeRates[fromCurrency];
    }

    // Then convert to target currency
    if (targetCurrency === 'XAF') {
      return Math.round(priceInXAF);
    }

    return Math.round(priceInXAF * exchangeRates[targetCurrency]);
  };

  const formatPrice = (price: number, fromCurrency: Currency = 'XAF', targetCurrency?: Currency): string => {
    const convertedPrice = convertPrice(price, fromCurrency, targetCurrency);
    const curr = targetCurrency || currency;

    const formatters = {
      XAF: new Intl.NumberFormat('fr-CF', { 
        style: 'currency', 
        currency: 'XAF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }),
      KRW: new Intl.NumberFormat('ko-KR', { 
        style: 'currency', 
        currency: 'KRW',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }),
      EUR: new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      USD: new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    };

    return formatters[curr].format(convertedPrice);
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      exchangeRates,
      setExchangeRates,
      convertPrice,
      formatPrice
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};