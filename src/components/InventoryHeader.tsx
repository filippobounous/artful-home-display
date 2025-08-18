
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { useSystemState } from '@/hooks/useSystemState';
import { cn } from '@/lib/utils';

export function InventoryHeader() {
  const { topBarState } = useSystemState();

  const getTopBarClasses = () => {
    switch (topBarState) {
      case 'testing':
        return cn(
          'bg-red-50 text-red-900 border-red-200',
          'dark:bg-red-950/30 dark:text-red-200 dark:border-red-800/50',
        );
      default:
        return cn(
          'bg-background/95 text-foreground border-border',
        );
    }
  };

  return (
    <header
      className={cn(
        'border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 h-12',
        getTopBarClasses(),
      )}
    >
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
        </div>

        <div className="flex items-center gap-3">
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
