
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { InventoryHeader } from "@/components/InventoryHeader";
import { SearchFilters } from "@/components/SearchFilters";
import { ItemsGrid } from "@/components/ItemsGrid";
import { ItemsList } from "@/components/ItemsList";
import { EmptyState } from "@/components/EmptyState";
import { sampleItems } from "@/data/sampleData";
import { fetchInventory } from "@/lib/api";
import { InventoryItem } from "@/types/inventory";
import { CategoryFilter, ViewMode, HouseFilter, RoomFilter } from "@/types/inventory";

const Furniture = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("furniture");
  const [selectedHouse, setSelectedHouse] = useState<HouseFilter>("all");
  const [selectedRoom, setSelectedRoom] = useState<RoomFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [items, setItems] = useState<InventoryItem[]>(sampleItems);

  useEffect(() => {
    fetchInventory()
      .then(data => setItems(data))
      .catch(() => {});
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.artist && item.artist.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = item.category === "furniture";
    const matchesHouse = selectedHouse === "all" || item.house === selectedHouse;
    const matchesRoom = selectedRoom === "all" || item.room === selectedRoom;
    
    return matchesSearch && matchesCategory && matchesHouse && matchesRoom;
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <InventoryHeader />

          <main className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Furniture Collection</h2>
              <p className="text-slate-600">Browse and manage your furniture pieces</p>
            </div>

            <SearchFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedHouse={selectedHouse}
              setSelectedHouse={setSelectedHouse}
              selectedRoom={selectedRoom}
              setSelectedRoom={setSelectedRoom}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />

            <div className="mb-6">
              <p className="text-slate-600">
                Showing {filteredItems.length} furniture pieces
              </p>
            </div>

            {filteredItems.length === 0 ? (
              <EmptyState />
            ) : viewMode === "grid" ? (
              <ItemsGrid items={filteredItems} />
            ) : (
              <ItemsList items={filteredItems} />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Furniture;
