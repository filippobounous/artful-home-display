import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
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

  useEffect(() => {
    fetchDecorItems()
      .then((data) => {
        setItems(data);
        setFilteredItems(data);
      })
      .catch(() => {
        setItems([]);
        setFilteredItems([]);
      });
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = items;

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
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Collection Analytics
          </h2>
          <p className="text-muted-foreground">
            Comprehensive overview of your collection statistics
          </p>
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
                Total Valuation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalValuation, baseCurrency)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Valuation Distribution */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Valuation Distribution by Currency
          </h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={Object.entries(valuationsByCurrency).map(
                  ([currency, total]) => ({ currency, total }),
                )}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="currency" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip
                  content={({ active, payload, label }: TooltipProps) => {
                    if (active && payload && payload.length) {
                      const value = payload[0]?.payload?.value;
                      const currency = payload[0]?.payload?.currency;
                      return (
                        <div className="bg-background p-2 rounded shadow text-foreground">
                          <p className="font-medium">
                            {label}: {formatCurrency(value || 0, currency)}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Items: {payload[0]?.payload?.count}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="total" fill="hsl(var(--dashboard-blue))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Items by Category
          </h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(itemsByCategory).map(
                    ([category, count]) => ({ name: category, value: count }),
                  )}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {Object.keys(itemsByCategory).map((category, index) => (
                    <Cell
                      key={`cell-${category}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }: TooltipProps) => {
                    if (active && payload && payload.length) {
                      const value = payload[0]?.value;
                      const name = payload[0]?.name;
                      const percent = payload[0]?.payload?.percent || 0;
                      return (
                        <div className="bg-background p-2 rounded shadow text-foreground">
                          <p className="font-medium">
                            {name}: {formatNumber(value || 0)} items
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {formatNumber(percent * 100, 1)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Statistics Table */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">
            Detailed Statistics
          </h3>
          <StatisticsTable
            items={filteredItems}
            selectedCategories={selectedCategories}
            selectedHouses={selectedHouses}
            selectedCurrencies={selectedCurrencies}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;
