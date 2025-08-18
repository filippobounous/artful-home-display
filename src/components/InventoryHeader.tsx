
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { TestModeIndicator } from '@/components/TestModeIndicator';
import { ApiHealthIndicator } from '@/components/ApiHealthIndicator';
import { useDashboardApiHealth } from '@/hooks/useDashboardApiHealth';

export function InventoryHeader() {
  const { showApiHealth } = useDashboardApiHealth();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          {showApiHealth && (
            <ApiHealthIndicator enablePolling={true} />
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <TestModeIndicator />
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
