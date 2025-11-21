import { MultiSelectFilter } from '@/components/MultiSelectFilter';
import { Label } from '@/components/ui/label';

interface ConditionFilterProps {
  conditionOptions: string[];
  selectedCondition: string[];
  setSelectedCondition: (conditions: string[]) => void;
}

const formatConditionLabel = (condition: string) =>
  condition
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export function ConditionFilter({
  conditionOptions,
  selectedCondition,
  setSelectedCondition,
}: ConditionFilterProps) {
  const options = conditionOptions.map((condition) => ({
    id: condition,
    name: formatConditionLabel(condition),
  }));

  return (
    <div>
      <Label className="block text-sm font-medium text-muted-foreground mb-2">
        Condition
      </Label>
      <MultiSelectFilter
        placeholder="Select condition"
        options={options}
        selectedValues={selectedCondition}
        onSelectionChange={setSelectedCondition}
      />
    </div>
  );
}
