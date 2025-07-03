
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { InventoryItem } from "@/types/inventory";

interface ItemsListProps {
  items: InventoryItem[];
  onItemClick?: (item: InventoryItem) => void;
}

export function ItemsList({ items, onItemClick }: ItemsListProps) {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "mint":
        return "bg-green-100 text-green-800 border-green-200";
      case "excellent":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "very good":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "good":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card 
          key={item.id} 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onItemClick?.(item)}
        >
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <Badge className={getConditionColor(item.condition)}>
                    {item.condition}
                  </Badge>
                </div>
                {item.artist && (
                  <p className="text-slate-600 text-sm font-medium mb-1">by {item.artist}</p>
                )}
                {item.yearPeriod && (
                  <p className="text-slate-600 text-sm mb-2">{item.yearPeriod}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="capitalize">{item.category}</span>
                  {item.subcategory && (
                    <>
                      <span>•</span>
                      <span>{item.subcategory}</span>
                    </>
                  )}
                </div>
                {(item.house || item.room) && (
                  <div className="mt-2 text-sm text-slate-500">
                    {item.house && <span className="capitalize">{item.house.replace('-', ' ')}</span>}
                    {item.house && item.room && <span> • </span>}
                    {item.room && <span className="capitalize">{item.room.replace('-', ' ')}</span>}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
