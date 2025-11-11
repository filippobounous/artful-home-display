import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { InventoryItem } from '@/types/inventory';
import { useSettingsState } from '@/hooks/useSettingsState';
import { ValuationSummary } from '@/components/dashboard/ValuationSummary';
import { CollectionOverview } from '@/components/dashboard/CollectionOverview';
import { Palette, BookOpen, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatNumber } from '@/lib/currencyUtils';
import { useCollection } from '@/context/CollectionProvider';
import {
  getCategoryLabel,
  getItemCategory,
} from '@/lib/inventoryDisplay';

interface DashboardProps {
  items: InventoryItem[];
}

const collectionIcons: Record<'art' | 'books' | 'music', React.ReactNode> = {
  art: <Palette className="w-8 h-8 text-dashboard-blue" />,
  books: <BookOpen className="w-8 h-8 text-dashboard-green" />,
  music: <Music className="w-8 h-8 text-dashboard-indigo" />,
};

export function Dashboard({ items }: DashboardProps) {
  const { categories, houses } = useSettingsState();
  const { collection } = useCollection();

  const categoryCounts = items.reduce<Record<string, number>>((acc, item) => {
    const category = getItemCategory(item);
    if (!category) return acc;
    acc[category] = (acc[category] ?? 0) + 1;
    return acc;
  }, {});

  const houseCounts = items.reduce<Record<string, number>>((acc, item) => {
    const houseId = item.house ?? 'unassigned';
    acc[houseId] = (acc[houseId] ?? 0) + 1;
    return acc;
  }, {});

  const visibleCategories = categories
    .filter((c) => c.visible)
    .map((category) => ({
      ...category,
      count: categoryCounts[category.id] ?? 0,
    }));

  const visibleHouses = houses
    .filter((h) => h.visible)
    .map((house) => ({
      ...house,
      count: houseCounts[house.id] ?? 0,
    }));

  const totalItems = items.length;
  const categoryLabel = getCategoryLabel(collection);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatNumber(totalItems)}
                </p>
              </div>
              {collectionIcons[collection]}
            </div>
          </CardContent>
        </Card>

        <CollectionOverview items={items} />
        <ValuationSummary items={items} />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Browse by {categoryLabel}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleCategories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${encodeURIComponent(category.id)}`}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatNumber(category.count)} items
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {formatNumber(category.count)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Browse by Location
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleHouses.map((house) => (
            <Link key={house.id} to={`/house/${encodeURIComponent(house.id)}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{house.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatNumber(house.count)} items
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {formatNumber(house.count)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
