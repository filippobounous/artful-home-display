
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { InventoryItem } from '@/types/inventory';
import { formatCurrency, formatNumber } from '@/lib/currencyUtils';
import { getItemValuationCurrency, getItemValuationValue } from '@/lib/inventoryDisplay';

interface StatisticsTableProps {
  items: InventoryItem[];
}

interface CurrencyStats {
  min: number;
  max: number;
  mean: number;
  median: number;
  stdDev: number;
  p25: number;
  p75: number;
  p90: number;
  count: number;
}

export function StatisticsTable({ items }: StatisticsTableProps) {
  // Group items by currency and calculate statistics
  const statsByCurrency = items.reduce((acc, item) => {
    const valuation = getItemValuationValue(item);
    const currency = getItemValuationCurrency(item);
    if (valuation && valuation > 0 && currency) {
      if (!acc[currency]) {
        acc[currency] = [];
      }
      acc[currency].push(valuation);
    }
    return acc;
  }, {} as Record<string, number[]>);

  const calculateStats = (values: number[]): CurrencyStats => {
    if (values.length === 0) {
      return { min: 0, max: 0, mean: 0, median: 0, stdDev: 0, p25: 0, p75: 0, p90: 0, count: 0 };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / count;
    
    // Calculate percentiles
    const getPercentile = (p: number) => {
      const index = (p / 100) * (count - 1);
      if (Number.isInteger(index)) {
        return sorted[index];
      }
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      const weight = index - lower;
      return sorted[lower] * (1 - weight) + sorted[upper] * weight;
    };

    const median = getPercentile(50);
    const p25 = getPercentile(25);
    const p75 = getPercentile(75);
    const p90 = getPercentile(90);

    // Calculate standard deviation
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      mean,
      median,
      stdDev,
      p25,
      p75,
      p90,
      count,
    };
  };

  const currencyStats = Object.entries(statsByCurrency).map(([currency, values]) => ({
    currency,
    stats: calculateStats(values),
  }));

  if (currencyStats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Valuation Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Not enough data to compute statistics</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valuation Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {currencyStats.map(({ currency, stats }) => (
            <div key={currency}>
              <h4 className="font-semibold mb-3">
                {currency} ({formatNumber(stats.count)} items)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Minimum</p>
                  <p className="font-medium">{formatCurrency(stats.min, currency)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Maximum</p>
                  <p className="font-medium">{formatCurrency(stats.max, currency)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Mean</p>
                  <p className="font-medium">{formatCurrency(stats.mean, currency)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Median</p>
                  <p className="font-medium">{formatCurrency(stats.median, currency)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">25th Percentile</p>
                  <p className="font-medium">{formatCurrency(stats.p25, currency)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">75th Percentile</p>
                  <p className="font-medium">{formatCurrency(stats.p75, currency)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">90th Percentile</p>
                  <p className="font-medium">{formatCurrency(stats.p90, currency)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Std Deviation</p>
                  <p className="font-medium">{formatCurrency(stats.stdDev, currency)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
