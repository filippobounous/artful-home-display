import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DecorItem } from '@/types/inventory';
import { useSettingsState } from '@/hooks/useSettingsState';
import { Palette, Sofa, Package, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  items: DecorItem[];
}

export function Dashboard({ items }: DashboardProps) {
  const { categories, houses } = useSettingsState();

  // Count items by category using current settings
  const categoryStats = categories
    .filter((c) => c.visible)
    .map((category) => ({
      ...category,
      count: items.filter((item) => item.category === category.id).length,
    }));

  // Count items by house using current settings
  const houseStats = houses
    .filter((h) => h.visible)
    .map((house) => ({
      ...house,
      count: items.filter((item) => item.house === house.id).length,
    }));

  const totalItems = items.length;
  const totalValuation = items.reduce(
    (sum, item) => sum + (item.valuation || 0),
    0,
  );

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'art':
        return <Palette className="w-8 h-8 text-blue-600" />;
      case 'furniture':
        return <Sofa className="w-8 h-8 text-green-600" />;
      default:
        return <Package className="w-8 h-8 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold text-foreground">
                  {totalItems}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Valuation</p>
                <p className="text-2xl font-bold text-foreground">
                  ${totalValuation.toLocaleString()}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold">$</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold text-foreground">
                  {categories.filter((c) => c.visible).length}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-bold">#</span>
              </div>
            </div>
          </CardContent>
        </Card>
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
                          {category.count} items
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{category.count}</Badge>
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
                      <Home className="w-8 h-8 text-indigo-600" />
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {house.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {house.count} items
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{house.count}</Badge>
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
