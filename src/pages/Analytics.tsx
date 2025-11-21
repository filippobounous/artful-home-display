import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { fetchDecorItems } from '@/lib/api';
import { DecorItem } from '@/types/inventory';
import { StatisticsTable } from '@/components/analytics/StatisticsTable';
import { formatCurrency, formatNumber } from '@/lib/currencyUtils';
import { AnalyticsFilters } from '@/components/analytics/AnalyticsFilters';
import { SidebarLayout } from '@/components/SidebarLayout';

interface TooltipProps {
  active?: boolean;
  payload?: {
    payload: { value?: number; currency?: string; count?: number };
  }[];
  label?: string;
}

const Analytics = () => {
  const [items, setItems] = useState<DecorItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<DecorItem[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedHouses, setSelectedHouses] = useState<string[]>([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const categoriesParam = searchParams.get('categories');
    const housesParam = searchParams.get('houses');
    const currenciesParam = searchParams.get('currencies');

    if (categoriesParam) {
      setSelectedCategories(categoriesParam.split(',').filter(Boolean));
    }
    if (housesParam) {
      setSelectedHouses(housesParam.split(',').filter(Boolean));
    }
    if (currenciesParam) {
      setSelectedCurrencies(currenciesParam.split(',').filter(Boolean));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchDecorItems()
      .then((data) => {
        const activeItems = data.filter((item) => !item.deleted);
        setItems(activeItems);
        setFilteredItems(activeItems);
      })
      .catch(() => {
        setItems([]);
        setFilteredItems([]);
      });
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...items];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.category),
      );
    }

    if (selectedHouses.length > 0) {
      filtered = filtered.filter(
        (item) => item.house && selectedHouses.includes(item.house),
      );
    }

    if (selectedCurrencies.length > 0) {
      filtered = filtered.filter(
        (item) =>
          item.valuationCurrency &&
          selectedCurrencies.includes(item.valuationCurrency),
      );
    }

    setFilteredItems(filtered);
  }, [items, selectedCategories, selectedHouses, selectedCurrencies]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','));
    }
    if (selectedHouses.length > 0) {
      params.set('houses', selectedHouses.join(','));
    }
    if (selectedCurrencies.length > 0) {
      params.set('currencies', selectedCurrencies.join(','));
    }
    setSearchParams(params, { replace: true });
  }, [selectedCategories, selectedHouses, selectedCurrencies, setSearchParams]);

  // Basic statistics
  const totalItems = filteredItems.length;
  const valuedItems = filteredItems.filter(
    (item) => item.valuation && item.valuation > 0,
  );

  // Group valuations by currency
  const valuationsByCurrency = valuedItems.reduce(
    (acc, item) => {
      if (item.valuation && item.valuationCurrency) {
        const currency = item.valuationCurrency;
        if (!acc[currency]) {
          acc[currency] = { total: 0, count: 0 };
        }
        acc[currency].total += item.valuation;
        acc[currency].count += 1;
      }
      return acc;
    },
    {} as Record<string, { total: number; count: number }>,
  );

  // Items by category
  const categoryData = filteredItems.reduce(
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
  const houseData = filteredItems.reduce(
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

  // Valuation by category (grouped by currency)
  const valuationByCategory = filteredItems.reduce(
    (acc, item) => {
      if (item.valuation && item.valuationCurrency) {
        const key = `${item.category}-${item.valuationCurrency}`;
        if (!acc[key]) {
          acc[key] = {
            category:
              item.category.charAt(0).toUpperCase() + item.category.slice(1),
            currency: item.valuationCurrency,
            value: 0,
          };
        }
        acc[key].value += item.valuation;
      }
      return acc;
    },
    {} as Record<string, { category: string; currency: string; value: number }>,
  );

  const valuationChartData = Object.values(valuationByCategory);

  const COLORS = [
    'hsl(208, 100%, 49.8%)',
    'hsl(169, 100%, 38.4%)',
    'hsl(41, 100%, 57.8%)',
    'hsl(20, 100%, 62.9%)',
    'hsl(243, 51.9%, 68.2%)',
  ];

  const customTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      if (data.value !== undefined) {
        return (
          <div className="bg-background border rounded-lg p-3 shadow-md">
            <p className="font-medium">{label}</p>
            <p className="text-primary">
              Value: {formatCurrency(data.value, data.currency)}
            </p>
          </div>
        );
      }
      if (data.count !== undefined) {
        return (
          <div className="bg-background border rounded-lg p-3 shadow-md">
            <p className="font-medium">{label}</p>
            <p className="text-primary">
              Count: {formatNumber(data.count)} items
            </p>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <SidebarLayout>
      <InventoryHeader />

      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Analytics
          </h1>
        </div>

        {/* Analytics Filters */}
        <AnalyticsFilters
          items={items}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedHouses={selectedHouses}
          setSelectedHouses={setSelectedHouses}
          selectedCurrencies={selectedCurrencies}
          setSelectedCurrencies={setSelectedCurrencies}
        />

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(totalItems)} items
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valued Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(valuedItems.length)} items
              </div>
              <p className="text-sm text-muted-foreground">
                {totalItems > 0
                  ? formatNumber((valuedItems.length / totalItems) * 100, 1)
                  : 0}
                % of collection
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Currencies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.keys(valuationsByCurrency).length}
              </div>
              <p className="text-sm text-muted-foreground">
                {Object.keys(valuationsByCurrency).join(', ') || 'None'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.keys(categoryData).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Valuation Summary by Currency */}
        {Object.keys(valuationsByCurrency).length > 0 && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Total Valuations by Currency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(valuationsByCurrency).map(
                    ([currency, data]) => (
                      <div
                        key={currency}
                        className="text-center p-4 border rounded-lg"
                      >
                        <div className="text-2xl font-bold">
                          {formatCurrency(data.total, currency)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(data.count)} items in {currency}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
                  <YAxis
                    label={{
                      value: 'Items',
                      angle: -90,
                      position: 'insideLeft',
                    }}
                  />
                  <Tooltip content={customTooltip} />
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
                      `${house} (${(percent * 100).toFixed(1)}%)`
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
                  <Tooltip content={customTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {valuationChartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Valuation by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={valuationChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis
                      label={{
                        value: 'Value',
                        angle: -90,
                        position: 'insideLeft',
                      }}
                    />
                    <Tooltip content={customTooltip} />
                    <Bar dataKey="value" fill="hsl(160, 84.1%, 39.4%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Statistics Table */}
        <StatisticsTable items={filteredItems} />
      </main>
    </SidebarLayout>
  );
};

export default Analytics;
