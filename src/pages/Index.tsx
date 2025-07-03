
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
import { CategoryFilter, StatusFilter, ViewMode, HouseFilter, RoomFilter } from "@/types/inventory";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");
  const [selectedHouse, setSelectedHouse] = useState<HouseFilter>("all");
  const [selectedRoom, setSelectedRoom] = useState<RoomFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [items, setItems] = useState<InventoryItem[]>(sampleItems);

  useEffect(() => {
    fetchInventory()
      .then(data => setItems(data))
      .catch(() => {
        // keep sample data if request fails
      });
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    const matchesHouse = selectedHouse === "all" || item.house === selectedHouse;
    const matchesRoom = selectedRoom === "all" || item.room === selectedRoom;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesHouse && matchesRoom;
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <InventoryHeader />

          <main className="flex-1 p-6">
            <SearchFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedHouse={selectedHouse}
              setSelectedHouse={setSelectedHouse}
              selectedRoom={selectedRoom}
              setSelectedRoom={setSelectedRoom}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />

            <div className="mb-6">
              <p className="text-slate-600">
                {filteredItems.length} items in your collection
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

export default Index;
