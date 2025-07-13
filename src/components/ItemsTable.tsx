import { useRef } from 'react';
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
import { DecorItem } from '@/types/inventory';

interface ItemsTableProps {
  items: DecorItem[];
  onItemClick?: (item: DecorItem) => void;
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

export function ItemsTable({
  items,
  onItemClick,
  onSort,
  sortField,
  sortDirection,
  selectedIds = [],
  onSelectionChange,
}: ItemsTableProps) {
  const lastIndex = useRef<number | null>(null);

  const formatCurrency = (value?: number, currency?: string) => {
    if (!value) return '-';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'EUR',
    });
    return formatter.format(value);
  };

  const handleSort = (field: string) => {
    if (onSort) {
      const newDirection =
        sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(field, newDirection);
    }
  };

  const getSortIcon = (field: string) => {
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
  }: {
    field: string;
    children: React.ReactNode;
  }) => (
    <TableHead>
      {onSort ? (
        <Button
          variant="ghost"
          className="h-auto p-0 font-semibold hover:bg-transparent"
          onClick={() => handleSort(field)}
        >
          {children}
          {getSortIcon(field)}
        </Button>
      ) : (
        children
      )}
    </TableHead>
  );

  const toggle = (id: string, index: number, shift: boolean) => {
    if (!onSelectionChange) return;
    let newIds = [...selectedIds];
    if (shift && lastIndex.current !== null) {
      const start = Math.min(lastIndex.current, index);
      const end = Math.max(lastIndex.current, index);
      const range = items.slice(start, end + 1).map((i) => i.id.toString());
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16"></TableHead>
            <SortableHeader field="title">Title</SortableHeader>
            <SortableHeader field="artist">Artist</SortableHeader>
            <SortableHeader field="category">Category</SortableHeader>
            <SortableHeader field="yearPeriod">Year</SortableHeader>
            <SortableHeader field="location">Location</SortableHeader>
            <SortableHeader field="valuation">
              <div className="text-right">Valuation</div>
            </SortableHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, idx) => (
            <TableRow
              key={item.id}
              className={cn(
                'cursor-pointer hover:bg-muted/50',
                selectedIds.includes(item.id.toString()) && 'bg-blue-50',
              )}
              onClick={(e) => {
                if (e.shiftKey) {
                  toggle(item.id.toString(), idx, true);
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
                        toggle(item.id.toString(), idx, false);
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
              <TableCell>{item.artist || '-'}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <p className="capitalize">{item.category}</p>
                  {item.subcategory && (
                    <p className="text-muted-foreground">{item.subcategory}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>{item.yearPeriod || '-'}</TableCell>
              <TableCell>
                <div className="text-sm">
                  {item.house && (
                    <p className="capitalize">{item.house.replace('-', ' ')}</p>
                  )}
                  {item.room && (
                    <p className="text-muted-foreground capitalize">
                      {item.room.replace('-', ' ')}
                    </p>
                  )}
                </div>
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
