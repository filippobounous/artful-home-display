import { AppSidebar } from '@/components/AppSidebar';
import { InventoryHeader } from '@/components/InventoryHeader';
import { Dashboard } from '@/components/Dashboard';
import { useQuery } from '@tanstack/react-query';
import { fetchDecorItems } from '@/lib/api/items';

const Index = () => {
  const { data: items = [] } = useQuery({
    queryKey: ['decor-items'],
    queryFn: fetchDecorItems,
  });

  const activeItems = items.filter((item) => !item.deleted);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        <InventoryHeader />

        <main className="flex-1 p-4 md:p-8 pt-6">
          <Dashboard items={activeItems} />
        </main>
      </div>
    </div>
  );
};

export default Index;
