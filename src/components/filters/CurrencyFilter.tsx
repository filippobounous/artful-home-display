import { MultiSelectFilter } from '@/components/MultiSelectFilter';
import { Label } from '@/components/ui/label';

interface CurrencyFilterProps {
  currencyOptions: string[];
  selectedCurrency: string[];
  setSelectedCurrency: (currencies: string[]) => void;
}

export function CurrencyFilter({
  currencyOptions,
  selectedCurrency,
  setSelectedCurrency,
}: CurrencyFilterProps) {
  const options = currencyOptions.map((currency) => ({
    id: currency,
    name: currency,
  }));

  return (
    <div>
      <Label className="block text-sm font-medium text-muted-foreground mb-2">
        Valuation currency
      </Label>
      <MultiSelectFilter
        placeholder="Select valuation currency"
        options={options}
        selectedValues={selectedCurrency}
        onSelectionChange={setSelectedCurrency}
      />
    </div>
  );
}
