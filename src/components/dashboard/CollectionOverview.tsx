
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { InventoryItem } from '@/types/inventory';
import { useSettingsState } from '@/hooks/useSettingsState';
import { formatCurrency, formatNumber, formatDate } from '@/lib/currencyUtils';
import { useCollection } from '@/context/CollectionProvider';
import {
  getCategoryLabel,
  getItemCategory,
  getItemValuationCurrency,
  getItemValuationValue,
  getItemYear,
} from '@/lib/inventoryDisplay';

interface CollectionOverviewProps {
  items: InventoryItem[];
}

export function CollectionOverview({ items }: CollectionOverviewProps) {
  const { categories } = useSettingsState();
  const { collection } = useCollection();

  // Calculate valued/unvalued items
  const valuedItems = items.filter((item) => getItemValuationValue(item) ?? 0 > 0);
  const unvaluedItems = items.filter(
    (item) => (getItemValuationValue(item) ?? 0) <= 0,
  );

  // Top categories by item count
  const categoryStats = categories.map(category => ({
    ...category,
    count: items.filter((item) => getItemCategory(item) === category.id).length,
  })).sort((a, b) => b.count - a.count).slice(0, 3);

  // Latest activity (using acquisition date as proxy)
  const latestItem = items
    .map((item) => {
      if ('acquisitionDate' in item && item.acquisitionDate) {
        return { item, date: item.acquisitionDate };
      }
      if (item.valuationDate) {
        return { item, date: item.valuationDate };
      }
      const year = getItemYear(item);
      return year ? { item, date: `${year}-01-01` } : null;
    })
    .filter((entry): entry is { item: InventoryItem; date: string } => Boolean(entry))
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )[0];

  // Average values per currency
  const averagesByCurrency = valuedItems.reduce((acc, item) => {
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
  }, {} as Record<string, { total: number; count: number }>);

  // Highest valued items (top 3)
  const highestValuedItems = valuedItems
    .map((item) => ({
      item,
      valuation: getItemValuationValue(item) ?? 0,
      currency: getItemValuationCurrency(item),
    }))
    .sort((a, b) => b.valuation - a.valuation)
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Collection Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Items</p>
            <p className="text-2xl font-bold">{formatNumber(items.length)} items</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Valued Items</p>
            <p className="text-2xl font-bold">{formatNumber(valuedItems.length)} / {formatNumber(unvaluedItems.length)}</p>
            <p className="text-xs text-muted-foreground">valued / unvalued</p>
          </div>
        </div>

        {/* Top Categories */}
        {categoryStats.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Top Categories</p>
            <div className="space-y-1">
              {categoryStats.map(category => (
                <div key={category.id} className="flex justify-between text-sm">
                  <span>{category.name}</span>
                  <span>{formatNumber(category.count)} items</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Latest Activity */}
        {latestItem && (
          <div>
            <p className="text-sm font-medium mb-1">Latest Activity</p>
            <p className="text-sm text-muted-foreground">
              Last updated: {formatDate(latestItem.date)}
            </p>
          </div>
        )}

        {/* Average Values per Currency */}
        {Object.keys(averagesByCurrency).length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Average Item Value</p>
            <div className="space-y-1">
              {Object.entries(averagesByCurrency).map(([currency, data]) => (
                <div key={currency} className="flex justify-between text-sm">
                  <span>{currency}:</span>
                  <span>{formatCurrency(data.total / data.count, currency)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Highest Valued Items */}
        {highestValuedItems.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Highest Valued Items</p>
            <div className="space-y-1">
              {highestValuedItems.map(({ item, valuation, currency }) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="truncate flex-1 mr-2">{item.title}</span>
                  <span className="font-medium">
                    {currency ? formatCurrency(valuation, currency) : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
