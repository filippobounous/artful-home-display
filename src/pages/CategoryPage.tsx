import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { InventoryHeader } from "@/components/InventoryHeader";
import { SearchFilters } from "@/components/SearchFilters";
import { ItemsGrid } from "@/components/ItemsGrid";
import { ItemsList } from "@/components/ItemsList";
import { ItemsTable } from "@/components/ItemsTable";
import { ItemDetailDialog } from "@/components/ItemDetailDialog";
import { ItemHistoryDialog } from "@/components/ItemHistoryDialog";
import { EmptyState } from "@/components/EmptyState";
import { sampleDecorItems } from "@/data/sampleData";
import { fetchDecorItems, deleteDecorItem, restoreDecorItem, updateDecorItem } from "@/lib/api";
import { BatchLocationDialog } from "@/components/BatchLocationDialog";
import { Button } from "@/components/ui/button";
import { DecorItem } from "@/types/inventory";
import { useSettingsState } from "@/hooks/useSettingsState";
import { sortInventoryItems } from "@/lib/sortUtils";
import { useToast } from "@/hooks/use-toast";

export type ViewMode = "grid" | "list" | "table";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>(categoryId ? [categoryId] : []);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string[]>([]); // stores "houseId|roomId"
  const [selectedYear, setSelectedYear] = useState<string[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<string[]>([]);
  const [valuationRange, setValuationRange] = useState<{ min?: number; max?: number }>({});
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [items, setItems] = useState<DecorItem[]>(sampleDecorItems);
  const [selectedItem, setSelectedItem] = useState<DecorItem | null>(null);
  const [historyItem, setHistoryItem] = useState<DecorItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { categories, houses } = useSettingsState();
  const { toast } = useToast();
  const yearOptions = Array.from(new Set(items.map(i => i.yearPeriod).filter(Boolean)));
  const artistOptions = Array.from(new Set(items.map(i => i.artist).filter(Boolean)));

  const handleEdit = (item: DecorItem) => {
    localStorage.setItem('editingDraft', JSON.stringify(item));
    navigate(`/add?draftId=${item.id}`);
  };

  const handleDelete = (item: DecorItem) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    deleteDecorItem(item.id)
      .then(() => {
        setItems(prev => prev.filter(i => i.id !== item.id));
        toast({
          title: 'Item deleted',
          description: 'The item has been removed successfully',
        });
        setSelectedItem(null);
      })
      .catch(() => {
        toast({
          title: 'Error deleting item',
          description: 'There was a problem deleting the item',
          variant: 'destructive',
        });
      });
  };

  const handleHistory = (item: DecorItem) => {
    setHistoryItem(item);
  };

  const handleRestore = (version: DecorItem) => {
    if (!historyItem) return;
    restoreDecorItem(historyItem.id, version)
      .then(updated => {
        setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
        setHistoryItem(updated);
        setSelectedItem(updated);
        toast({
          title: 'Item restored',
          description: 'The selected version has been restored',
        });
      })
      .catch(() => {
        toast({
          title: 'Error restoring item',
          description: 'There was a problem restoring this version',
          variant: 'destructive',
        });
      });
  };

  const downloadSelectedCSV = () => {
    const headers = [
      'ID', 'Title', 'Artist', 'Category', 'Subcategory', 'Width (cm)', 'Height (cm)', 'Depth (cm)', 'Valuation',
      'Valuation Currency', 'Quantity', 'Year/Period', 'Description',
      'House', 'Room', 'Notes'
    ];

    const selectedItems = sortedItems.filter(item => selectedIds.includes(item.id.toString()));
    const csvContent = [
      headers.join(','),
      ...selectedItems.map(item => [
        item.id || '',
        `"${item.title || ''}"`,
        `"${item.artist || ''}"`,
        `"${item.category || ''}"`,
        `"${item.subcategory || ''}"`,
        item.widthCm ?? '',
        item.heightCm ?? '',
        item.depthCm ?? '',
        item.valuation || '',
        `"${item.valuationCurrency || ''}"`,
        item.quantity || '',
        `"${item.yearPeriod || ''}"`,
        `"${item.description || ''}"`,
        `"${item.house || ''}"`,
        `"${item.room || ''}"`,
        `"${item.notes || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `selected_items_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadSelectedImages = () => {
    console.log('Downloading selected images...');
    alert('Selected images download functionality requires backend implementation');
  };

  useEffect(() => {
    fetchDecorItems()
      .then(data => setItems(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (categoryId) {
      setSelectedCategory([categoryId]);
    }
    // Reset other filters when navigating between categories
    setSelectedSubcategory([]);
    setSelectedHouse([]);
    setSelectedRoom([]);
    setSearchTerm("");
  }, [categoryId]);

  const categoryConfig = categories.find(c => c.id === categoryId);
  const categoryName = categoryConfig?.name || "Items";

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.artist && item.artist.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = item.category === categoryId;
    const matchesSubcategory = selectedSubcategory.length === 0 || (item.subcategory && selectedSubcategory.includes(item.subcategory));
    const matchesHouse = selectedHouse.length === 0 || (item.house && selectedHouse.includes(item.house));
    const matchesRoom = selectedRoom.length === 0 || (item.room && selectedRoom.includes(`${item.house}|${item.room}`));
    const matchesYear = selectedYear.length === 0 || (item.yearPeriod && selectedYear.includes(item.yearPeriod));
    const matchesArtist = selectedArtist.length === 0 || (item.artist && selectedArtist.includes(item.artist));
    const valuation = item.valuation ?? 0;
    const matchesValuation = (valuationRange.min === undefined || valuation >= valuationRange.min) &&
                             (valuationRange.max === undefined || valuation <= valuationRange.max);

    return matchesSearch && matchesCategory && matchesSubcategory && matchesHouse && matchesRoom && matchesYear && matchesArtist && matchesValuation;
  });

  const sortedItems = sortInventoryItems(
    filteredItems,
    sortField,
    sortDirection,
    houses,
    categories
  );

  const handleSort = (field: string, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
  };

  const handleBatchLocation = (house: string, room: string) => {
    const ids = [...selectedIds];
    Promise.all(ids.map(id => updateDecorItem(id, { house, room } as unknown as DecorItem)))
      .then(updated => {
        setItems(prev =>
          prev.map(it => {
            const match = updated.find(u => u.id === it.id);
            return match ? match : it;
          })
        );
        toast({
          title: 'Items updated',
          description: `${ids.length} item${ids.length === 1 ? '' : 's'} moved`,
        });
        setSelectedIds([]);
      })
      .catch(() => {
        toast({
          title: 'Error updating items',
          description: 'There was a problem updating the selected items',
          variant: 'destructive',
        });
      });
  };

  const handleBatchDelete = () => {
    if (!window.confirm(`Delete ${selectedIds.length} item${selectedIds.length === 1 ? '' : 's'}?`)) return;
    const ids = [...selectedIds];
    Promise.all(ids.map(id => deleteDecorItem(id)))
      .then(() => {
        setItems(prev => prev.filter(i => !ids.includes(i.id.toString())));
        toast({
          title: 'Items deleted',
          description: `${ids.length} item${ids.length === 1 ? '' : 's'} removed`,
        });
        setSelectedIds([]);
      })
      .catch(() => {
        toast({
          title: 'Error deleting items',
          description: 'There was a problem deleting the selected items',
          variant: 'destructive',
        });
      });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <InventoryHeader />

          <main className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">{categoryName} Collection</h2>
              <p className="text-slate-600">Browse and manage your {categoryName} pieces</p>
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
              onDownloadCSV={downloadSelectedCSV}
              onDownloadImages={downloadSelectedImages}
              permanentCategory={categoryId}
            />

            {selectedIds.length > 0 && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-2 bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-100 px-4 py-2 rounded">
                <span className="text-sm font-medium">{selectedIds.length} item{selectedIds.length === 1 ? '' : 's'} selected</span>
                <div className="flex items-center gap-2">
                  <Button variant="link" size="sm" onClick={() => setLocationDialogOpen(true)}>
                    Change Location
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBatchDelete}
                  >
                    Delete
                  </Button>
                  <Button variant="link" size="sm" onClick={() => setSelectedIds([])}>
                    Clear
                  </Button>
                </div>
              </div>
            )}

            <div className="mb-6">
              <p className="text-slate-600">
                Showing {sortedItems.length} {categoryName} pieces
              </p>
            </div>

            {sortedItems.length === 0 ? (
              <EmptyState />
            ) : viewMode === "grid" ? (
              <ItemsGrid
                items={sortedItems}
                onItemClick={setSelectedItem}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
              />
            ) : viewMode === "list" ? (
              <ItemsList
                items={sortedItems}
                onItemClick={setSelectedItem}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
              />
            ) : (
              <ItemsTable
                items={sortedItems}
                onItemClick={setSelectedItem}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
              />
            )}

            <ItemDetailDialog
              item={selectedItem}
              open={!!selectedItem}
              onOpenChange={(open) => !open && setSelectedItem(null)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onHistory={handleHistory}
            />
            <ItemHistoryDialog
              item={historyItem}
              open={!!historyItem}
              onOpenChange={(open) => !open && setHistoryItem(null)}
              onRestore={handleRestore}
            />
            <BatchLocationDialog
              open={locationDialogOpen}
              onOpenChange={setLocationDialogOpen}
              onSubmit={handleBatchLocation}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CategoryPage;
