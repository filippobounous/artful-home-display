import { useState } from 'react';
import { useMemo } from 'react';
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
  getItemsFetcher,
  getItemFetcher,
  itemsQueryKey,
  itemQueryKey,
  getUpdateItemFn,
  getItemToInputConverter,
} from '@/lib/api';
import { ItemDetailDialog } from '@/components/ItemDetailDialog';
import type { InventoryItemInput } from '@/types/inventory';
import { useSettingsState } from '@/hooks/useSettingsState';
import { BatchLocationDialog } from '@/components/BatchLocationDialog';
import { useToast } from '@/hooks/use-toast';
import { formatNumber } from '@/lib/currencyUtils';
import { SidebarLayout } from '@/components/SidebarLayout';
import { useInventoryFilters } from '@/hooks/useInventoryFilters';
import { useCollection } from '@/context/CollectionProvider';

const AllItems = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId?: string }>();
  const { collection } = useCollection();
  const fetchItems = useMemo(() => getItemsFetcher(collection), [collection]);
  const fetchItemById = useMemo(
    () => getItemFetcher(collection),
    [collection],
  );
  const updateItem = useMemo(() => getUpdateItemFn(collection), [collection]);
  const itemToInput = useMemo(
    () => getItemToInputConverter(collection),
    [collection],
  );

  const {
    data: selectedItem,
    isLoading: itemLoading,
    error: itemError,
  } = useQuery({
    queryKey: itemId ? itemQueryKey(collection, itemId) : undefined,
    queryFn: () => (itemId ? fetchItemById(itemId) : Promise.resolve(null)),
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
    queryKey: itemsQueryKey(collection),
    queryFn: fetchItems,
  });

  const filters = useInventoryFilters({
    items,
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

  const handleBatchLocationUpdate = async (houseId: string, roomId: string) => {
    try {
      const updatePromises = selectedItems.map(async (id) => {
        const itemId = Number(id);
        const item = items.find((i) => i.id === itemId);
        if (item) {
          const input = {
            ...itemToInput(item),
            house: houseId,
            room: roomId,
          } as InventoryItemInput;
          return updateItem(itemId, input);
        }
        return undefined;
      });

      await Promise.all(updatePromises);
      queryClient.invalidateQueries({ queryKey: itemsQueryKey(collection) });
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
        onEdit={(item) => navigate(`/add-item?draftId=${item.id}`)}
      />
    </SidebarLayout>
  );
};

export default AllItems;
