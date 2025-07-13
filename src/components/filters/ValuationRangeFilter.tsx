import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ValuationRange {
  min?: number;
  max?: number;
}

interface ValuationRangeFilterProps {
  range: ValuationRange;
  setRange: (range: ValuationRange) => void;
}

export function ValuationRangeFilter({
  range,
  setRange,
}: ValuationRangeFilterProps) {
  return (
    <div>
      <Label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Valuation Range
      </Label>
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Min"
          value={range.min ?? ''}
          onChange={(e) =>
            setRange({
              ...range,
              min: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
        <Input
          type="number"
          placeholder="Max"
          value={range.max ?? ''}
          onChange={(e) =>
            setRange({
              ...range,
              max: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </div>
    </div>
  );
}
