import { ReactNode } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { InventoryHeader } from '@/components/InventoryHeader';
import { useSidebar } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { state } = useSidebar();
  return (
    <div
      className={`layout ${state === 'collapsed' ? 'collapsed' : 'expanded'} min-h-screen w-full bg-background`}
    >
      <AppSidebar />
      <div className="main flex flex-col">
        <InventoryHeader />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
