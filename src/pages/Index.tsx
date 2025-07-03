import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { InventoryHeader } from "@/components/InventoryHeader";
import { Dashboard } from "@/components/Dashboard";
import { sampleItems } from "@/data/sampleData";
import { fetchInventory } from "@/lib/api";
import { InventoryItem } from "@/types/inventory";

const Index = () => {
  const [items, setItems] = useState<InventoryItem[]>(sampleItems);

  useEffect(() => {
    fetchInventory()
      .then(data => setItems(data))
      .catch(() => {
        // keep sample data if request fails
      });
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <InventoryHeader />

          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Collection Dashboard</h1>
              <p className="text-slate-600">Overview of your art and furniture collection</p>
            </div>

            <Dashboard items={items} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
