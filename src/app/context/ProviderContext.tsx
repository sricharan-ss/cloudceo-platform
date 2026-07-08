import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Provider = 'combined' | 'aws' | 'azure';

interface ProviderContextValue {
  provider: Provider;
  setProvider: (p: Provider) => void;
}

const ProviderContext = createContext<ProviderContextValue | undefined>(undefined);

export function ProviderProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<Provider>('combined');
  return (
    <ProviderContext.Provider value={{ provider, setProvider }}>
      {children}
    </ProviderContext.Provider>
  );
}

export function useProvider() {
  const context = useContext(ProviderContext);
  if (context === undefined) {
    throw new Error('useProvider must be used within a ProviderProvider');
  }
  return context;
}
