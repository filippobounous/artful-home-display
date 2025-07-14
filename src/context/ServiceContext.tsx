import React from 'react';

interface ServiceContextValue {
  service: string;
  setService: (service: string) => void;
}

const ServiceContext = React.createContext<ServiceContextValue | undefined>(
  undefined,
);

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const [service, setService] = React.useState('Inventory');
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
