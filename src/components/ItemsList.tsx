import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { InventoryItem } from '@/types/inventory';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useSettingsState } from '@/hooks/useSettingsState';
import { sortInventoryItems } from '@/lib/sortUtils';
import { useShiftSelection } from '@/hooks/useShiftSelection';
import { formatCurrencyOptional } from '@/lib/currencyUtils';
import { useCollection } from '@/context/CollectionProvider';
import {
  formatItemLocation,
  getCategoryLabel,
  getCollectionSpecificDetails,
  getCreatorLabel,
  getItemCategory,
  getItemCreator,
  getItemQuantity,
  getItemSubcategory,
  getItemValuationCurrency,
  getItemValuationValue,
  getItemYear,
  getSubcategoryLabel,
  getYearLabel,
} from '@/lib/inventoryDisplay';

interface ItemsListProps {
  items: InventoryItem[];
  onItemClick?: (item: InventoryItem) => void;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onSort?: (field: SortField, direction: SortDirection) => void;
  sortField?: SortField;
  sortDirection?: SortDirection;
}

type SortField =
  | 'title'
  | 'creator'
  | 'category'
  | 'valuation'
  | 'year'
  | 'location';
type SortDirection = 'asc' | 'desc';

export function ItemsList({
  items,
  onItemClick,
  selectedIds = [],
  onSelectionChange,
  onSort,
  sortField,
  sortDirection,
}: ItemsListProps) {
  const [internalSortField, setInternalSortField] = useState<SortField>('title');
  const [internalSortDirection, setInternalSortDirection] =
    useState<SortDirection>('asc');
  const activeSortField = sortField ?? internalSortField;
  const activeSortDirection = sortDirection ?? internalSortDirection;
  const { houses, categories } = useSettingsState();
  const { collection } = useCollection();

  const creatorLabel = getCreatorLabel(collection);
  const categoryLabel = getCategoryLabel(collection);
  const subcategoryLabel = getSubcategoryLabel(collection);
  const yearLabel = getYearLabel(collection);

  const handleSort = (field: SortField) => {
    if (onSort) {
      const newDirection =
        activeSortField === field && activeSortDirection === 'asc'
          ? 'desc'
          : 'asc';
      onSort(field, newDirection);
    } else if (internalSortField === field) {
      setInternalSortDirection(
        internalSortDirection === 'asc' ? 'desc' : 'asc',
      );
    } else {
      setInternalSortField(field);
      setInternalSortDirection('asc');
    }
  };

  const sortedItems = onSort
    ? items
    : sortInventoryItems(
        items,
        activeSortField,
        activeSortDirection,
        houses,
        categories,
        collection,
      );

  const { handleItemToggle } = useShiftSelection({
    items: sortedItems,
    selectedIds,
    onSelectionChange,
  });

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
      {activeSortField === field &&
        (activeSortDirection === 'asc' ? (
          <ArrowUp className="w-3 h-3 ml-1" />
        ) : (
          <ArrowDown className="w-3 h-3 ml-1" />
        ))}
      {activeSortField !== field && (
        <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />
      )}
    </Button>
  );

  const handleClick = (
    e: React.MouseEvent | React.KeyboardEvent,
    item: InventoryItem,
    idx: number,
  ) => {
    if (e.shiftKey) {
      handleItemToggle(item, idx, true);
    } else {
      onItemClick?.(item);
    }
  };

  const renderMetadata = (item: InventoryItem) => {
    const details: Array<{ label: string; value: string }> = [];
    const category = getItemCategory(item);
    const subcategory = getItemSubcategory(item);
    if (category || subcategory) {
      const value = [
        category ? category : undefined,
        subcategory ? `${subcategoryLabel}: ${subcategory}` : undefined,
      ]
        .filter(Boolean)
        .join(' • ');
      if (value) {
        details.push({ label: categoryLabel, value });
      }
    }

    const location = formatItemLocation(item);
    if (location) {
      details.push({ label: 'Location', value: location });
    }

    const year = getItemYear(item);
    if (year) {
      details.push({ label: yearLabel, value: year });
    }

    getCollectionSpecificDetails(item, collection).forEach((entry) => {
      details.push(entry);
    });

    const quantity = getItemQuantity(item);
    if (quantity && quantity > 1) {
      details.push({ label: 'Quantity', value: String(quantity) });
    }

    const valuation = getItemValuationValue(item);
    if (valuation !== undefined) {
      details.push({
        label: 'Valuation',
        value: formatCurrencyOptional(
          valuation,
          getItemValuationCurrency(item),
        ),
      });
    }

    if ('valuationDate' in item && item.valuationDate) {
      details.push({ label: 'Valuation Date', value: item.valuationDate });
    }

    return details;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 p-4 bg-card border rounded-lg">
        <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
        <SortButton field="title">Title</SortButton>
        <SortButton field="creator">{creatorLabel}</SortButton>
        <SortButton field="category">{categoryLabel}</SortButton>
        <SortButton field="valuation">Valuation</SortButton>
        <SortButton field="year">{yearLabel}</SortButton>
        <SortButton field="location">Location</SortButton>
      </div>

      {sortedItems.map((item, idx) => {
        const metadata = renderMetadata(item);
        const creator = getItemCreator(item);

        return (
          <Card
            key={item.id}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              (e.key === 'Enter' || e.key === ' ') && handleClick(e, item, idx)
            }
            onClick={(e) => handleClick(e, item, idx)}
            className={cn(
              'hover:shadow-md transition-shadow cursor-pointer',
              selectedIds.includes(item.id.toString()) &&
                'ring-2 ring-primary bg-blue-50',
            )}
          >
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 relative">
                  {onSelectionChange && (
                    <Checkbox
                      checked={selectedIds.includes(item.id.toString())}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemToggle(item, idx, e.shiftKey);
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
                      {creator && (
                        <p className="text-muted-foreground text-sm font-medium">
                          {creatorLabel}: {creator}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {metadata
                        .filter((detail) => detail.label === 'Valuation')
                        .map((detail) => (
                          <Badge key={detail.label} variant="outline">
                            {detail.value}
                          </Badge>
                        ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {metadata
                      .filter((detail) => detail.label !== 'Valuation')
                      .map((detail) => (
                        <div key={`${detail.label}-${detail.value}`}>
                          <span className="font-medium text-muted-foreground">
                            {detail.label}:
                          </span>
                          <span className="ml-2 break-words">{detail.value}</span>
                        </div>
                      ))}
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
        );
      })}
    </div>
  );
}
