
import { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { InventoryHeader } from '@/components/InventoryHeader';
import { Dashboard } from '@/components/Dashboard';
import { ApiNotConfigured } from '@/components/ApiNotConfigured';
import { fetchDecorItems } from '@/lib/api';
import { DecorItem } from '@/types/inventory';
import { useTestDataToggle } from '@/hooks/useTestDataToggle';

const Index = () => {
  const [items, setItems] = useState<DecorItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { useTestData } = useTestDataToggle();

  useEffect(() => {
    setIsLoading(true);
    fetchDecorItems()
      .then((data) => {
        setItems(data);
      })
      .catch(() => {
        setItems([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [useTestData]); // Re-fetch when test data toggle changes

  const isApiConfigured = () => {
    return !!(import.meta.env.VITE_API_URL && import.meta.env.VITE_API_KEY);
  };

  const showEmptyState = !useTestData && !isApiConfigured() && items.length === 0;

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

            {showEmptyState ? (
              <ApiNotConfigured />
            ) : (
              <Dashboard items={items} />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
