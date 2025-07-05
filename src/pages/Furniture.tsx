
import { useEffect, useState } from "react";
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

type ViewMode = "grid" | "list" | "table";

const Furniture = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>(["furniture"]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [items, setItems] = useState<InventoryItem[]>(sampleItems);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const yearOptions = Array.from(new Set(items.map(i => i.yearPeriod).filter(Boolean))) as string[];

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
    const matchesSubcategory = selectedSubcategory.length === 0 || (item.subcategory && selectedSubcategory.includes(item.subcategory));
    const matchesHouse = selectedHouse.length === 0 || (item.house && selectedHouse.includes(item.house));
    const matchesRoom = selectedRoom.length === 0 || (item.room && selectedRoom.includes(item.room));
    const matchesCondition = selectedCondition.length === 0 || selectedCondition.includes(item.condition);
    const matchesYear = selectedYear.length === 0 || (item.yearPeriod && selectedYear.includes(item.yearPeriod));

    return matchesSearch && matchesCategory && matchesSubcategory && matchesHouse && matchesRoom && matchesCondition && matchesYear;
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
              selectedSubcategory={selectedSubcategory}
              setSelectedSubcategory={setSelectedSubcategory}
              selectedHouse={selectedHouse}
              setSelectedHouse={setSelectedHouse}
              selectedRoom={selectedRoom}
              setSelectedRoom={setSelectedRoom}
              selectedCondition={selectedCondition}
              setSelectedCondition={setSelectedCondition}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              yearOptions={yearOptions}
              viewMode={viewMode}
              setViewMode={setViewMode}
              permanentCategory="furniture"
            />

            <div className="mb-6">
              <p className="text-slate-600">
                Showing {filteredItems.length} furniture pieces
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

export default Furniture;
