import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Option {
  id: string;
  name: string;
}

interface AppliedAnalyticsFiltersProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedHouses: string[];
  setSelectedHouses: (houses: string[]) => void;
  selectedCurrencies: string[];
  setSelectedCurrencies: (currencies: string[]) => void;
  categoryOptions: Option[];
  houseOptions: Option[];
  currencyOptions: Option[];
}

export function AppliedAnalyticsFilters({
  selectedCategories,
  setSelectedCategories,
  selectedHouses,
  setSelectedHouses,
  selectedCurrencies,
  setSelectedCurrencies,
  categoryOptions,
  houseOptions,
  currencyOptions,
}: AppliedAnalyticsFiltersProps) {
  const hasFilters =
    selectedCategories.length > 0 ||
    selectedHouses.length > 0 ||
    selectedCurrencies.length > 0;

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedHouses([]);
    setSelectedCurrencies([]);
  };

  if (!hasFilters) return null;

  return (
    <div className="bg-card p-4 rounded-lg border shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-muted-foreground">
          Applied Filters
        </h4>
        <Button variant="ghost" size="sm" onClick={clearAll}>
          Clear All
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedCategories.map((id) => {
          const category = categoryOptions.find((c) => c.id === id);
          return (
            <Badge key={id} variant="default" className="px-3 py-1">
              Category: {category?.name || id}
              <X
                className="w-3 h-3 ml-2 cursor-pointer hover:text-destructive"
                onClick={() =>
                  setSelectedCategories(
                    selectedCategories.filter((c) => c !== id),
                  )
                }
              />
            </Badge>
          );
        })}
        {selectedHouses.map((id) => {
          const house = houseOptions.find((h) => h.id === id);
          return (
            <Badge key={id} variant="default" className="px-3 py-1">
              House: {house?.name || id}
              <X
                className="w-3 h-3 ml-2 cursor-pointer hover:text-destructive"
                onClick={() =>
                  setSelectedHouses(selectedHouses.filter((h) => h !== id))
                }
              />
            </Badge>
          );
        })}
        {selectedCurrencies.map((id) => {
          const currency = currencyOptions.find((c) => c.id === id);
          return (
            <Badge key={id} variant="secondary" className="px-3 py-1">
              Currency: {currency?.name || id}
              <X
                className="w-3 h-3 ml-2 cursor-pointer hover:text-destructive"
                onClick={() =>
                  setSelectedCurrencies(
                    selectedCurrencies.filter((c) => c !== id),
                  )
                }
              />
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
