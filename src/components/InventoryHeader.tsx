import { SidebarTrigger } from '@/components/ui/sidebar';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { ApiHealthIndicator } from '@/components/ApiHealthIndicator';
import { useDashboardApiHealth } from '@/hooks/useDashboardApiHealth';
import { useSystemState } from '@/hooks/useSystemState';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCollection } from '@/context/CollectionProvider';
import type { CollectionType } from '@/types/inventory';

const collectionLabels: Record<CollectionType, string> = {
  art: 'Art & Decor',
  books: 'Books',
  music: 'Music',
};

interface InventoryHeaderProps {
  onCollectionChange?: (collection: CollectionType) => void;
  onCollectionResetters?: Array<() => void>;
}

export function InventoryHeader({
  onCollectionChange,
  onCollectionResetters = [],
}: InventoryHeaderProps = {}) {
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

  const handleCollectionChange = (next: CollectionType) => {
    if (next === collection) return;
    onCollectionResetters.forEach((reset) => {
      try {
        reset();
      } catch (error) {
        console.error('Collection reset callback failed', error);
      }
    });
    setCollection(next);
    onCollectionChange?.(next);
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
          <Select
            value={collection}
            onValueChange={(value) => handleCollectionChange(value as CollectionType)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select collection" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(collectionLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
