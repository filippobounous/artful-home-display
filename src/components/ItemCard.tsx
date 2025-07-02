
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { InventoryItem } from "@/types/inventory";

interface ItemCardProps {
  item: InventoryItem;
}

export function ItemCard({ item }: ItemCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800 border-green-200";
      case "sold": return "bg-gray-100 text-gray-800 border-gray-200";
      case "reserved": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-slate-900 line-clamp-2">{item.name}</h3>
            <Badge className={getStatusColor(item.status)}>
              {item.status}
            </Badge>
          </div>
          <p className="text-slate-600 text-sm mb-3 line-clamp-2">{item.description}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-700 font-medium">
              ${item.price.toLocaleString()}
            </span>
            <div className="flex gap-2 text-xs text-slate-500">
              <span className="capitalize">{item.category}</span>
              {item.house && <span>• {item.house}</span>}
              {item.room && <span>• {item.room}</span>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
