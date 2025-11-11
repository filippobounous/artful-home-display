import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import type { InventoryItem } from '@/types/inventory';
import { useShiftSelection } from '@/hooks/useShiftSelection';
import { formatCurrencyOptional } from '@/lib/currencyUtils';
import { useSettingsState } from '@/hooks/useSettingsState';
import { sortInventoryItems } from '@/lib/sortUtils';
import { useCollection } from '@/context/CollectionProvider';
import {
  formatItemLocation,
  getCategoryLabel,
  getCreatorLabel,
  getItemCategory,
  getItemCreator,
  getItemSubcategory,
  getItemValuationCurrency,
  getItemValuationValue,
  getItemYear,
  getSubcategoryLabel,
  getYearLabel,
} from '@/lib/inventoryDisplay';

interface ItemsTableProps {
  items: InventoryItem[];
  onItemClick?: (item: InventoryItem) => void;
  onSort?: (field: SortField, direction: 'asc' | 'desc') => void;
  sortField?: SortField;
  sortDirection?: 'asc' | 'desc';
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

type SortField = 'title' | 'creator' | 'category' | 'year' | 'location' | 'valuation';

export function ItemsTable({
  items,
  onItemClick,
  onSort,
  sortField,
  sortDirection,
  selectedIds = [],
  onSelectionChange,
}: ItemsTableProps) {
  const { houses, categories } = useSettingsState();
  const { collection } = useCollection();

  const handleSort = (field: SortField) => {
    if (onSort) {
      const newDirection =
        sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(field, newDirection);
    }
  };

  const { handleItemToggle } = useShiftSelection({
    items,
    selectedIds,
    onSelectionChange,
  });

  const creatorLabel = getCreatorLabel(collection);
  const categoryLabel = getCategoryLabel(collection);
  const subcategoryLabel = getSubcategoryLabel(collection);
  const yearLabel = getYearLabel(collection);

  const sortedItems = onSort
    ? items
    : sortInventoryItems(
        items,
        sortField ?? 'title',
        sortDirection ?? 'asc',
        houses,
        categories,
        collection,
      );

  const getSortIcon = (field: SortField) => {
    if (!onSort) return null;
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const SortableHeader = ({
    field,
    children,
    align = 'left',
  }: {
    field: SortField;
    children: React.ReactNode;
    align?: 'left' | 'right';
  }) => (
    <TableHead className={align === 'right' ? 'text-right' : undefined}>
      {onSort ? (
        <Button
          variant="ghost"
          className="h-auto p-0 font-semibold hover:bg-transparent"
          onClick={() => handleSort(field)}
        >
          <span className="mr-2">{children}</span>
          {getSortIcon(field)}
        </Button>
      ) : (
        children
      )}
    </TableHead>
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16"></TableHead>
            <SortableHeader field="title">Title</SortableHeader>
            <SortableHeader field="creator">{creatorLabel}</SortableHeader>
            <SortableHeader field="category">{categoryLabel}</SortableHeader>
            <SortableHeader field="year">{yearLabel}</SortableHeader>
            <SortableHeader field="location">Location</SortableHeader>
            <SortableHeader field="valuation" align="right">
              Valuation
            </SortableHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item, idx) => {
            const creator = getItemCreator(item);
            const category = getItemCategory(item);
            const subcategory = getItemSubcategory(item);
            const year = getItemYear(item);
            const location = formatItemLocation(item);
            const valuation = getItemValuationValue(item);
            const valuationCurrency = getItemValuationCurrency(item);

            return (
              <TableRow
                key={item.id}
                className={cn(
                  'cursor-pointer hover:bg-muted/50',
                  selectedIds.includes(item.id.toString()) &&
                    'bg-[hsl(var(--primary)/0.1)]',
                )}
                onClick={(e) => {
                  if (e.shiftKey) {
                    handleItemToggle(item, idx, true);
                  } else {
                    onItemClick?.(item);
                  }
                }}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    {onSelectionChange && (
                      <Checkbox
                        checked={selectedIds.includes(item.id.toString())}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemToggle(item, idx, e.shiftKey);
                        }}
                        className="bg-card rounded-sm"
                      />
                    )}
                    <div className="w-12 h-12 rounded overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>
                  {creator ? (
                    <span className="text-sm">{creator}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {category ? (
                      <p className="capitalize">{category}</p>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                    {subcategory && (
                      <p className="text-muted-foreground">
                        {subcategoryLabel}: {subcategory}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>{year ?? '—'}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {location ? (
                      <span>{location}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {valuation !== undefined ? (
                    <Badge variant="outline">
                      {formatCurrencyOptional(valuation, valuationCurrency)}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
