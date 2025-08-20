import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { SidebarLayout } from '@/components/SidebarLayout';

export default function HousePage() {
  const { houseId } = useParams<{ houseId: string }>();
  const navigate = useNavigate();
  const { houses, categories } = useSettingsState();
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
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  type SortField =
    | 'title'
    | 'artist'
    | 'category'
    | 'valuation'
    | 'yearPeriod'
    | 'location';
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const decodedHouseId = houseId ? decodeURIComponent(houseId) : '';
  const house = houses.find((h) => h.id === decodedHouseId);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['decor-items'],
    queryFn: fetchDecorItems,
  });

  // Filter items for this house
  const houseItems = useMemo(() => {
    return items.filter((item) => item.house === decodedHouseId);
  }, [items, decodedHouseId]);

  const filteredItems = useMemo(() => {
    return houseItems.filter((item) => {
      const matchesSearch =
        searchTerm === '' ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory.length === 0 ||
        selectedCategory.includes(item.category);

      const matchesSubcategory =
        selectedSubcategory.length === 0 ||
        (item.subcategory && selectedSubcategory.includes(item.subcategory));

      const matchesYear =
        selectedYear.length === 0 ||
        (item.yearPeriod && selectedYear.includes(item.yearPeriod));

      const matchesArtist =
        selectedArtist.length === 0 ||
        (item.artist && selectedArtist.includes(item.artist));

      const matchesValuation =
        (!valuationRange.min ||
          (item.valuation && item.valuation >= valuationRange.min)) &&
        (!valuationRange.max ||
          (item.valuation && item.valuation <= valuationRange.max));

      const roomKey = `${item.house}|${item.room}`;
      const matchesRoom =
        selectedRoom.length === 0 || selectedRoom.includes(roomKey);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesYear &&
        matchesArtist &&
        matchesValuation &&
        matchesRoom
      );
    });
  }, [
    houseItems,
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    selectedRoom,
    selectedYear,
    selectedArtist,
    valuationRange,
  ]);

  const yearOptions = useMemo(
    () => [...new Set(items.map((item) => item.yearPeriod || ''))].sort(),
    [items],
  );

  const artistOptions = useMemo(
    () => [...new Set(items.map((item) => item.artist || ''))].sort(),
    [items],
  );

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

  if (!house) {
    return <div>House not found</div>;
  }

  return (
    <SidebarLayout>
      <InventoryHeader />
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {house.name}
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
          permanentHouse={decodedHouseId}
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
}
