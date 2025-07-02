
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { InventoryHeader } from "@/components/InventoryHeader";
import { SearchFilters } from "@/components/SearchFilters";
import { ItemsGrid } from "@/components/ItemsGrid";
import { ItemsList } from "@/components/ItemsList";
import { EmptyState } from "@/components/EmptyState";
import { sampleItems } from "@/data/sampleData";
import { CategoryFilter, StatusFilter, ViewMode } from "@/types/inventory";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filteredItems = sampleItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
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
              viewMode={viewMode}
              setViewMode={setViewMode}
            />

            <div className="mb-6">
              <p className="text-slate-600">
                Showing {filteredItems.length} of {sampleItems.length} items
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
