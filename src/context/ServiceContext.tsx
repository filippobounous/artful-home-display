
import React, { createContext, useContext, useState, ReactNode } from 'react';

type ServiceType = 'Inventory' | 'Books' | 'Music';

interface ServiceContextType {
  service: ServiceType;
  setService: (service: ServiceType) => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [service, setService] = useState<ServiceType>('Inventory');

  return (
    <ServiceContext.Provider value={{ service, setService }}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useService() {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
}
