import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { InventoryHeader } from '@/components/InventoryHeader';
import { fetchDecorItems } from '@/lib/api/items';
import { SearchFilters } from '@/components/SearchFilters';
import { ItemsGrid } from '@/components/ItemsGrid';
import { ItemsList } from '@/components/ItemsList';
import { ItemsTable } from '@/components/ItemsTable';
import { EmptyState } from '@/components/EmptyState';
import { useSettingsState } from '@/hooks/useSettingsState';
import { SidebarLayout } from '@/components/SidebarLayout';
import { useInventoryFilters } from '@/hooks/useInventoryFilters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getIconComponent } from '@/lib/iconRegistry';
import { Plus } from 'lucide-react';

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { categories, houses } = useSettingsState();
  const decodedCategoryId = categoryId ? decodeURIComponent(categoryId) : '';
  const category = categories.find((c) => c.id === decodedCategoryId);
  const CategoryIcon = getIconComponent(category?.icon);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['decor-items'],
    queryFn: fetchDecorItems,
  });

  const filters = useInventoryFilters({
    items,
    categories,
    houses,
    permanentCategoryId: decodedCategoryId,
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
    selectedArtist,
    setSelectedArtist,
    selectedCondition,
    setSelectedCondition,
    selectedCurrency,
    setSelectedCurrency,
    valuationRange,
    setValuationRange,
    viewMode,
    setViewMode,
    sortField,
    sortDirection,
    handleSort,
    yearOptions,
    artistOptions,
    conditionOptions,
    currencyOptions,
    filteredItems,
    sortedItems,
  } = filters;

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <SidebarLayout>
      <InventoryHeader />
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <CategoryIcon className="w-5 h-5 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {category.name}
            </h1>
            <Badge variant="secondary" className="ml-2">
              {filteredItems.length}
            </Badge>
          </div>
          <Link to="/add-item">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </Link>
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
          permanentCategory={decodedCategoryId}
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
