import { MultiSelectFilter } from '@/components/MultiSelectFilter';
import { Label } from '@/components/ui/label';

interface YearFilterProps {
  yearOptions: string[];
  selectedYear: string[];
  setSelectedYear: (years: string[]) => void;
}

export function YearFilter({
  yearOptions,
  selectedYear,
  setSelectedYear,
}: YearFilterProps) {
  const options = yearOptions.map((y) => ({ id: y, name: y }));

  return (
    <div>
      <Label className="block text-sm font-medium text-muted-foreground mb-2">
        Year/Period
      </Label>
      <MultiSelectFilter
        placeholder="Select year or period"
        options={options}
        selectedValues={selectedYear}
        onSelectionChange={setSelectedYear}
      />
    </div>
  );
}
