
import { useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { InventoryHeader } from '@/components/InventoryHeader';
import { fetchDecorItems } from '@/lib/api/items';
import { SearchFilters } from '@/components/SearchFilters';
import { ItemsGrid } from '@/components/ItemsGrid';
import { ItemsList } from '@/components/ItemsList';
import { ItemsTable } from '@/components/ItemsTable';
import { EmptyState } from '@/components/EmptyState';
import { useSettingsState } from '@/hooks/useSettingsState';
import { sortInventoryItems } from '@/lib/sortUtils';
import type { ViewMode } from '@/types/inventory';

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { categories, houses } = useSettingsState();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<string[]>([]);
  const [valuationRange, setValuationRange] = useState<{
    min?: number;
    max?: number;
  }>({});
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  type SortField =
    | 'title'
    | 'artist'
    | 'category'
    | 'valuation'
    | 'yearPeriod'
    | 'location';
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const decodedCategoryId = categoryId ? decodeURIComponent(categoryId) : '';
  const category = categories.find((c) => c.id === decodedCategoryId);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['decor-items'],
    queryFn: fetchDecorItems,
  });

  // Filter items for this category
  const categoryItems = useMemo(() => {
    return items.filter((item) => item.category === decodedCategoryId);
  }, [items, decodedCategoryId]);

  const filteredItems = useMemo(() => {
    let filtered = [...categoryItems];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((item) => {
        return (
          item.title.toLowerCase().includes(term) ||
          (item.description && item.description.toLowerCase().includes(term)) ||
          (item.notes && item.notes.toLowerCase().includes(term)) ||
          (item.artist && item.artist.toLowerCase().includes(term))
        );
      });
    }

    if (selectedCategory.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategory.includes(item.category),
      );
    }

    if (selectedSubcategory.length > 0) {
      filtered = filtered.filter((item) =>
        selectedSubcategory.includes(item.subcategory || ''),
      );
    }

    if (selectedHouse.length > 0) {
      filtered = filtered.filter((item) => selectedHouse.includes(item.house));
    }

    if (selectedRoom.length > 0) {
      filtered = filtered.filter((item) => selectedRoom.includes(item.room));
    }

    if (selectedYear.length > 0) {
      filtered = filtered.filter((item) =>
        selectedYear.includes(item.yearPeriod || ''),
      );
    }

    if (selectedArtist.length > 0) {
      filtered = filtered.filter((item) =>
        selectedArtist.includes(item.artist || ''),
      );
    }

    if (valuationRange.min) {
      filtered = filtered.filter(
        (item) => (item.valuation || 0) >= (valuationRange.min || 0),
      );
    }

    if (valuationRange.max) {
      filtered = filtered.filter(
        (item) => (item.valuation || 0) <= (valuationRange.max || 0),
      );
    }

    return filtered;
  }, [
    categoryItems,
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    selectedHouse,
    selectedRoom,
    selectedYear,
    selectedArtist,
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

  const yearOptions = useMemo(() => {
    const years = new Set<string>();
    items.forEach((item) => {
      if (item.yearPeriod) {
        years.add(item.yearPeriod);
      }
    });
    return Array.from(years);
  }, [items]);

  const artistOptions = useMemo(() => {
    const artists = new Set<string>();
    items.forEach((item) => {
      if (item.artist) {
        artists.add(item.artist);
      }
    });
    return Array.from(artists);
  }, [items]);

  const handleSort = (field: string, direction: 'asc' | 'desc') => {
    setSortField(field as SortField);
    setSortDirection(direction);
  };

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <InventoryHeader />
          <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {category.name}
              </h1>
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
              valuationRange={valuationRange}
              setValuationRange={setValuationRange}
              viewMode={viewMode}
              setViewMode={setViewMode}
              permanentCategory={decodedCategoryId}
            />

            {filteredItems.length === 0 ? (
              <EmptyState />
            ) : (
              <div>
                {viewMode === 'grid' && <ItemsGrid items={sortedItems} />}
                {viewMode === 'list' && (
                  <ItemsList
                    items={sortedItems}
                    onSort={handleSort}
                    sortField={sortField}
                    sortDirection={sortDirection}
                  />
                )}
                {viewMode === 'table' && (
                  <ItemsTable
                    items={sortedItems}
                    onSort={handleSort}
                    sortField={sortField}
                    sortDirection={sortDirection}
                  />
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
