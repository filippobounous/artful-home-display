import { MultiSelectFilter } from '@/components/MultiSelectFilter';
import { Label } from '@/components/ui/label';

interface YearFilterProps {
  yearOptions: string[];
  selectedYear: string[];
  setSelectedYear: (years: string[]) => void;
  label?: string;
  placeholder?: string;
}

export function YearFilter({
  yearOptions,
  selectedYear,
  setSelectedYear,
  label = 'Year/Period',
  placeholder = 'Select year or period',
}: YearFilterProps) {
  const options = yearOptions.map((y) => ({ id: y, name: y }));

  return (
    <div>
      <Label className="block text-sm font-medium text-muted-foreground mb-2">
        {label}
      </Label>
      <MultiSelectFilter
        placeholder={placeholder}
        options={options}
        selectedValues={selectedYear}
        onSelectionChange={setSelectedYear}
      />
    </div>
  );
}
