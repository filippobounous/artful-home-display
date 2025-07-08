
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { MultiSelectFilter } from "@/components/MultiSelectFilter";
import { sampleItems } from "@/data/sampleData";
import { fetchInventory, deleteInventoryItem, restoreInventoryItem } from "@/lib/api";
import { InventoryItem } from "@/types/inventory";
import { useSettingsState } from "@/hooks/useSettingsState";
import { sortInventoryItems } from "@/lib/sortUtils";
import { useToast } from "@/hooks/use-toast";

type ViewMode = "grid" | "list" | "table";

const AllItems = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string[]>([]); // stores "houseId|roomId"
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [items, setItems] = useState<InventoryItem[]>(sampleItems);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [historyItem, setHistoryItem] = useState<InventoryItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { houses, categories } = useSettingsState();
  const { toast } = useToast();

  const handleEdit = (item: InventoryItem) => {
    localStorage.setItem('editingDraft', JSON.stringify(item));
    navigate(`/add?draftId=${item.id}`);
  };

  const handleDelete = (item: InventoryItem) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    deleteInventoryItem(item.id)
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

  const handleHistory = (item: InventoryItem) => {
    setHistoryItem(item);
  };

  const handleRestore = (version: InventoryItem) => {
    if (!historyItem) return;
    restoreInventoryItem(historyItem.id, version)
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

  useEffect(() => {
    fetchInventory()
      .then(data => setItems(data))
      .catch(() => {});
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.artist && item.artist.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory.length === 0 || selectedCategory.includes(item.category);
    const matchesSubcategory = selectedSubcategory.length === 0 || (item.subcategory && selectedSubcategory.includes(item.subcategory));
    const matchesHouse = selectedHouse.length === 0 || (item.house && selectedHouse.includes(item.house));
    const matchesRoom = selectedRoom.length === 0 || (item.room && selectedRoom.includes(`${item.house}|${item.room}`));

    return matchesSearch && matchesCategory && matchesSubcategory && matchesHouse && matchesRoom;
  });

  // Sort filtered items
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

  const downloadCSV = () => {
    const headers = [
      'ID', 'Title', 'Artist', 'Category', 'Subcategory', 'Size', 'Valuation',
      'Valuation Currency', 'Quantity', 'Year/Period', 'Description', 'Condition',
      'House', 'Room', 'Notes'
    ];

    const csvContent = [
      headers.join(','),
      ...sortedItems.map(item => [
        item.id || '',
        `"${item.title || ''}"`,
        `"${item.artist || ''}"`,
        `"${item.category || ''}"`,
        `"${item.subcategory || ''}"`,
        `"${item.size || ''}"`,
        item.valuation || '',
        `"${item.valuationCurrency || ''}"`,
        item.quantity || '',
        `"${item.yearPeriod || ''}"`,
        `"${item.description || ''}"`,
        `"${item.condition || ''}"`,
        `"${item.house || ''}"`,
        `"${item.room || ''}"`,
        `"${item.notes || ''}"`
      ].join(','))
    ].join('\n');

    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const itemOptions = sortedItems.map(item => ({ id: item.id.toString(), name: item.title, image: item.image }));
  const selectedItems = items.filter(item => selectedIds.includes(item.id.toString()));

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <InventoryHeader />

          <main className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">All Items</h2>
              <p className="text-slate-600">Browse and manage your entire collection</p>
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
              viewMode={viewMode}
              setViewMode={setViewMode}
              onDownloadCSV={downloadCSV}
            />

            <div className="max-w-md mb-6">
              <MultiSelectFilter
                placeholder="Select items"
                options={itemOptions}
                selectedValues={selectedIds}
                onSelectionChange={setSelectedIds}
              />
            </div>

            {selectedItems.length > 0 && (
              <div className="mb-6 space-y-2">
                <h3 className="font-medium text-slate-700">Selected Items</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedItems.map(item => (
                    <li key={item.id}>{item.title}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-6">
              <p className="text-slate-600">
                Showing {sortedItems.length} of {items.length} items
              </p>
            </div>

            {sortedItems.length === 0 ? (
              <EmptyState />
            ) : viewMode === "grid" ? (
              <ItemsGrid items={sortedItems} onItemClick={setSelectedItem} />
            ) : viewMode === "list" ? (
              <ItemsList items={sortedItems} onItemClick={setSelectedItem} />
            ) : (
              <ItemsTable 
                items={sortedItems} 
                onItemClick={setSelectedItem}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
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
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AllItems;
