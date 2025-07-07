
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
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
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

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortField) return 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let aValue: any = a[sortField as keyof InventoryItem];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let bValue: any = b[sortField as keyof InventoryItem];

    if (sortField === 'valuation') {
      aValue = Number(aValue) || 0;
      bValue = Number(bValue) || 0;
    } else {
      aValue = String(aValue || '').toLowerCase();
      bValue = String(bValue || '').toLowerCase();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: string, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
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
              permanentHouse={houseId}
            />

            <div className="mb-6">
              <p className="text-slate-600">
                Showing {sortedItems.length} items in {houseName}
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
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default HousePage;
