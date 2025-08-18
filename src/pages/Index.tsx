import { AppLayout } from '@/components/AppLayout';
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
    <AppLayout>
      <Dashboard items={activeItems} />
    </AppLayout>
  );
};

export default Index;
