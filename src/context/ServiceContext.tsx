import React from 'react';

export type ServiceType = 'Decor' | 'Book' | 'Music';

export interface ServiceItemMap {
  Decor: import('@/types/inventory').DecorItem;
  Book: import('@/types/inventory').BookItem;
  Music: import('@/types/inventory').MusicItem;
}

export type ServiceItem<T extends ServiceType> = ServiceItemMap[T];

interface ServiceContextValue {
  service: ServiceType;
  setService: (service: ServiceType) => void;
}

const ServiceContext = React.createContext<ServiceContextValue | undefined>(
  undefined,
);

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const [service, setService] = React.useState<ServiceType>('Decor');
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
