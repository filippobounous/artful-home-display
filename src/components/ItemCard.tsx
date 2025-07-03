
import { Card, CardContent } from "@/components/ui/card";
import { InventoryItem } from "@/types/inventory";

interface ItemCardProps {
  item: InventoryItem;
  onClick?: (item: InventoryItem) => void;
}

export function ItemCard({ item, onClick }: ItemCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={handleClick}>
      <CardContent className="p-0">
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
