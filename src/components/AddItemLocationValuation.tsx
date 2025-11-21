import { type ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { HierarchicalHouseRoomSelector } from '@/components/HierarchicalHouseRoomSelector';
import { HierarchicalCategorySelector } from '@/components/HierarchicalCategorySelector';
import { currencyOptions } from '@/data/currencies';
import { normalizeNumberInput } from '@/lib/numberInput';

import type { DecorItemFormData } from '@/types/forms';

interface AddItemLocationValuationProps {
  formData: DecorItemFormData;
  setFormData: React.Dispatch<React.SetStateAction<DecorItemFormData>>;
  errors?: Record<string, string>;
}

interface ValuationSectionProps {
  label: string;
  prefix: string;
  value: string;
  currency: string;
  date?: Date;
  onValueChange: (value: string) => void;
  onCurrencyChange: (currency: string) => void;
  onDateChange: (date: Date | undefined) => void;
  error?: string;
  errorPlacement?: 'afterDate' | 'afterSection';
  children?: ReactNode;
}

function ValuationSection({
  label,
  prefix,
  value,
  currency,
  date,
  onValueChange,
  onCurrencyChange,
  onDateChange,
  error,
  errorPlacement = 'afterDate',
  children,
}: ValuationSectionProps) {
  const errorElement =
    error && <p className="text-destructive text-sm mt-1">{error}</p>;

  return (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="text-lg font-medium text-foreground">{label}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${prefix}_value`}>Value</Label>
          <Input
            id={`${prefix}_value`}
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={value}
            onChange={(e) => onValueChange(normalizeNumberInput(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor={`${prefix}_currency`}>Currency</Label>
          <Select value={currency} onValueChange={onCurrencyChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencyOptions.map(({ code, symbol }) => (
                <SelectItem key={code} value={code}>
                  {code} {symbol && `(${symbol})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>{`${label} Date`}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${
                date ? '' : 'text-muted-foreground'
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : 'Select date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              disabled={(selectedDate) => selectedDate > new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errorPlacement === 'afterDate' && errorElement}
      </div>
      {children}
      {errorPlacement === 'afterSection' && errorElement}
    </div>
  );
}

export function AddItemLocationValuation({
  formData,
  setFormData,
  errors = {},
}: AddItemLocationValuationProps) {
  const handleLocationChange = (house: string, room: string) => {
    const room_code = room || '';
    setFormData({ ...formData, house, room, room_code });
  };

  const handleCategoryChange = (category: string, subcategory: string) => {
    setFormData({ ...formData, category, subcategory });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground">
        Category & Location
      </h3>

      <div>
        <HierarchicalCategorySelector
          selectedCategory={formData.category}
          selectedSubcategory={formData.subcategory}
          onSelectionChange={handleCategoryChange}
          invalid={Boolean(errors.category || errors.subcategory)}
        />
        {(errors.category || errors.subcategory) && (
          <p className="text-destructive text-sm mt-1">
            {errors.category || errors.subcategory}
          </p>
        )}
      </div>

      <div>
        <HierarchicalHouseRoomSelector
          selectedHouse={formData.house}
          selectedRoom={formData.room}
          onSelectionChange={handleLocationChange}
          invalid={Boolean(errors.room_code)}
        />
        {errors.room_code && (
          <p className="text-destructive text-sm mt-1">{errors.room_code}</p>
        )}
      </div>

      <ValuationSection
        label="Acquisition"
        prefix="acquisition"
        value={formData.acquisition_value}
        currency={formData.acquisition_currency}
        date={formData.acquisition_date}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, acquisition_value: value }))
        }
        onCurrencyChange={(value) =>
          setFormData((prev) => ({ ...prev, acquisition_currency: value }))
        }
        onDateChange={(date) =>
          setFormData((prev) => ({ ...prev, acquisition_date: date }))
        }
        error={errors.acquisition}
      />

      <ValuationSection
        label="Appraisal"
        prefix="appraisal"
        value={formData.appraisal_value}
        currency={formData.appraisal_currency}
        date={formData.appraisal_date}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, appraisal_value: value }))
        }
        onCurrencyChange={(value) =>
          setFormData((prev) => ({ ...prev, appraisal_currency: value }))
        }
        onDateChange={(date) =>
          setFormData((prev) => ({ ...prev, appraisal_date: date }))
        }
        error={errors.appraisal}
        errorPlacement="afterSection"
      >
        <div>
          <Label htmlFor="appraisal_entity">Appraised By</Label>
          <Input
            id="appraisal_entity"
            placeholder="Appraiser name or organization"
            value={formData.appraisal_entity}
            onChange={(e) =>
              setFormData({ ...formData, appraisal_entity: e.target.value })
            }
          />
        </div>
      </ValuationSection>
    </div>
  );
}
