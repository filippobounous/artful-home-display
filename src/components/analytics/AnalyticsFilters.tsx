
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiSelectFilter } from '@/components/MultiSelectFilter';
import { DecorItem } from '@/types/inventory';

interface AnalyticsFiltersProps {
  items: DecorItem[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedHouses: string[];
  setSelectedHouses: (houses: string[]) => void;
  selectedCurrencies: string[];
  setSelectedCurrencies: (currencies: string[]) => void;
}

export function AnalyticsFilters({
  items,
  selectedCategories,
  setSelectedCategories,
  selectedHouses,
  setSelectedHouses,
  selectedCurrencies,
  setSelectedCurrencies,
}: AnalyticsFiltersProps) {
  // Get unique categories
  const categories = Array.from(
    new Set(items.map(item => item.category))
  ).map(category => ({
    id: category,
    name: category.charAt(0).toUpperCase() + category.slice(1),
  }));

  // Get unique houses
  const houses = Array.from(
    new Set(items.map(item => item.house).filter(Boolean))
  ).map(house => ({
    id: house!,
    name: house!.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
  }));

  // Get unique currencies
  const currencies = Array.from(
    new Set(items.map(item => item.valuationCurrency).filter(Boolean))
  ).map(currency => ({
    id: currency!,
    name: currency!,
  }));

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Categories
            </label>
            <MultiSelectFilter
              placeholder="Select categories"
              options={categories}
              selectedValues={selectedCategories}
              onSelectionChange={setSelectedCategories}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Houses
            </label>
            <MultiSelectFilter
              placeholder="Select houses"
              options={houses}
              selectedValues={selectedHouses}
              onSelectionChange={setSelectedHouses}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Currencies
            </label>
            <MultiSelectFilter
              placeholder="Select currencies"
              options={currencies}
              selectedValues={selectedCurrencies}
              onSelectionChange={setSelectedCurrencies}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
