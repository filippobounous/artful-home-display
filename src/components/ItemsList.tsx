import { useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { DecorItem } from '@/types/inventory';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useSettingsState } from '@/hooks/useSettingsState';
import { sortInventoryItems } from '@/lib/sortUtils';

interface ItemsListProps {
  items: DecorItem[];
  onItemClick?: (item: DecorItem) => void;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

type SortField =
  | 'title'
  | 'artist'
  | 'category'
  | 'valuation'
  | 'yearPeriod'
  | 'location';
type SortDirection = 'asc' | 'desc';

export function ItemsList({
  items,
  onItemClick,
  selectedIds = [],
  onSelectionChange,
}: ItemsListProps) {
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const { houses, categories } = useSettingsState();
  const lastIndex = useRef<number | null>(null);

  const formatCurrency = (value?: number, currency?: string) => {
    if (!value) return '-';
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

  const sortedItems = sortInventoryItems(
    items,
    sortField,
    sortDirection,
    houses,
    categories,
  );

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-6 px-2 text-xs font-medium"
    >
      {children}
      {sortField === field &&
        (sortDirection === 'asc' ? (
          <ArrowUp className="w-3 h-3 ml-1" />
        ) : (
          <ArrowDown className="w-3 h-3 ml-1" />
        ))}
      {sortField !== field && (
        <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />
      )}
    </Button>
  );

  const toggle = (id: string, index: number, shift: boolean) => {
    if (!onSelectionChange) return;
    let newIds = [...selectedIds];
    if (shift && lastIndex.current !== null) {
      const start = Math.min(lastIndex.current, index);
      const end = Math.max(lastIndex.current, index);
      const range = sortedItems
        .slice(start, end + 1)
        .map((i) => i.id.toString());
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
    <div className="space-y-4">
      {/* Sort Controls */}
      <div className="flex flex-wrap gap-2 p-4 bg-card border rounded-lg">
        <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
        <SortButton field="title">Title</SortButton>
        <SortButton field="artist">Artist</SortButton>
        <SortButton field="category">Category</SortButton>
        <SortButton field="valuation">Valuation</SortButton>
        <SortButton field="yearPeriod">Year</SortButton>
        <SortButton field="location">Location</SortButton>
      </div>

      {/* Items List */}
      {sortedItems.map((item, idx) => (
        <Card
          key={item.id}
          className={cn(
            'hover:shadow-md transition-shadow cursor-pointer',
            selectedIds.includes(item.id.toString()) &&
              'ring-2 ring-primary bg-blue-50',
          )}
          onClick={(e) => {
            if (e.shiftKey) {
              toggle(item.id.toString(), idx, true);
            } else {
              onItemClick?.(item);
            }
          }}
        >
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 relative">
                {onSelectionChange && (
                  <Checkbox
                    checked={selectedIds.includes(item.id.toString())}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(item.id.toString(), idx, false);
                    }}
                    className="absolute -left-3 top-1 bg-card rounded-sm"
                  />
                )}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                    {item.artist && (
                      <p className="text-muted-foreground text-sm font-medium">
                        by {item.artist}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {item.valuation && (
                      <Badge variant="outline">
                        {formatCurrency(item.valuation, item.valuationCurrency)}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Category:
                    </span>
                    <span className="ml-2 capitalize">{item.category}</span>
                    {item.subcategory && (
                      <span className="text-muted-foreground">
                        {' '}
                        • {item.subcategory}
                      </span>
                    )}
                  </div>

                  {(item.house || item.room) && (
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Location:
                      </span>
                      {item.house && (
                        <span className="ml-2 capitalize">
                          {item.house.replace('-', ' ')}
                        </span>
                      )}
                      {item.house && item.room && (
                        <span className="text-muted-foreground"> • </span>
                      )}
                      {item.room && (
                        <span className="capitalize">
                          {item.room.replace('-', ' ')}
                        </span>
                      )}
                    </div>
                  )}

                  {item.yearPeriod && (
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Period:
                      </span>
                      <span className="ml-2">{item.yearPeriod}</span>
                    </div>
                  )}

                  {(item.widthCm || item.heightCm || item.depthCm) && (
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Dimensions:
                      </span>
                      <span className="ml-2">
                        {item.widthCm ?? '-'} x {item.heightCm ?? '-'} x{' '}
                        {item.depthCm ?? '-'} cm
                      </span>
                    </div>
                  )}

                  {item.quantity && item.quantity > 1 && (
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Quantity:
                      </span>
                      <span className="ml-2">{item.quantity}</span>
                    </div>
                  )}

                  {item.valuationDate && (
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Valued:
                      </span>
                      <span className="ml-2">{item.valuationDate}</span>
                      {item.valuationPerson && (
                        <span className="text-muted-foreground">
                          {' '}
                          by {item.valuationPerson}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {item.description && (
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {item.description}
                  </p>
                )}

                {item.notes && (
                  <div className="pt-2 border-t">
                    <span className="font-medium text-muted-foreground text-sm">
                      Notes:
                    </span>
                    <p className="text-muted-foreground text-sm mt-1">
                      {item.notes}
                    </p>
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
