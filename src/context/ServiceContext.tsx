import React from 'react';

export type ServiceType = 'Inventory' | 'Book' | 'Music';

interface ServiceContextValue {
  service: ServiceType;
  setService: (service: ServiceType) => void;
}

const ServiceContext = React.createContext<ServiceContextValue | undefined>(
  undefined,
);

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const [service, setService] = React.useState<ServiceType>('Inventory');
  return (
    <ServiceContext.Provider value={{ service, setService }}>
      {children}
    </ServiceContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useService() {
  const context = React.useContext(ServiceContext);
  if (!context) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
}
