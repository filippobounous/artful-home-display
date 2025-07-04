
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InventoryItem } from "@/types/inventory";

interface ItemsTableProps {
  items: InventoryItem[];
  onItemClick?: (item: InventoryItem) => void;
}

export function ItemsTable({ items, onItemClick }: ItemsTableProps) {
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

  const formatCurrency = (value?: number, currency?: string) => {
    if (!value) return "-";
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    });
    return formatter.format(value);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead className="text-right">Valuation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onItemClick?.(item)}
            >
              <TableCell>
                <div className="w-12 h-12 rounded overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  {item.yearPeriod && (
                    <p className="text-sm text-muted-foreground">{item.yearPeriod}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>{item.artist || "-"}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <p className="capitalize">{item.category}</p>
                  {item.subcategory && (
                    <p className="text-muted-foreground">{item.subcategory}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {item.house && (
                    <p className="capitalize">{item.house.replace('-', ' ')}</p>
                  )}
                  {item.room && (
                    <p className="text-muted-foreground capitalize">{item.room.replace('-', ' ')}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getConditionColor(item.condition)}>
                  {item.condition}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(item.valuation, item.valuationCurrency)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
