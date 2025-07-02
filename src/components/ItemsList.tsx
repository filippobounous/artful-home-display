
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { InventoryItem } from "@/types/inventory";

interface ItemsListProps {
  items: InventoryItem[];
}

export function ItemsList({ items }: ItemsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800 border-green-200";
      case "sold": return "bg-red-100 text-red-800 border-red-200";
      case "reserved": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
                <p className="text-slate-600 mb-2">{item.description}</p>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="capitalize">{item.category}</span>
                  <span>•</span>
                  <span>{item.dimensions}</span>
                  <span>•</span>
                  <span className="capitalize">{item.condition}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-slate-900">
                  ${item.price.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
