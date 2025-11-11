import { useParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { InventoryHeader } from '@/components/InventoryHeader';
import { getItemsFetcher, itemsQueryKey } from '@/lib/api/items';
import { SearchFilters } from '@/components/SearchFilters';
import { ItemsGrid } from '@/components/ItemsGrid';
import { ItemsList } from '@/components/ItemsList';
import { ItemsTable } from '@/components/ItemsTable';
import { EmptyState } from '@/components/EmptyState';
import { useSettingsState } from '@/hooks/useSettingsState';
import { SidebarLayout } from '@/components/SidebarLayout';
import { useInventoryFilters } from '@/hooks/useInventoryFilters';
import { useCollection } from '@/context/CollectionProvider';

export default function HousePage() {
  const { houseId } = useParams<{ houseId: string }>();
  const navigate = useNavigate();
  const { houses, categories } = useSettingsState();
  const { collection } = useCollection();
  const decodedHouseId = houseId ? decodeURIComponent(houseId) : '';
  const house = houses.find((h) => h.id === decodedHouseId);

  const fetchItems = useMemo(() => getItemsFetcher(collection), [collection]);

  const { data: items = [], isLoading } = useQuery({
    queryKey: itemsQueryKey(collection),
    queryFn: fetchItems,
  });

  const filters = useInventoryFilters({
    items,
    categories,
    houses,
    collection,
    permanentHouseId: decodedHouseId,
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
