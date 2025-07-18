import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronDown, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

import type { CheckedState } from '@radix-ui/react-checkbox';

interface MultiSelectOption {
  id: string;
  name: string;
  image?: string;
  indent?: boolean;
  header?: boolean;
  checkState?: CheckedState;
  onCheckChange?: (checked: CheckedState) => void;
}

interface MultiSelectFilterProps {
  placeholder: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  /**
   * Optional count override used for the badge. Allows parents
   * to display a count that differs from the raw number of
   * selected option ids.
   */
  selectedCount?: number;
}

export function MultiSelectFilter({
  placeholder,
  options,
  selectedValues,
  onSelectionChange,
  selectedCount,
}: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false);

  const handleToggle = (value: string) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onSelectionChange(newSelection);
  };

  const handleClear = () => {
    onSelectionChange([]);
  };

  const selectedLabels = options
    .filter((option) => !option.header && selectedValues.includes(option.id))
    .map((option) => option.name);

  const selectionCount = selectedCount ?? selectedLabels.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-between text-left font-normal',
            selectedValues.length > 0 && 'border-primary',
          )}
        >
          <div className="flex flex-wrap gap-1">
            {selectionCount > 0 ? (
              <Badge variant="secondary" className="text-xs">
                {selectionCount} item{selectionCount === 1 ? '' : 's'}
              </Badge>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {selectedValues.length > 0 && (
              <span
                className="pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              >
                <X className="w-4 h-4 hover:text-destructive cursor-pointer" />
              </span>
            )}
            <ChevronDown className="w-4 h-4" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-2" align="start">
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isTri = option.header && option.checkState !== undefined;
            if (option.header && !isTri) {
              return (
                <div
                  key={option.id}
                  className="px-2 py-1 text-sm font-medium text-muted-foreground bg-muted"
                >
                  {option.name}
                </div>
              );
            }
            return (
              <div
                key={option.id}
                className={`flex items-center space-x-2 p-2 hover:bg-muted rounded cursor-pointer ${option.indent ? 'pl-4' : ''}`}
                onClick={() => {
                  if (isTri && option.onCheckChange) {
                    option.onCheckChange(
                      option.checkState === true ? false : true,
                    );
                  } else {
                    handleToggle(option.id);
                  }
                }}
              >
                <Checkbox
                  onClick={(e) => e.stopPropagation()}
                  checked={
                    isTri
                      ? option.checkState
                      : selectedValues.includes(option.id)
                  }
                  onCheckedChange={(val) => {
                    if (isTri && option.onCheckChange) {
                      option.onCheckChange(val as CheckedState);
                    } else {
                      handleToggle(option.id);
                    }
                  }}
                />
                {option.image && (
                  <img
                    src={option.image}
                    alt={option.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                )}
                <span
                  className={`text-sm ${option.header ? 'font-medium text-muted-foreground' : ''}`}
                >
                  {option.name}
                </span>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
