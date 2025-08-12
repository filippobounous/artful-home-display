import { createContext, useContext } from 'react';

export type ServiceType = 'Inventory' | 'Books' | 'Music';

export interface ServiceContextType {
  service: ServiceType;
  setService: (service: ServiceType) => void;
}

export const ServiceContext = createContext<ServiceContextType | undefined>(
  undefined,
);

export function useService() {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
}
