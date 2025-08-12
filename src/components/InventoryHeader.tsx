
import { ServiceSelect } from '@/components/ServiceSelect';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { TestModeIndicator } from '@/components/TestModeIndicator';
import { ApiHealthIndicator } from '@/components/ApiHealthIndicator';
import { useDashboardApiHealth } from '@/hooks/useDashboardApiHealth';

export function InventoryHeader() {
  const { showApiHealth } = useDashboardApiHealth();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <ServiceSelect />
          <TestModeIndicator />
        </div>
        
        <div className="flex items-center gap-4">
          {showApiHealth && (
            <ApiHealthIndicator enablePolling={true} />
          )}
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
