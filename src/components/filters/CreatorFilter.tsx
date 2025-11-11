import { MultiSelectFilter } from '@/components/MultiSelectFilter';
import { Label } from '@/components/ui/label';

interface CreatorFilterProps {
  options: string[];
  selected: string[];
  onChange: (creators: string[]) => void;
  label: string;
  placeholder: string;
}

export function CreatorFilter({
  options,
  selected,
  onChange,
  label,
  placeholder,
}: CreatorFilterProps) {
  const mappedOptions = options.map((value) => ({ id: value, name: value }));
  return (
    <div>
      <Label className="block text-sm font-medium text-muted-foreground mb-2">
        {label}
      </Label>
      <MultiSelectFilter
        placeholder={placeholder}
        options={mappedOptions}
        selectedValues={selected}
        onSelectionChange={onChange}
      />
    </div>
  );
}
