import { InventoryHeader } from '@/components/InventoryHeader';
import { Dashboard } from '@/components/Dashboard';
import { useQuery } from '@tanstack/react-query';
import { fetchDecorItems } from '@/lib/api/items';
import { SidebarLayout } from '@/components/SidebarLayout';

const Index = () => {
  const { data: items = [] } = useQuery({
    queryKey: ['decor-items'],
    queryFn: fetchDecorItems,
  });

  const activeItems = items.filter((item) => !item.deleted);

  return (
    <SidebarLayout>
      <InventoryHeader />
      <main className="flex-1 p-4 md:p-8 pt-6">
        <Dashboard items={activeItems} />
      </main>
    </SidebarLayout>
  );
};

export default Index;
