import { ReactNode, useState } from 'react';
import { ServiceContext, ServiceType } from './useService';

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [service, setService] = useState<ServiceType>('Inventory');

  return (
    <ServiceContext.Provider value={{ service, setService }}>
      {children}
    </ServiceContext.Provider>
  );
}
