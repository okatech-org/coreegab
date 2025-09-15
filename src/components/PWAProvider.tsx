import React, { createContext, useContext } from 'react';

interface PWAContextType {
  isOnline: boolean;
  isUpdateAvailable: boolean;
  updateApp: () => void;
}

const PWAContext = createContext<PWAContextType | null>(null);

export const usePWA = (): PWAContextType => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};

interface PWAProviderProps {
  children: React.ReactNode;
}

// Version minimale sans aucune logique complexe
export const PWAProvider: React.FC<PWAProviderProps> = ({ children }) => {
  const value: PWAContextType = {
    isOnline: true,
    isUpdateAvailable: false,
    updateApp: () => {},
  };

  return (
    <PWAContext.Provider value={value}>
      {children}
    </PWAContext.Provider>
  );
};