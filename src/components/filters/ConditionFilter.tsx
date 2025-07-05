import { MultiSelectFilter } from "@/components/MultiSelectFilter";

interface ConditionFilterProps {
  selectedCondition: string[];
  setSelectedCondition: (conditions: string[]) => void;
}

export function ConditionFilter({ selectedCondition, setSelectedCondition }: ConditionFilterProps) {
  const options = [
    { id: 'mint', name: 'Mint' },
    { id: 'excellent', name: 'Excellent' },
    { id: 'very good', name: 'Very Good' },
    { id: 'good', name: 'Good' }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">Condition</label>
      <MultiSelectFilter
        placeholder="Select condition"
        options={options}
        selectedValues={selectedCondition}
        onSelectionChange={setSelectedCondition}
      />
    </div>
  );
}
