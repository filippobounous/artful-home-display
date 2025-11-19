import { SidebarTrigger } from '@/components/ui/sidebar';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { ApiHealthIndicator } from '@/components/ApiHealthIndicator';
import { useDashboardApiHealth } from '@/hooks/useDashboardApiHealth';
import { useSystemState } from '@/hooks/useSystemState';
import { cn } from '@/lib/utils';
import { useCollection, CollectionType } from '@/context/CollectionProvider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ResetCallbacks = (() => void) | Array<() => void>;

interface InventoryHeaderProps {
  onCollectionChangeCallbacks?: ResetCallbacks;
}

export function InventoryHeader({
  onCollectionChangeCallbacks,
}: InventoryHeaderProps) {
  const { showApiHealth } = useDashboardApiHealth();
  const { topBarState } = useSystemState();
  const { collection, setCollection } = useCollection();

  const getTopBarClasses = () => {
    switch (topBarState) {
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

  const handleCollectionChange = (value: CollectionType) => {
    if (value === collection) return;
    setCollection(value);
    const callbacksArray = Array.isArray(onCollectionChangeCallbacks)
      ? onCollectionChangeCallbacks
      : onCollectionChangeCallbacks
        ? [onCollectionChangeCallbacks]
        : [];

    callbacksArray.forEach((callback) => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  return (
    <header
      className={cn(
        'topbar border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40',
        'border-[hsl(var(--tb-border))]',
        getTopBarClasses(),
      )}
    >
      <div className="flex h-full w-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          {showApiHealth && <ApiHealthIndicator enablePolling={true} />}
        </div>

        <div className="flex items-center gap-3">
          <Select value={collection} onValueChange={handleCollectionChange}>
            <SelectTrigger className="w-[150px] capitalize">
              <SelectValue placeholder="Collection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="art">Art</SelectItem>
              <SelectItem value="books">Books</SelectItem>
              <SelectItem value="music">Music</SelectItem>
            </SelectContent>
          </Select>
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
