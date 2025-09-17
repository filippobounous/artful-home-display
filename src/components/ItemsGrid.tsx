import { ItemCard } from './ItemCard';
import { DecorItem } from '@/types/inventory';
import { useShiftSelection } from '@/hooks/useShiftSelection';

interface ItemsGridProps {
  items: DecorItem[];
  onItemClick?: (item: DecorItem) => void;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

export function ItemsGrid({
  items,
  onItemClick,
  selectedIds = [],
  onSelectionChange,
}: ItemsGridProps) {
  const { handleItemToggle } = useShiftSelection({
    items,
    selectedIds,
    onSelectionChange,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item, idx) => (
        <ItemCard
          key={item.id}
          item={item}
          onClick={onItemClick}
          selected={selectedIds.includes(item.id.toString())}
          onSelect={(shift) => handleItemToggle(item, idx, shift)}
        />
      ))}
    </div>
  );
}
