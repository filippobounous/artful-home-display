import { SidebarTrigger } from '@/components/ui/sidebar';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { ApiHealthIndicator } from '@/components/ApiHealthIndicator';
import { useDashboardApiHealth } from '@/hooks/useDashboardApiHealth';
import { useSystemState } from '@/hooks/useSystemState';
import { cn } from '@/lib/utils';

export function InventoryHeader() {
  const { showApiHealth } = useDashboardApiHealth();
  const { topBarState } = useSystemState();

  const getTopBarClasses = () => {
    switch (topBarState) {
      case 'testing':
        return cn(
          'bg-[hsl(var(--tb-bg-testing)/0.15)] text-[hsl(var(--tb-fg-default))]',
          'dark:bg-[hsl(var(--tb-bg-testing)/0.2)] dark:text-[hsl(var(--tb-fg-contrast))]',
        );
      case 'apiwarn':
        return cn(
          'bg-[hsl(var(--tb-bg-apiwarn)/0.15)] text-[hsl(var(--tb-fg-default))]',
          'dark:bg-[hsl(var(--tb-bg-apiwarn)/0.2)] dark:text-[hsl(var(--tb-fg-contrast))]',
        );
      default:
        return cn(
          'bg-[hsl(var(--tb-bg-default)/0.95)] text-[hsl(var(--tb-fg-default))]',
        );
    }
  };

  return (
    <header
      className={cn(
        'border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 topbar',
        'border-[hsl(var(--tb-border))]',
        getTopBarClasses(),
      )}
    >
      <div className="flex w-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          {showApiHealth && <ApiHealthIndicator enablePolling={true} />}
        </div>

        <div className="flex items-center gap-3">
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
