
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { DecorItem } from "@/types/inventory";

interface ItemCardProps {
  item: DecorItem;
  onClick?: (item: DecorItem) => void;
  selected?: boolean;
  onSelect?: (shift: boolean) => void;
}

export function ItemCard({ item, onClick, selected, onSelect }: ItemCardProps) {
  const handleClick = (e: React.MouseEvent) => {
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
      className={cn(
        "relative group hover:shadow-lg transition-all duration-300 cursor-pointer",
        selected && "ring-2 ring-primary"
      )}
      onClick={handleClick}
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
            <h3 className="font-semibold text-slate-900 line-clamp-2">{item.title}</h3>
          </div>
          
          {item.artist && (
            <p className="text-slate-600 text-sm font-medium mb-1">by {item.artist}</p>
          )}
          
          {item.yearPeriod && (
            <p className="text-slate-600 text-sm mb-2">{item.yearPeriod}</p>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-2 text-xs text-slate-500">
              <span className="capitalize">{item.category}</span>
              {item.subcategory && <span>• {item.subcategory}</span>}
            </div>
          </div>
          
          {(item.house || item.room) && (
            <div className="mt-2 text-xs text-slate-500">
              {item.house && <span className="capitalize">{item.house.replace('-', ' ')}</span>}
              {item.house && item.room && <span> • </span>}
              {item.room && <span className="capitalize">{item.room.replace('-', ' ')}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
