import { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { InventoryHeader } from '@/components/InventoryHeader';
import { Dashboard } from '@/components/Dashboard';
import { fetchDecorItems } from '@/lib/api';
import { DecorItem } from '@/types/inventory';

const Index = () => {
  const [items, setItems] = useState<DecorItem[]>([]);

  useEffect(() => {
    fetchDecorItems()
      .then((data) => setItems(data))
      .catch(() => {
        setItems([]);
      });
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <InventoryHeader />

          <main className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Collection Dashboard
              </h2>
              <p className="text-muted-foreground">
                Overview of your art and furniture collection
              </p>
            </div>

            <Dashboard items={items} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
