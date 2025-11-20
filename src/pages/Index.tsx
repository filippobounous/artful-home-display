import { InventoryHeader } from '@/components/InventoryHeader';
import { Dashboard } from '@/components/Dashboard';
import { useQuery } from '@tanstack/react-query';
import { getItemsFetcher, itemsQueryKey } from '@/lib/api/items';
import { SidebarLayout } from '@/components/SidebarLayout';
import { useCollection } from '@/context/CollectionProvider';

const Index = () => {
  const { collection } = useCollection();
  const { data: items = [] } = useQuery({
    queryKey: itemsQueryKey(collection),
    queryFn: getItemsFetcher(collection),
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
