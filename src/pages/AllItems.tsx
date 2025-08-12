import { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { InventoryHeader } from '@/components/InventoryHeader';
import { ItemsGrid } from '@/components/ItemsGrid';
import { ItemsList } from '@/components/ItemsList';
import { ItemsTable } from '@/components/ItemsTable';
import { SearchFilters } from '@/components/SearchFilters';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Grid, List, Table2, Download, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  fetchDecorItems, 
  updateDecorItem, 
  deleteDecorItem, 
  decorItemToInput,
  type DecorItemInput 
} from '@/lib/api';
import { DecorItem } from '@/types/inventory';
import { useSettingsState } from '@/hooks/useSettingsState';
import { BatchLocationDialog } from '@/components/BatchLocationDialog';
import { useToast } from '@/hooks/use-toast';
import { formatNumber } from '@/lib/currencyUtils';

const AllItems = () => {
  const [view, setView] = useState<'grid' | 'list' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState<{ houses: string[], rooms: string[] }>({ houses: [], rooms: [] });
  const [artistFilter, setArtistFilter] = useState<string[]>([]);
  const [yearFilter, setYearFilter] = useState<{ min: number | null, max: number | null }>({ min: null, max: null });
  const [valuationFilter, setValuationFilter] = useState<{ min: number | null, max: number | null, currencies: string[] }>({ min: null, max: null, currencies: [] });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showBatchDialog, setShowBatchDialog] = useState(false);

  const { categories, houses } = useSettingsState();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['decorItems'],
    queryFn: fetchDecorItems,
  });

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (item.deleted) return false;
      
      const matchesSearch = !searchTerm || 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter.length === 0 || 
        categoryFilter.includes(item.category);
      
      const matchesLocation = (locationFilter.houses.length === 0 || locationFilter.houses.includes(item.house)) &&
        (locationFilter.rooms.length === 0 || locationFilter.rooms.includes(item.room));
      
      const matchesArtist = artistFilter.length === 0 || 
        (item.artist && artistFilter.includes(item.artist));
      
      const itemYear = parseInt(item.yearPeriod || '0');
      const matchesYear = (yearFilter.min === null || itemYear >= yearFilter.min) &&
        (yearFilter.max === null || itemYear <= yearFilter.max);
      
      const itemValue = item.valuation || 0;
      const itemCurrency = item.valuationCurrency || 'GBP';
      const matchesValuation = (valuationFilter.min === null || itemValue >= valuationFilter.min) &&
        (valuationFilter.max === null || itemValue <= valuationFilter.max) &&
        (valuationFilter.currencies.length === 0 || valuationFilter.currencies.includes(itemCurrency));
      
      return matchesSearch && matchesCategory && matchesLocation && matchesArtist && matchesYear && matchesValuation;
    });
  }, [items, searchTerm, categoryFilter, locationFilter, artistFilter, yearFilter, valuationFilter]);

  const handleEdit = async (item: DecorItem) => {
    try {
      const input: DecorItemInput = decorItemToInput(item);
      await updateDecorItem(item.id, input);
      queryClient.invalidateQueries({ queryKey: ['decorItems'] });
      toast({
        title: 'Success',
        description: 'Item updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update item',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDecorItem(id);
      queryClient.invalidateQueries({ queryKey: ['decorItems'] });
      toast({
        title: 'Success',
        description: 'Item deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive',
      });
    }
  };

  const handleBatchLocationUpdate = async (houseId: string, roomId: string) => {
    try {
      const updatePromises = selectedItems.map(async (itemId) => {
        const item = items.find(i => i.id === itemId);
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
      queryClient.invalidateQueries({ queryKey: ['decorItems'] });
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

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter([]);
    setLocationFilter({ houses: [], rooms: [] });
    setArtistFilter([]);
    setYearFilter({ min: null, max: null });
    setValuationFilter({ min: null, max: null, currencies: [] });
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <InventoryHeader />
            <main className="flex-1 p-6">
              <div className="space-y-6">
                <div className="h-8 bg-muted animate-pulse rounded" />
                <div className="h-64 bg-muted animate-pulse rounded" />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <InventoryHeader />
            <main className="flex-1 p-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Failed to load items</p>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <InventoryHeader />

          <main className="flex-1 p-6">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    All Items
                  </h2>
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
                  
                  <div className="flex gap-1 bg-muted rounded-lg p-1">
                    <Button
                      variant={view === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setView('grid')}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={view === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setView('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={view === 'table' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setView('table')}
                    >
                      <Table2 className="w-4 h-4" />
                    </Button>
                  </div>

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
                onSearchChange={setSearchTerm}
                categoryFilter={categoryFilter}
                onCategoryFilterChange={setCategoryFilter}
                locationFilter={locationFilter}
                onLocationFilterChange={setLocationFilter}
                artistFilter={artistFilter}
                onArtistFilterChange={setArtistFilter}
                yearFilter={yearFilter}
                onYearFilterChange={setYearFilter}
                valuationFilter={valuationFilter}
                onValuationFilterChange={setValuationFilter}
                onClearFilters={handleClearFilters}
                items={items}
                categories={categories}
                houses={houses}
              />

              {filteredItems.length === 0 ? (
                <EmptyState
                  title="No items found"
                  description="Try adjusting your search criteria or add your first item."
                />
              ) : (
                <>
                  {view === 'grid' && (
                    <ItemsGrid
                      items={filteredItems}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      selectedItems={selectedItems}
                      onSelectionChange={setSelectedItems}
                    />
                  )}
                  {view === 'list' && (
                    <ItemsList
                      items={filteredItems}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      selectedItems={selectedItems}
                      onSelectionChange={setSelectedItems}
                    />
                  )}
                  {view === 'table' && (
                    <ItemsTable
                      items={filteredItems}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      selectedItems={selectedItems}
                      onSelectionChange={setSelectedItems}
                    />
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      <BatchLocationDialog
        open={showBatchDialog}
        onOpenChange={setShowBatchDialog}
        selectedCount={selectedItems.length}
        houses={houses}
        onConfirm={handleBatchLocationUpdate}
      />
    </SidebarProvider>
  );
};

export default AllItems;
