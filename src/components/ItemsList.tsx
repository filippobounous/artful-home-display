
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/types/inventory";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface ItemsListProps {
  items: InventoryItem[];
  onItemClick?: (item: InventoryItem) => void;
}

type SortField =
  | 'title'
  | 'artist'
  | 'category'
  | 'valuation'
  | 'yearPeriod'
  | 'condition'
  | 'location';
type SortDirection = 'asc' | 'desc';

export function ItemsList({ items, onItemClick }: ItemsListProps) {
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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
      currency: currency || 'EUR',
    });
    return formatter.format(value);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const compareStrings = (x?: string, y?: string) => {
    const aStr = (x || '').toLowerCase();
    const bStr = (y || '').toLowerCase();
    if (aStr < bStr) return -1;
    if (aStr > bStr) return 1;
    return 0;
  };

  const sortedItems = [...items].sort((a, b) => {
    if (sortField === 'location') {
      const houseComp = compareStrings(a.house, b.house);
      if (houseComp !== 0) return sortDirection === 'asc' ? houseComp : -houseComp;
      const roomComp = compareStrings(a.room, b.room);
      return sortDirection === 'asc' ? roomComp : -roomComp;
    }

    if (sortField === 'category') {
      const catComp = compareStrings(a.category, b.category);
      if (catComp !== 0) return sortDirection === 'asc' ? catComp : -catComp;
      const subComp = compareStrings(a.subcategory, b.subcategory);
      return sortDirection === 'asc' ? subComp : -subComp;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let aValue: any = a[sortField as keyof InventoryItem];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let bValue: any = b[sortField as keyof InventoryItem];

    if (!aValue && !bValue) return 0;
    if (!aValue) return sortDirection === 'asc' ? 1 : -1;
    if (!bValue) return sortDirection === 'asc' ? -1 : 1;

    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();

    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-6 px-2 text-xs font-medium"
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />
      )}
      {sortField !== field && <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />}
    </Button>
  );

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      <div className="flex flex-wrap gap-2 p-4 bg-white border rounded-lg">
        <span className="text-sm text-slate-600 mr-2">Sort by:</span>
        <SortButton field="title">Title</SortButton>
        <SortButton field="artist">Artist</SortButton>
        <SortButton field="category">Category</SortButton>
        <SortButton field="valuation">Valuation</SortButton>
        <SortButton field="yearPeriod">Year</SortButton>
        <SortButton field="location">Location</SortButton>
        <SortButton field="condition">Condition</SortButton>
      </div>

      {/* Items List */}
      {sortedItems.map((item) => (
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
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                    {item.artist && (
                      <p className="text-slate-600 text-sm font-medium">by {item.artist}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getConditionColor(item.condition)}>
                      {item.condition}
                    </Badge>
                    {item.valuation && (
                      <Badge variant="outline">
                        {formatCurrency(item.valuation, item.valuationCurrency)}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-slate-600">Category:</span>
                    <span className="ml-2 capitalize">{item.category}</span>
                    {item.subcategory && (
                      <span className="text-slate-500"> • {item.subcategory}</span>
                    )}
                  </div>
                  
                  {(item.house || item.room) && (
                    <div>
                      <span className="font-medium text-slate-600">Location:</span>
                      {item.house && <span className="ml-2 capitalize">{item.house.replace('-', ' ')}</span>}
                      {item.house && item.room && <span className="text-slate-500"> • </span>}
                      {item.room && <span className="capitalize">{item.room.replace('-', ' ')}</span>}
                    </div>
                  )}
                  
                  {item.yearPeriod && (
                    <div>
                      <span className="font-medium text-slate-600">Period:</span>
                      <span className="ml-2">{item.yearPeriod}</span>
                    </div>
                  )}
                  
                  {item.size && (
                    <div>
                      <span className="font-medium text-slate-600">Size:</span>
                      <span className="ml-2">{item.size}</span>
                    </div>
                  )}
                  
                  {item.quantity && item.quantity > 1 && (
                    <div>
                      <span className="font-medium text-slate-600">Quantity:</span>
                      <span className="ml-2">{item.quantity}</span>
                    </div>
                  )}
                  
                  {item.valuationDate && (
                    <div>
                      <span className="font-medium text-slate-600">Valued:</span>
                      <span className="ml-2">{item.valuationDate}</span>
                      {item.valuationPerson && (
                        <span className="text-slate-500"> by {item.valuationPerson}</span>
                      )}
                    </div>
                  )}
                </div>
                
                {item.description && (
                  <p className="text-slate-600 text-sm line-clamp-2">{item.description}</p>
                )}
                
                {item.notes && (
                  <div className="pt-2 border-t">
                    <span className="font-medium text-slate-600 text-sm">Notes:</span>
                    <p className="text-slate-500 text-sm mt-1">{item.notes}</p>
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
