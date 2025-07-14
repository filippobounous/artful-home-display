import { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { InventoryHeader } from '@/components/InventoryHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { sampleDecorItems } from '@/data/sampleData';
import { fetchDecorItems } from '@/lib/api';
import { DecorItem } from '@/types/inventory';

const Analytics = () => {
  const [items, setItems] = useState<DecorItem[]>(sampleDecorItems);

  useEffect(() => {
    fetchDecorItems()
      .then((data) => setItems(data))
      .catch(() => {});
  }, []);

  // Basic statistics
  const totalItems = items.length;
  const totalValuation = items.reduce(
    (sum, item) => sum + (item.valuation || 0),
    0,
  );
  const avgValuation = totalItems > 0 ? totalValuation / totalItems : 0;
  const artItems = items.filter((item) => item.category === 'art').length;
  const furnitureItems = items.filter(
    (item) => item.category === 'furniture',
  ).length;

  // Items by category
  const categoryData = items.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const categoryChartData = Object.entries(categoryData).map(
    ([category, count]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      count,
    }),
  );

  // Items by house
  const houseData = items.reduce(
    (acc, item) => {
      const house = item.house || 'Unassigned';
      acc[house] = (acc[house] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const houseChartData = Object.entries(houseData).map(([house, count]) => ({
    house: house.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    count,
  }));

  // Valuation by category
  const valuationByCategory = items.reduce(
    (acc, item) => {
      if (item.valuation) {
        acc[item.category] = (acc[item.category] || 0) + item.valuation;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const valuationChartData = Object.entries(valuationByCategory).map(
    ([category, value]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      value,
    }),
  );

  const COLORS = [
    'hsl(208, 100%, 49.8%)',
    'hsl(169, 100%, 38.4%)',
    'hsl(41, 100%, 57.8%)',
    'hsl(20, 100%, 62.9%)',
    'hsl(243, 51.9%, 68.2%)',
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <InventoryHeader />

          <main className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Collection Analytics
              </h2>
              <p className="text-muted-foreground">
                Comprehensive overview of your collection statistics
              </p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalItems}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Valuation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${totalValuation.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Average Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${Math.round(avgValuation).toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Art Pieces
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {artItems}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Items by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--sidebar-ring))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Items by House</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={houseChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ house, percent }) =>
                          `${house} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={80}
                        fill="hsl(243, 51.9%, 68.2%)"
                        dataKey="count"
                      >
                        {houseChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Valuation by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={valuationChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [
                          `$${value.toLocaleString()}`,
                          'Value',
                        ]}
                      />
                      <Bar dataKey="value" fill="hsl(160, 84.1%, 39.4%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Analytics;
