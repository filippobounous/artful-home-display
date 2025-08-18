import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { InventoryHeader } from '@/components/InventoryHeader';
import { ItemsGrid } from '@/components/ItemsGrid';
import { ItemsList } from '@/components/ItemsList';
import { ItemsTable } from '@/components/ItemsTable';
import { SearchFilters } from '@/components/SearchFilters';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  fetchDecorItems,
  fetchDecorItem,
  updateDecorItem,
  decorItemToInput,
} from '@/lib/api';
import { ItemDetailDialog } from '@/components/ItemDetailDialog';
import type { DecorItemInput, ViewMode } from '@/types/inventory';
import { useSettingsState } from '@/hooks/useSettingsState';
import { BatchLocationDialog } from '@/components/BatchLocationDialog';
import { useToast } from '@/hooks/use-toast';
import { formatNumber } from '@/lib/currencyUtils';
import { sortInventoryItems } from '@/lib/sortUtils';
import { SidebarLayout } from '@/components/SidebarLayout';

const AllItems = () => {
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
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId?: string }>();

  const {
    data: selectedItem,
    isLoading: itemLoading,
    error: itemError,
  } = useQuery({
    queryKey: ['decor-item', itemId],
    queryFn: () => (itemId ? fetchDecorItem(itemId) : Promise.resolve(null)),
    enabled: !!itemId,
  });

  const { categories, houses } = useSettingsState();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['decor-items'],
    queryFn: fetchDecorItems,
  });

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

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
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
        matchesValuation
      );
    });
  }, [
    items,
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    selectedHouse,
    selectedRoom,
    selectedYear,
    selectedArtist,
    valuationRange,
  ]);

  type SortField =
    | 'title'
    | 'artist'
    | 'category'
    | 'valuation'
    | 'yearPeriod'
    | 'location';
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

  const handleBatchLocationUpdate = async (houseId: string, roomId: string) => {
    try {
      const updatePromises = selectedItems.map(async (id) => {
        const itemId = Number(id);
        const item = items.find((i) => i.id === itemId);
        if (item) {
          const input: DecorItemInput = {
            ...decorItemToInput(item),
            house: houseId,
            room: roomId,
          };
          return updateDecorItem(itemId, input);
        }
      });

      await Promise.all(updatePromises);
      queryClient.invalidateQueries({ queryKey: ['decor-items'] });
      setSelectedItems([]);
      setShowBatchDialog(false);

      toast({
        title: 'Success',
        description: `Updated location for ${selectedItems.length} items`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update item locations',
        variant: 'destructive',
      });
    }
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

  if (error) {
    return (
      <SidebarLayout>
        <InventoryHeader />
        <main className="flex-1 p-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Failed to load items</p>
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
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              All Items
            </h1>
            <p className="text-muted-foreground">
              {formatNumber(filteredItems.length)} items in your collection
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedItems.length > 0 && (
              <Button
                onClick={() => setShowBatchDialog(true)}
                variant="secondary"
                size="sm"
              >
                Update Location ({selectedItems.length})
              </Button>
            )}
            <Link to="/add-item">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </Link>
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
                selectedIds={selectedItems}
                onSelectionChange={(ids) => setSelectedItems(ids)}
                onItemClick={(item) => navigate(`/items/${item.id}`)}
              />
            )}
            {viewMode === 'list' && (
              <ItemsList
                items={sortedItems}
                selectedIds={selectedItems}
                onSelectionChange={(ids) => setSelectedItems(ids)}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
                onItemClick={(item) => navigate(`/items/${item.id}`)}
              />
            )}
            {viewMode === 'table' && (
              <ItemsTable
                items={sortedItems}
                selectedIds={selectedItems}
                onSelectionChange={(ids) => setSelectedItems(ids)}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
                onItemClick={(item) => navigate(`/items/${item.id}`)}
              />
            )}
          </div>
        )}
      </main>
      <BatchLocationDialog
        open={showBatchDialog}
        onOpenChange={setShowBatchDialog}
        onSubmit={handleBatchLocationUpdate}
      />
      <ItemDetailDialog
        item={selectedItem}
        open={!!itemId}
        loading={itemLoading}
        error={itemError instanceof Error ? itemError.message : null}
        onOpenChange={(open) => {
          if (!open) {
            if (window.history.state && window.history.state.idx > 0) {
              navigate(-1);
            } else {
              navigate('/inventory', { replace: true });
            }
          }
        }}
      />
    </SidebarLayout>
  );
};

export default AllItems;
