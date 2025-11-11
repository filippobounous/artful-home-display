import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { InventoryItem } from '@/types/inventory';
import { useCollection } from '@/context/CollectionProvider';
import {
  formatItemLocation,
  getCreatorLabel,
  getItemCategory,
  getItemCreator,
  getItemSubcategory,
  getItemYear,
  getYearLabel,
} from '@/lib/inventoryDisplay';

interface ItemCardProps {
  item: InventoryItem;
  onClick?: (item: InventoryItem) => void;
  selected?: boolean;
  onSelect?: (shift: boolean) => void;
}

export function ItemCard({ item, onClick, selected, onSelect }: ItemCardProps) {
  const { collection } = useCollection();
  const creator = getItemCreator(item);
  const creatorLabel = getCreatorLabel(collection);
  const category = getItemCategory(item);
  const subcategory = getItemSubcategory(item);
  const location = formatItemLocation(item);
  const year = getItemYear(item);
  const yearLabel = getYearLabel(collection);

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (e.shiftKey && onSelect) {
      onSelect(true);
      return;
    }
    onClick?.(item);
  };

  const handleCheckbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(false);
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick(e)}
      onClick={handleClick}
      className={cn(
        'relative group hover:shadow-lg transition-all duration-300 cursor-pointer',
        selected && 'ring-2 ring-primary',
      )}
    >
      <CardContent className="p-0">
        {onSelect && (
          <Checkbox
            checked={selected}
            onClick={handleCheckbox}
            className="absolute top-2 left-2 z-10 bg-card rounded-sm"
          />
        )}
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-foreground line-clamp-2">
              {item.title}
            </h3>
          </div>

          {creator && (
            <p className="text-muted-foreground text-sm font-medium mb-1">
              {creatorLabel}: {creator}
            </p>
          )}

          {year && (
            <p className="text-muted-foreground text-xs mb-2">
              {yearLabel}: {year}
            </p>
          )}

          {(category || subcategory) && (
            <div className="flex gap-2 text-xs text-muted-foreground">
              {category && <span className="capitalize">{category}</span>}
              {category && subcategory && <span>•</span>}
              {subcategory && <span className="capitalize">{subcategory}</span>}
            </div>
          )}

          {location && (
            <div className="mt-2 text-xs text-muted-foreground">{location}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
