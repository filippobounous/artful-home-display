import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { InventoryHeader } from '@/components/InventoryHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, AlertTriangle } from 'lucide-react';
import { SidebarLayout } from '@/components/SidebarLayout';
import { useToast } from '@/hooks/use-toast';
import { SearchFilters } from '@/components/SearchFilters';
import { ItemsGrid } from '@/components/ItemsGrid';
import { ItemsList } from '@/components/ItemsList';
import { ItemsTable } from '@/components/ItemsTable';
import { EmptyState } from '@/components/EmptyState';
import { useSettingsState } from '@/hooks/useSettingsState';
import { useInventoryFilters } from '@/hooks/useInventoryFilters';
import { useCollection } from '@/context/CollectionProvider';
import {
  getItemsFetcher,
  itemsQueryKey,
} from '@/lib/api/items';
import type { CollectionType, InventoryItem } from '@/types/inventory';
import {
  getCategoryLabel,
  getCreatorLabel,
  getItemCategory,
  getItemCreator,
  getItemQuantity,
  getItemYear,
  getYearLabel,
} from '@/lib/inventoryDisplay';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface WarningExportRow {
  type: string;
  code: string;
  missingFields: string[];
  lastUpdated: string;
}

type WarningItem = InventoryItem & { missingFields: string[] };

const getMissingFields = (
  item: InventoryItem,
  collection: CollectionType,
): string[] => {
  const missing: string[] = [];
  const creatorLabel = getCreatorLabel(collection);
  const categoryLabel = getCategoryLabel(collection);
  const yearLabel = getYearLabel(collection);

  if (!item.title?.trim()) missing.push('Title');
  if (!getItemCreator(item)) missing.push(creatorLabel);
  if (!getItemCategory(item)) missing.push(categoryLabel);
  if (!item.house) missing.push('House');
  if (!item.room) missing.push('Room');
  if (!getItemYear(item)) missing.push(yearLabel);

  if (collection === 'books') {
    if (!('isbn' in item && item.isbn)) missing.push('ISBN');
  } else if (collection === 'music') {
    if (!('format' in item && item.format)) missing.push('Format');
  } else {
    if (!('subcategory' in item && item.subcategory)) {
      missing.push('Subcategory');
    }
    const quantity = getItemQuantity(item);
    if (!quantity || quantity <= 0) missing.push('Quantity');
  }

  return missing;
};

const formatWarningRows = (items: WarningItem[]): WarningExportRow[] =>
  items.map((item) => ({
    type: 'Inventory Item',
    code: item.id ? `#${item.id}` : item.title,
    missingFields: item.missingFields,
    lastUpdated:
      'valuationDate' in item && item.valuationDate
        ? item.valuationDate
        : 'Unknown',
  }));

const convertWarningsToCsv = (rows: WarningExportRow[]): string => {
  const header = ['Item Type', 'Item ID/Code', 'Missing Fields', 'Last Updated'];
  const csvRows = rows.map((row) =>
    [
      row.type,
      row.code,
      `"${row.missingFields.join(', ')}"`,
      row.lastUpdated,
    ].join(','),
  );
  return [header.join(','), ...csvRows].join('\n');
};

const warningsToClipboardText = (rows: WarningExportRow[]): string =>
  rows
    .map(
      (row) =>
        `${row.type} - ${row.code} | Missing: ${row.missingFields.join(', ')} | Last Updated: ${row.lastUpdated}`,
    )
    .join('\n');

const Warnings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { collection } = useCollection();
  const { categories, houses } = useSettingsState();
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchItems = useMemo(() => getItemsFetcher(collection), [collection]);

  const { data: items = [], isLoading } = useQuery({
    queryKey: itemsQueryKey(collection),
    queryFn: fetchItems,
  });

  const warningItems = useMemo(() => {
    return items
      .map((item) => ({
        ...item,
        missingFields: getMissingFields(item, collection),
      }))
      .filter((item): item is WarningItem => item.missingFields.length > 0);
  }, [items, collection]);

  const filters = useInventoryFilters({
    items: warningItems,
    categories,
    houses,
    collection,
  });

  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    selectedHouse,
    setSelectedHouse,
    selectedRoom,
    setSelectedRoom,
    selectedYear,
    setSelectedYear,
    selectedCreator,
    setSelectedCreator,
    valuationRange,
    setValuationRange,
    viewMode,
    setViewMode,
    sortField,
    sortDirection,
    handleSort,
    yearOptions,
    creatorOptions,
    filteredItems,
    sortedItems,
  } = filters;

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setSelectedCategory(searchParams.getAll('category'));
    setSelectedSubcategory(searchParams.getAll('subcategory'));
    setSelectedHouse(searchParams.getAll('house'));
    setSelectedRoom(searchParams.getAll('room'));
    setSelectedYear(searchParams.getAll('year'));
    setSelectedCreator(searchParams.getAll('creator'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    selectedCategory.forEach((value) => params.append('category', value));
    selectedSubcategory.forEach((value) =>
      params.append('subcategory', value),
    );
    selectedHouse.forEach((value) => params.append('house', value));
    selectedRoom.forEach((value) => params.append('room', value));
    selectedYear.forEach((value) => params.append('year', value));
    selectedCreator.forEach((value) => params.append('creator', value));
    if (valuationRange.min !== undefined)
      params.set('valuationMin', String(valuationRange.min));
    if (valuationRange.max !== undefined)
      params.set('valuationMax', String(valuationRange.max));
    setSearchParams(params, { replace: true });
  }, [
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    selectedHouse,
    selectedRoom,
    selectedYear,
    selectedCreator,
    valuationRange,
    setSearchParams,
  ]);

  const filteredWarnings = useMemo(
    () => formatWarningRows(filteredItems),
    [filteredItems],
  );

  const handleExportCsv = () => {
    const csvContent = convertWarningsToCsv(filteredWarnings);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'inventory-warnings.csv';
    anchor.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'Export successful',
      description: 'Warnings data has been exported to CSV.',
    });
  };

  const handleCopyToClipboard = () => {
    const text = warningsToClipboardText(filteredWarnings);
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied to clipboard',
        description: 'Warnings data has been copied to your clipboard.',
      });
    });
  };

  if (isLoading) {
    return (
      <SidebarLayout>
        <InventoryHeader />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-64 bg-muted animate-pulse rounded" />
          </div>
        </main>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <InventoryHeader />

      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Warnings
            </h1>
            <Badge variant="secondary" className="ml-2">
              {filteredItems.length}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportCsv} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={handleCopyToClipboard} variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </Button>
          </div>
        </div>

        <SearchFilters
          collection={collection}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSubcategory={selectedSubcategory}
          setSelectedSubcategory={setSelectedSubcategory}
          selectedHouse={selectedHouse}
          setSelectedHouse={setSelectedHouse}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          yearOptions={yearOptions}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          creatorOptions={creatorOptions}
          selectedCreator={selectedCreator}
          setSelectedCreator={setSelectedCreator}
          valuationRange={valuationRange}
          setValuationRange={setValuationRange}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {filteredItems.length === 0 ? (
          <EmptyState />
        ) : (
          <div>
            {viewMode === 'grid' && (
              <ItemsGrid
                items={sortedItems}
                onItemClick={(item) => navigate(`/items/${item.id}`)}
              />
            )}
            {viewMode === 'list' && (
              <ItemsList
                items={sortedItems}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
                onItemClick={(item) => navigate(`/items/${item.id}`)}
              />
            )}
            {viewMode === 'table' && (
              <ItemsTable
                items={sortedItems}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
                onItemClick={(item) => navigate(`/items/${item.id}`)}
              />
            )}
          </div>
        )}
      </main>
    </SidebarLayout>
  );
};

export default Warnings;

