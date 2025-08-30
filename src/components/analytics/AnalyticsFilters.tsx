import { MultiSelectFilter } from '@/components/MultiSelectFilter';
import { DecorItem } from '@/types/inventory';
import { AppliedAnalyticsFilters } from './AppliedAnalyticsFilters';
import { cn } from '@/lib/utils';

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
  const categories = Array.from(
    new Set(items.map((item) => item.category)),
  ).map((category) => ({
    id: category,
    name: category.charAt(0).toUpperCase() + category.slice(1),
  }));

  const houses = Array.from(
    new Set(items.map((item) => item.house).filter(Boolean)),
  ).map((house) => ({
    id: house!,
    name: house!.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
  }));

  const currencies = Array.from(
    new Set(items.map((item) => item.valuationCurrency).filter(Boolean)),
  ).map((currency) => ({ id: currency!, name: currency! }));

  const activeCount =
    selectedCategories.length +
    selectedHouses.length +
    selectedCurrencies.length;

  return (
    <div className="mb-8 space-y-6">
      <div
        className={cn(
          'bg-card p-4 rounded-lg border shadow-sm',
          activeCount > 0 && 'border-primary',
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MultiSelectFilter
            placeholder="Select categories"
            options={categories}
            selectedValues={selectedCategories}
            onSelectionChange={setSelectedCategories}
          />
          <MultiSelectFilter
            placeholder="Select houses"
            options={houses}
            selectedValues={selectedHouses}
            onSelectionChange={setSelectedHouses}
          />
          <MultiSelectFilter
            placeholder="Select currencies"
            options={currencies}
            selectedValues={selectedCurrencies}
            onSelectionChange={setSelectedCurrencies}
          />
        </div>
      </div>
      <AppliedAnalyticsFilters
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedHouses={selectedHouses}
        setSelectedHouses={setSelectedHouses}
        selectedCurrencies={selectedCurrencies}
        setSelectedCurrencies={setSelectedCurrencies}
        categoryOptions={categories}
        houseOptions={houses}
        currencyOptions={currencies}
      />
    </div>
  );
}
