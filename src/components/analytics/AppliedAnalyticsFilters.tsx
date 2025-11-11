import { Button } from '@/components/ui/button';
import {
  AppliedFilterBadges,
  type AppliedFilterBadgeGroup,
} from '@/components/filters/AppliedFilterBadges';

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
  categoryLabel: string;
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
  categoryLabel,
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

  const filterGroups: AppliedFilterBadgeGroup[] = [];

  if (selectedCategories.length > 0) {
    const categoryOptionsMap: AppliedFilterBadgeGroup['options'] = {};

    selectedCategories.forEach((id) => {
      const category = categoryOptions.find((option) => option.id === id);
      categoryOptionsMap[id] = { label: category?.name ?? id };
    });

    filterGroups.push({
      id: 'analytics-category',
      labelPrefix: categoryLabel,
      selectedIds: selectedCategories,
      options: categoryOptionsMap,
      onRemove: (id) =>
        setSelectedCategories(selectedCategories.filter((category) => category !== id)),
    });
  }

  if (selectedHouses.length > 0) {
    const houseOptionsMap: AppliedFilterBadgeGroup['options'] = {};

    selectedHouses.forEach((id) => {
      const house = houseOptions.find((option) => option.id === id);
      houseOptionsMap[id] = { label: house?.name ?? id };
    });

    filterGroups.push({
      id: 'analytics-house',
      labelPrefix: 'House',
      selectedIds: selectedHouses,
      options: houseOptionsMap,
      onRemove: (id) =>
        setSelectedHouses(selectedHouses.filter((house) => house !== id)),
    });
  }

  if (selectedCurrencies.length > 0) {
    const currencyOptionsMap: AppliedFilterBadgeGroup['options'] = {};

    selectedCurrencies.forEach((id) => {
      const currency = currencyOptions.find((option) => option.id === id);
      currencyOptionsMap[id] = { label: currency?.name ?? id };
    });

    filterGroups.push({
      id: 'analytics-currency',
      labelPrefix: 'Currency',
      selectedIds: selectedCurrencies,
      options: currencyOptionsMap,
      onRemove: (id) =>
        setSelectedCurrencies(selectedCurrencies.filter((currency) => currency !== id)),
      variant: 'secondary',
    });
  }

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
        <AppliedFilterBadges groups={filterGroups} />
      </div>
    </div>
  );
}
