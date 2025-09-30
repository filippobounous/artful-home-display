import { useEffect, useState } from 'react';
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
import type { DecorItemInput } from '@/types/inventory';
import { useSettingsState } from '@/hooks/useSettingsState';
import { BatchLocationDialog } from '@/components/BatchLocationDialog';
import { useToast } from '@/hooks/use-toast';
import { formatNumber } from '@/lib/currencyUtils';
import { SidebarLayout } from '@/components/SidebarLayout';
import { useInventoryFilters } from '@/hooks/useInventoryFilters';
import { useAuth } from '@/hooks/useAuth';

const AllItems = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId?: string }>();
  const { canWrite } = useAuth();

  useEffect(() => {
    if (!canWrite) {
      setSelectedItems([]);
      setShowBatchDialog(false);
    }
  }, [canWrite]);

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

  const filters = useInventoryFilters({
    items,
    categories,
    houses,
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
    valuationRange,
    setValuationRange,
    viewMode,
    setViewMode,
    sortField,
    sortDirection,
    handleSort,
    yearOptions,
    artistOptions,
    filteredItems,
    sortedItems,
  } = filters;

  const handleBatchLocationUpdate = async (houseId: string, roomId: string) => {
    if (!canWrite) return;
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
            {canWrite && (
              <Link to="/add-item">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </Link>
            )}
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
                onItemClick={(item) => navigate(`/items/${item.id}`)}
                {...(canWrite
                  ? {
                      selectedIds: selectedItems,
                      onSelectionChange: (ids: string[]) => setSelectedItems(ids),
                    }
                  : {})}
              />
            )}
            {viewMode === 'list' && (
              <ItemsList
                items={sortedItems}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
                onItemClick={(item) => navigate(`/items/${item.id}`)}
                {...(canWrite
                  ? {
                      selectedIds: selectedItems,
                      onSelectionChange: (ids: string[]) => setSelectedItems(ids),
                    }
                  : {})}
              />
            )}
            {viewMode === 'table' && (
              <ItemsTable
                items={sortedItems}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
                onItemClick={(item) => navigate(`/items/${item.id}`)}
                {...(canWrite
                  ? {
                      selectedIds: selectedItems,
                      onSelectionChange: (ids: string[]) => setSelectedItems(ids),
                    }
                  : {})}
              />
            )}
          </div>
        )}
      </main>
      <BatchLocationDialog
        open={canWrite ? showBatchDialog : false}
        onOpenChange={(open) => canWrite && setShowBatchDialog(open)}
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
        onEdit={
          canWrite
            ? (item) => navigate(`/add-item?draftId=${item.id}`)
            : undefined
        }
      />
    </SidebarLayout>
  );
};

export default AllItems;
