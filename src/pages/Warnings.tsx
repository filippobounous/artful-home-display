import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { InventoryHeader } from '@/components/InventoryHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, AlertTriangle } from 'lucide-react';
import { SidebarLayout } from '@/components/SidebarLayout';
import { useToast } from '@/hooks/use-toast';
import { fetchDecorItems } from '@/lib/api/items';
import { DecorItem, ViewMode } from '@/types/inventory';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchFilters } from '@/components/SearchFilters';
import { ItemsGrid } from '@/components/ItemsGrid';
import { ItemsList } from '@/components/ItemsList';
import { ItemsTable } from '@/components/ItemsTable';
import { EmptyState } from '@/components/EmptyState';
import { useSettingsState } from '@/hooks/useSettingsState';
import { sortInventoryItems } from '@/lib/sortUtils';

interface WarningItem extends DecorItem {
  missingFields: string[];
}

const Warnings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string[]>([]);
  const [valuationRange, setValuationRange] = useState<{
    min?: number;
    max?: number;
  }>({});
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchParams, setSearchParams] = useSearchParams();
  const { houses, categories } = useSettingsState();
  type SortField =
    | 'title'
    | 'artist'
    | 'category'
    | 'valuation'
    | 'yearPeriod'
    | 'location';
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['decor-items-warnings'],
    queryFn: fetchDecorItems,
  });

  const getWarningItems = (items: DecorItem[]): WarningItem[] => {
    return items
      .map((item) => {
        const missingFields: string[] = [];

        if (!item.title?.trim()) missingFields.push('Title');
        if (!item.artist?.trim()) missingFields.push('Artist');
        if (!item.category?.trim()) missingFields.push('Category');
        if (!item.subcategory?.trim()) missingFields.push('Subcategory');
        if (!item.house?.trim()) missingFields.push('House');
        if (!item.room?.trim()) missingFields.push('Room');
        if (!item.yearPeriod?.toString().trim()) missingFields.push('Year');
        if (!item.acquisitionDate?.trim()) missingFields.push('Date');
        if (!item.quantity || item.quantity <= 0)
          missingFields.push('Quantity');

        if (missingFields.length > 0) {
          return { ...item, missingFields } as WarningItem;
        }
        return null;
      })
      .filter((item): item is WarningItem => item !== null);
  };

  const warningItems = getWarningItems(items);

  const yearOptions = useMemo(() => {
    const years = new Set<string>();
    items.forEach((item) => {
      if (item.yearPeriod) years.add(item.yearPeriod);
    });
    return Array.from(years);
  }, [items]);

  const artistOptions = useMemo(() => {
    const artists = new Set<string>();
    items.forEach((item) => {
      if (item.artist) artists.add(item.artist);
    });
    return Array.from(artists);
  }, [items]);

  const conditionOptions = useMemo(() => {
    const conditions = new Set<string>();
    items.forEach((item) => {
      if (item.condition) conditions.add(item.condition);
    });
    return Array.from(conditions);
  }, [items]);

  const currencyOptions = useMemo(() => {
    const currencies = new Set<string>();
    items.forEach((item) => {
      if (item.valuationCurrency) currencies.add(item.valuationCurrency);
    });
    return Array.from(currencies);
  }, [items]);

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setSelectedCategory(searchParams.getAll('category'));
    setSelectedSubcategory(searchParams.getAll('subcategory'));
    setSelectedHouse(searchParams.getAll('house'));
    setSelectedRoom(searchParams.getAll('room'));
    setSelectedYear(searchParams.getAll('year'));
    setSelectedCondition(searchParams.getAll('condition'));
    setSelectedCurrency(searchParams.getAll('currency'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    selectedCategory.forEach((c) => params.append('category', c));
    selectedSubcategory.forEach((s) => params.append('subcategory', s));
    selectedHouse.forEach((h) => params.append('house', h));
    selectedRoom.forEach((r) => params.append('room', r));
    selectedYear.forEach((y) => params.append('year', y));
    selectedCondition.forEach((condition) => params.append('condition', condition));
    selectedCurrency.forEach((currency) => params.append('currency', currency));
    setSearchParams(params, { replace: true });
  }, [
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    selectedHouse,
    selectedRoom,
    selectedYear,
    selectedCondition,
    selectedCurrency,
    setSearchParams,
  ]);

  const filteredItems = useMemo(() => {
    return warningItems.filter((item) => {
      if (item.deleted) return false;

      const term = searchTerm.toLowerCase();
      const matchesSearch =
        term === '' ||
        item.title.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term)) ||
        (item.notes && item.notes.toLowerCase().includes(term)) ||
        (item.artist && item.artist.toLowerCase().includes(term));

      const matchesCategory =
        selectedCategory.length === 0 ||
        selectedCategory.includes(item.category);

      const matchesSubcategory =
        selectedSubcategory.length === 0 ||
        (item.subcategory && selectedSubcategory.includes(item.subcategory));

      const matchesHouse =
        selectedHouse.length === 0 || selectedHouse.includes(item.house || '');

      const roomKey = `${item.house}|${item.room}`;
      const matchesRoom =
        selectedRoom.length === 0 || selectedRoom.includes(roomKey);

      const matchesYear =
        selectedYear.length === 0 ||
        (item.yearPeriod && selectedYear.includes(item.yearPeriod));

      const matchesArtist =
        selectedArtist.length === 0 ||
        (item.artist && selectedArtist.includes(item.artist));
      
      const matchesCondition =
        selectedCondition.length === 0 ||
        (item.condition && selectedCondition.includes(item.condition));
      
      const matchesCurrency =
        selectedCurrency.length === 0 ||
        (item.valuationCurrency &&
          selectedCurrency.includes(item.valuationCurrency));

      const matchesValuation =
        (!valuationRange.min ||
          (item.valuation && item.valuation >= valuationRange.min)) &&
        (!valuationRange.max ||
          (item.valuation && item.valuation <= valuationRange.max));

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesHouse &&
        matchesRoom &&
        matchesYear &&
        matchesArtist &&
        matchesCondition &&
        matchesValuation &&
        matchesCurrency
      );
    });
  }, [
    warningItems,
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    selectedHouse,
    selectedRoom,
    selectedYear,
    selectedArtist,
    selectedCondition,
    selectedCurrency,
    valuationRange,
  ]);

  const sortedItems = useMemo(() => {
    return sortInventoryItems(
      filteredItems,
      sortField,
      sortDirection,
      houses,
      categories,
    );
  }, [filteredItems, sortField, sortDirection, houses, categories]);

  const handleSort = (field: string, direction: 'asc' | 'desc') => {
    setSortField(field as SortField);
    setSortDirection(direction);
  };

  const filteredWarnings = useMemo(
    () =>
      filteredItems.map((item) => ({
        type: 'Decor',
        code: item.code || `#${item.id}`,
        title: item.title || 'Untitled Item',
        missingFields: item.missingFields,
        lastUpdated: item.acquisitionDate || 'Unknown',
      })),
    [filteredItems],
  );

  const handleExportCsv = () => {
    const csvContent = [
      ['Item Type', 'Item ID/Code', 'Missing Fields', 'Last Updated'].join(','),
      ...filteredWarnings.map((warning) =>
        [
          warning.type,
          warning.code,
          `"${warning.missingFields.join(', ')}"`,
          warning.lastUpdated,
        ].join(','),
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory-warnings.csv';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export successful',
      description: 'Warnings data has been exported to CSV.',
    });
  };

  const handleCopyToClipboard = () => {
    const text = filteredWarnings
      .map(
        (warning) =>
          `${warning.type} - ${warning.code} | Missing: ${warning.missingFields.join(', ')} | Last Updated: ${warning.lastUpdated}`,
      )
      .join('\n');

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
          artistOptions={artistOptions}
          selectedArtist={selectedArtist}
          setSelectedArtist={setSelectedArtist}
          conditionOptions={conditionOptions}
          selectedCondition={selectedCondition}
          setSelectedCondition={setSelectedCondition}
          currencyOptions={currencyOptions}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
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
