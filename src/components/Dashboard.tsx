import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DecorItem } from '@/types/inventory';
import { useSettingsState } from '@/hooks/useSettingsState';
import { ValuationSummary } from '@/components/dashboard/ValuationSummary';
import { CollectionOverview } from '@/components/dashboard/CollectionOverview';
import { Palette, Sofa, Package, Home, CalendarClock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatNumber } from '@/lib/currencyUtils';

interface DashboardProps {
  items: DecorItem[];
}

export function Dashboard({ items }: DashboardProps) {
  const { categories, houses } = useSettingsState();

  const counts = items.reduce(
    (acc, item) => {
      acc.categories[item.category] = (acc.categories[item.category] ?? 0) + 1;
      if (item.house) {
        acc.houses[item.house] = (acc.houses[item.house] ?? 0) + 1;
      }
      return acc;
    },
    { categories: {}, houses: {} } as {
      categories: Record<string, number>;
      houses: Record<string, number>;
    },
  );

  // Count items by category using current settings
  const categoryStats = categories
    .filter((c) => c.visible)
    .map((category) => ({
      ...category,
      count: counts.categories[category.id] ?? 0,
    }));

  // Count items by house using current settings
  const houseStats = houses
    .filter((h) => h.visible)
    .map((house) => ({
      ...house,
      count: counts.houses[house.id] ?? 0,
    }));

  const totalItems = items.length;
  const newItemsThisMonth = items.filter((item) => {
    if (!item.acquisitionDate) return false;

    const acquiredDate = new Date(item.acquisitionDate);
    if (Number.isNaN(acquiredDate.getTime())) return false;

    const now = new Date();
    return (
      acquiredDate.getFullYear() === now.getFullYear() &&
      acquiredDate.getMonth() === now.getMonth()
    );
  }).length;

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'art':
        return <Palette className="w-8 h-8 text-dashboard-blue" />;
      case 'furniture':
        return <Sofa className="w-8 h-8 text-dashboard-green" />;
      default:
        return <Package className="w-8 h-8 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* New Items This Month */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New items this month</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatNumber(newItemsThisMonth)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatNumber(totalItems)} total items tracked
                </p>
              </div>
              <CalendarClock className="w-8 h-8 text-dashboard-blue" />
            </div>
          </CardContent>
        </Card>

        {/* Collection Overview */}
        <CollectionOverview items={items} />

        {/* Valuation Summary */}
        <ValuationSummary items={items} />
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryStats.map((category) => (
            <Link
              key={category.id}
              to={`/category/${encodeURIComponent(category.id)}`}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(category.id)}
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(category.count)} items
                        </p>
                      </div>
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

      {/* Houses */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Browse by Location
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {houseStats.map((house) => (
            <Link key={house.id} to={`/house/${encodeURIComponent(house.id)}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Home className="w-8 h-8 text-dashboard-indigo" />
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {house.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(house.count)} items
                        </p>
                      </div>
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
