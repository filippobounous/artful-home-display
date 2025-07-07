
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
import { EmptyState } from "@/components/EmptyState";
import { sampleItems } from "@/data/sampleData";
import { fetchInventory } from "@/lib/api";
import { InventoryItem } from "@/types/inventory";
import { useSettingsState } from "@/hooks/useSettingsState";

type ViewMode = "grid" | "list" | "table";

const HousePage = () => {
  const { houseId } = useParams<{ houseId: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<string[]>(houseId ? [houseId] : []);
  const [selectedRoom, setSelectedRoom] = useState<string[]>([]); // stores "houseId|roomId"
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [items, setItems] = useState<InventoryItem[]>(sampleItems);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const { houses } = useSettingsState();

  const handleEdit = (item: InventoryItem) => {
    localStorage.setItem('editingDraft', JSON.stringify(item));
    navigate(`/add?draftId=${item.id}`);
  };

  useEffect(() => {
    fetchInventory()
      .then(data => setItems(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (houseId) {
      setSelectedHouse([houseId]);
    }
    // Reset other filters when navigating between houses
    setSelectedCategory([]);
    setSelectedSubcategory([]);
    setSelectedRoom([]);
    setSearchTerm("");
  }, [houseId]);

  const houseConfig = houses.find(h => h.id === houseId);
  const houseName = houseConfig?.name || "Unknown House";

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.artist && item.artist.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory.length === 0 || selectedCategory.includes(item.category);
    const matchesSubcategory = selectedSubcategory.length === 0 || (item.subcategory && selectedSubcategory.includes(item.subcategory));
    const matchesHouse = item.house === houseId;
    const matchesRoom = selectedRoom.length === 0 || (item.room && selectedRoom.includes(`${item.house}|${item.room}`));

    return matchesSearch && matchesCategory && matchesSubcategory && matchesHouse && matchesRoom;
  });

  const downloadCSV = () => {
    const headers = [
      'ID', 'Title', 'Artist', 'Category', 'Subcategory', 'Size', 'Valuation',
      'Valuation Currency', 'Quantity', 'Year/Period', 'Description', 'Condition',
      'House', 'Room', 'Notes'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredItems.map(item => [
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <InventoryHeader />

          <main className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">{houseName}</h2>
              <p className="text-slate-600">Items located in {houseName}</p>
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
              permanentHouse={houseId}
            />

            <div className="mb-6">
              <p className="text-slate-600">
                Showing {filteredItems.length} items in {houseName}
              </p>
            </div>

            {filteredItems.length === 0 ? (
              <EmptyState />
            ) : viewMode === "grid" ? (
              <ItemsGrid items={filteredItems} onItemClick={setSelectedItem} />
            ) : viewMode === "list" ? (
              <ItemsList items={filteredItems} onItemClick={setSelectedItem} />
            ) : (
              <ItemsTable items={filteredItems} onItemClick={setSelectedItem} />
            )}

            <ItemDetailDialog
              item={selectedItem}
              open={!!selectedItem}
              onOpenChange={(open) => !open && setSelectedItem(null)}
              onEdit={handleEdit}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default HousePage;
