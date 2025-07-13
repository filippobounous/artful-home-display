import { useRef } from 'react';
import { ItemCard } from './ItemCard';
import { DecorItem } from '@/types/inventory';

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
  const lastIndex = useRef<number | null>(null);

  const toggle = (id: string, index: number, shift: boolean) => {
    if (!onSelectionChange) return;
    let newIds = [...selectedIds];
    if (shift && lastIndex.current !== null) {
      const start = Math.min(lastIndex.current, index);
      const end = Math.max(lastIndex.current, index);
      const range = items.slice(start, end + 1).map((i) => i.id.toString());
      range.forEach((rid) => {
        if (!newIds.includes(rid)) newIds.push(rid);
      });
    } else {
      if (newIds.includes(id)) newIds = newIds.filter((i) => i !== id);
      else newIds.push(id);
      lastIndex.current = index;
    }
    onSelectionChange(newIds);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item, idx) => (
        <ItemCard
          key={item.id}
          item={item}
          onClick={onItemClick}
          selected={selectedIds.includes(item.id.toString())}
          onSelect={(shift) => toggle(item.id.toString(), idx, shift)}
        />
      ))}
    </div>
  );
}
