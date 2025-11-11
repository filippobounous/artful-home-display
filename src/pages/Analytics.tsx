import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
import { AnalyticsFilters } from '@/components/analytics/AnalyticsFilters';
import { SidebarLayout } from '@/components/SidebarLayout';
import { StatisticsTable } from '@/components/analytics/StatisticsTable';
import {
  getItemsFetcher,
  itemsQueryKey,
} from '@/lib/api/items';
import type { InventoryItem } from '@/types/inventory';
import { useCollection } from '@/context/CollectionProvider';
import {
  getCategoryLabel,
  getItemCategory,
  getItemValuationCurrency,
  getItemValuationValue,
} from '@/lib/inventoryDisplay';
import { formatCurrency, formatNumber } from '@/lib/currencyUtils';

interface TooltipProps {
  active?: boolean;
  payload?: {
    payload: { value?: number; currency?: string; count?: number };
  }[];
  label?: string;
}

const COLORS = [
  'hsl(208, 100%, 49.8%)',
  'hsl(169, 100%, 38.4%)',
  'hsl(41, 100%, 57.8%)',
  'hsl(20, 100%, 62.9%)',
  'hsl(243, 51.9%, 68.2%)',
];

const Analytics = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedHouses, setSelectedHouses] = useState<string[]>([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { collection } = useCollection();
  const categoryLabel = getCategoryLabel(collection);

  const fetchItems = useMemo(() => getItemsFetcher(collection), [collection]);

  const { data: items = [] } = useQuery({
    queryKey: itemsQueryKey(collection),
    queryFn: fetchItems,
  });

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

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategories.length > 0) {
        const category = getItemCategory(item);
        if (!category || !selectedCategories.includes(category)) {
          return false;
        }
      }
      if (selectedHouses.length > 0) {
        if (!item.house || !selectedHouses.includes(item.house)) {
          return false;
        }
      }
      if (selectedCurrencies.length > 0) {
        const currency = getItemValuationCurrency(item);
        if (!currency || !selectedCurrencies.includes(currency)) {
          return false;
        }
      }
      return true;
    });
  }, [items, selectedCategories, selectedHouses, selectedCurrencies]);

  const totalItems = filteredItems.length;
  const valuedItems = filteredItems.filter(
    (item) => (getItemValuationValue(item) ?? 0) > 0,
  );

  const valuationsByCurrency = valuedItems.reduce(
    (acc, item) => {
      const valuation = getItemValuationValue(item);
      const currency = getItemValuationCurrency(item);
      if (valuation !== undefined && currency) {
        if (!acc[currency]) {
          acc[currency] = { total: 0, count: 0 };
        }
        acc[currency].total += valuation;
        acc[currency].count += 1;
      }
      return acc;
    },
    {} as Record<string, { total: number; count: number }>,
  );

  const categoryData = filteredItems.reduce(
    (acc, item) => {
      const category = getItemCategory(item) ?? 'Unassigned';
      acc[category] = (acc[category] || 0) + 1;
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

  const valuationByCategory = filteredItems.reduce(
    (acc, item) => {
      const valuation = getItemValuationValue(item);
      const currency = getItemValuationCurrency(item);
      const category = getItemCategory(item) ?? 'Unassigned';
      if (valuation !== undefined && currency) {
        const key = `${category}-${currency}`;
        if (!acc[key]) {
          acc[key] = { category, currency, value: 0 };
        }
        acc[key].value += valuation;
      }
      return acc;
    },
    {} as Record<string, { category: string; currency: string; value: number }>,
  );

  const valuationChartData = Object.values(valuationByCategory);

  const customTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      if (data.value !== undefined) {
        return (
          <div className="bg-background border rounded-lg p-3 shadow-md">
            <p className="font-medium">{label}</p>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(data.value, data.currency)}
            </p>
          </div>
        );
      }
      if (data.count !== undefined) {
        return (
          <div className="bg-background border rounded-lg p-3 shadow-md">
            <p className="font-medium">{label}</p>
            <p className="text-sm text-muted-foreground">{data.count} items</p>
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
            Collection Analytics
          </h1>
          <p className="text-muted-foreground">
            Explore insights across your {collection} collection.
          </p>
        </div>

        <AnalyticsFilters
          items={items}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedHouses={selectedHouses}
          setSelectedHouses={setSelectedHouses}
          selectedCurrencies={selectedCurrencies}
          setSelectedCurrencies={setSelectedCurrencies}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatNumber(totalItems)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Valued Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatNumber(valuedItems.length)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Valuation Currencies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {formatNumber(Object.keys(valuationsByCurrency).length)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{categoryLabel} Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={customTooltip} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Items by House</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={houseChartData} dataKey="count" nameKey="house" fill="hsl(var(--secondary))" label>
                    {houseChartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={customTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Valuation by {categoryLabel}</CardTitle>
          </CardHeader>
          <CardContent className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={valuationChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  tickFormatter={(value) =>
                    value.charAt(0).toUpperCase() + value.slice(1)
                  }
                />
                <YAxis tickFormatter={(value) => formatNumber(value)} />
                <Tooltip content={customTooltip} />
                <Bar dataKey="value">
                  {valuationChartData.map((entry, index) => (
                    <Cell
                      key={`${entry.category}-${entry.currency}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <StatisticsTable items={filteredItems} />
      </main>
    </SidebarLayout>
  );
};

export default Analytics;
