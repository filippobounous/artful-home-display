
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { ApiHealthIndicator } from '@/components/ApiHealthIndicator';
import { useDashboardApiHealth } from '@/hooks/useDashboardApiHealth';
import { useSystemState } from '@/hooks/useSystemState';
import { cn } from '@/lib/utils';

export function InventoryHeader() {
  const { showApiHealth } = useDashboardApiHealth();
  const { topBarVariant } = useSystemState();

  const getTopBarClasses = () => {
    switch (topBarVariant) {
      case 'testing':
        return 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800';
      case 'degraded':
        return 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800';
      default:
        return 'bg-background/95 border-border';
    }
  };

  return (
    <header className={cn(
      'border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 h-12',
      getTopBarClasses()
    )}>
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          {showApiHealth && (
            <ApiHealthIndicator enablePolling={true} />
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
