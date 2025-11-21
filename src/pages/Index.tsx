import { InventoryHeader } from '@/components/InventoryHeader';
import { Dashboard } from '@/components/Dashboard';
import { useQuery } from '@tanstack/react-query';
import { fetchDecorItems } from '@/lib/api/items';
import { SidebarLayout } from '@/components/SidebarLayout';
import { Badge } from '@/components/ui/badge';
import { Home } from 'lucide-react';

const Index = () => {
  const { data: items = [] } = useQuery({
    queryKey: ['decor-items'],
    queryFn: fetchDecorItems,
  });

  const activeItems = items.filter((item) => !item.deleted);

  return (
    <SidebarLayout>
      <InventoryHeader />
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Overview
          </h1>
          <Badge variant="secondary" className="ml-2">
            {activeItems.length}
          </Badge>
        </div>
        <Dashboard items={activeItems} />
      </main>
    </SidebarLayout>
  );
};

export default Index;
