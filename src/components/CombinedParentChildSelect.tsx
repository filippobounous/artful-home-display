import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMemo } from 'react';

type ParseResult = {
  parentId: string;
  childId: string;
};

interface CombinedSelectOption {
  value: string;
  label: string;
}

interface CombinedParentChildSelectProps<TParent, TChild> {
  selectId: string;
  label: string;
  placeholder: string;
  items: TParent[];
  selectedParentId: string;
  selectedChildId: string;
  getParentId: (parent: TParent) => string;
  getChildren: (parent: TParent) => TChild[];
  getChildId: (child: TChild) => string;
  buildOptionLabel: (parent: TParent, child: TChild) => string;
  buildParentOnlyLabel?: (parent: TParent) => string;
  includeParentOnlyOption?: boolean;
  buildValue: (parentId: string, childId: string) => string;
  parseValue: (value: string) => ParseResult;
  buildCurrentValue: (parentId: string, childId: string) => string;
  onSelectionChange: (parentId: string, childId: string) => void;
}

export function CombinedParentChildSelect<TParent, TChild>({
  selectId,
  label,
  placeholder,
  items,
  selectedParentId,
  selectedChildId,
  getParentId,
  getChildren,
  getChildId,
  buildOptionLabel,
  buildParentOnlyLabel,
  includeParentOnlyOption,
  buildValue,
  parseValue,
  buildCurrentValue,
  onSelectionChange,
}: CombinedParentChildSelectProps<TParent, TChild>) {
  const options = useMemo(() => {
    return items.flatMap<CombinedSelectOption>((parent) => {
      const parentId = getParentId(parent);
      const parentOnlyOption =
        includeParentOnlyOption && buildParentOnlyLabel
          ? [
              {
                value: buildValue(parentId, ''),
                label: buildParentOnlyLabel(parent),
              },
            ]
          : [];

      const childOptions = getChildren(parent).map<CombinedSelectOption>((child) => ({
        value: buildValue(parentId, getChildId(child)),
        label: buildOptionLabel(parent, child),
      }));

      return [...parentOnlyOption, ...childOptions];
    });
  }, [
    buildOptionLabel,
    buildParentOnlyLabel,
    buildValue,
    getChildId,
    getChildren,
    getParentId,
    includeParentOnlyOption,
    items,
  ]);

  const currentValue = buildCurrentValue(selectedParentId, selectedChildId);

  const handleSelectionChange = (value: string) => {
    if (value) {
      const { parentId, childId } = parseValue(value);
      onSelectionChange(parentId, childId);
      return;
    }

    onSelectionChange('', '');
  };

  return (
    <div>
      <Label htmlFor={selectId}>{label}</Label>
      <Select value={currentValue} onValueChange={handleSelectionChange}>
        <SelectTrigger
          id={selectId}
          className={currentValue ? undefined : 'text-muted-foreground'}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
