
import { ItemCard } from "./ItemCard";
import { InventoryItem } from "@/types/inventory";

interface ItemsGridProps {
  items: InventoryItem[];
  onItemClick?: (item: InventoryItem) => void;
}

export function ItemsGrid({ items, onItemClick }: ItemsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onClick={onItemClick} />
      ))}
    </div>
  );
}
