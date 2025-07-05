
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<string[]>(houseId ? [houseId] : []);
  const [selectedRoom, setSelectedRoom] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [items, setItems] = useState<InventoryItem[]>(sampleItems);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const { houses } = useSettingsState();

  useEffect(() => {
    fetchInventory()
      .then(data => setItems(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (houseId) {
      setSelectedHouse([houseId]);
    }
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
    const matchesRoom = selectedRoom.length === 0 || (item.room && selectedRoom.includes(item.room));
    
    return matchesSearch && matchesCategory && matchesSubcategory && matchesHouse && matchesRoom;
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <InventoryHeader />

          <main className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">{houseName}</h2>
              <p className="text-slate-600">Items located in {houseName.toLowerCase()}</p>
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
                Showing {filteredItems.length} items in {houseName.toLowerCase()}
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
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default HousePage;
