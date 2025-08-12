
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DecorItem } from '@/types/inventory';
import { formatCurrency } from '@/lib/currencyUtils';

interface ValuationSummaryProps {
  items: DecorItem[];
}

export function ValuationSummary({ items }: ValuationSummaryProps) {
  // Group valuations by currency
  const valuationsByCurrency = items.reduce((acc, item) => {
    if (item.valuation && item.valuationCurrency) {
      const currency = item.valuationCurrency;
      if (!acc[currency]) {
        acc[currency] = { total: 0, count: 0 };
      }
      acc[currency].total += item.valuation;
      acc[currency].count += 1;
    }
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const totalItems = items.length;
  const valuedItems = Object.values(valuationsByCurrency).reduce((sum, curr) => sum + curr.count, 0);
  const unvaluedItems = totalItems - valuedItems;

  const currencyEntries = Object.entries(valuationsByCurrency);

  if (currencyEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Valuation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No valuations available</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Valued items:</span>
              <span>0</span>
            </div>
            <div className="flex justify-between">
              <span>Unvalued items:</span>
              <span>{unvaluedItems}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valuation Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {currencyEntries.map(([currency, data]) => (
            <div key={currency} className="flex justify-between items-center">
              <span className="font-medium">{currency}:</span>
              <span className="text-lg font-semibold">
                {formatCurrency(data.total, currency)}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t space-y-2">
          <div className="flex justify-between">
            <span>Valued items:</span>
            <span className="font-medium">{valuedItems} items</span>
          </div>
          <div className="flex justify-between">
            <span>Unvalued items:</span>
            <span className="font-medium">{unvaluedItems} items</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
