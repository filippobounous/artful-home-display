import { MultiSelectFilter } from '@/components/MultiSelectFilter';

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
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Year/Period
      </label>
      <MultiSelectFilter
        placeholder="Select year or period"
        options={options}
        selectedValues={selectedYear}
        onSelectionChange={setSelectedYear}
      />
    </div>
  );
}
