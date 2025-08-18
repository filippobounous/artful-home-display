import { ReactNode } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { useSidebar } from '@/components/ui/sidebar';

interface SidebarLayoutProps {
  children: ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { state } = useSidebar();
  return (
    <div className={`layout ${state} bg-background`}>
      <AppSidebar />
      <div className="main flex flex-col">{children}</div>
    </div>
  );
}
