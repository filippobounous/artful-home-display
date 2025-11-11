import { MultiSelectFilter } from '@/components/MultiSelectFilter';
import type { InventoryItem } from '@/types/inventory';
import { AppliedAnalyticsFilters } from './AppliedAnalyticsFilters';
import { cn } from '@/lib/utils';
import { useSettingsState } from '@/hooks/useSettingsState';
import { getCategoryLabel, getItemValuationCurrency } from '@/lib/inventoryDisplay';
import { useCollection } from '@/context/CollectionProvider';

interface AnalyticsFiltersProps {
  items: InventoryItem[];
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
  const { houses, categories } = useSettingsState();
  const { collection } = useCollection();
  const categoryLabel = getCategoryLabel(collection);

  const categoryOptions = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  const houseOptions = houses.map((house) => ({
    id: house.id,
    name: house.name,
  }));

  const currencySet = new Set<string>();
  items.forEach((item) => {
    const currency = getItemValuationCurrency(item);
    if (currency) currencySet.add(currency);
  });
  const currencyOptions = Array.from(currencySet).map((currency) => ({
    id: currency,
    name: currency,
  }));

  const activeCount =
    selectedCategories.length + selectedHouses.length + selectedCurrencies.length;

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
            placeholder={`Select ${categoryLabel.toLowerCase()}s`}
            options={categoryOptions}
            selectedValues={selectedCategories}
            onSelectionChange={setSelectedCategories}
          />
          <MultiSelectFilter
            placeholder="Select houses"
            options={houseOptions}
            selectedValues={selectedHouses}
            onSelectionChange={setSelectedHouses}
          />
          <MultiSelectFilter
            placeholder="Select currencies"
            options={currencyOptions}
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
        categoryOptions={categoryOptions}
        houseOptions={houseOptions}
        currencyOptions={currencyOptions}
        categoryLabel={categoryLabel}
      />
    </div>
  );
}
