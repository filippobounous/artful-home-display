import type { ComponentProps, Dispatch, SetStateAction } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { normalizeNumberInput } from '@/lib/numberInput';

import type { DecorItemFormData } from '@/types/forms';

interface AddItemBasicInfoProps {
  formData: DecorItemFormData;
  setFormData: Dispatch<SetStateAction<DecorItemFormData>>;
  errors?: Record<string, string>;
}

type FieldKey =
  | 'name'
  | 'creator'
  | 'date_period'
  | 'origin_region'
  | 'quantity';

type FieldConfig = {
  id: FieldKey;
  label: string;
  placeholder: string;
  inputProps?: Omit<
    ComponentProps<typeof Input>,
    'value' | 'onChange' | 'id' | 'placeholder'
  >;
};

interface BasicInfoFieldProps extends FieldConfig {
  value: DecorItemFormData[FieldKey];
  error?: string;
  onChange: (value: string) => void;
}

function BasicInfoField({
  id,
  label,
  placeholder,
  value,
  error,
  onChange,
  inputProps,
}: BasicInfoFieldProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        {...inputProps}
        className={cn(
          error && 'border-destructive focus-visible:ring-destructive',
          inputProps?.className,
        )}
      />
      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </div>
  );
}

export function AddItemBasicInfo({
  formData,
  setFormData,
  errors = {},
}: AddItemBasicInfoProps) {
  const coreFields: FieldConfig[] = [
    {
      id: 'name',
      label: 'Name *',
      placeholder: 'Enter item name',
    },
    {
      id: 'creator',
      label: 'Creator *',
      placeholder: 'Artist or maker name',
    },
    {
      id: 'date_period',
      label: 'Date/Period *',
      placeholder: 'e.g., 1920s, 2023',
    },
    {
      id: 'origin_region',
      label: 'Origin Region *',
      placeholder: 'Country or region',
    },
    {
      id: 'quantity',
      label: 'Quantity *',
      placeholder: 'Enter quantity',
      inputProps: {
        type: 'text',
        inputMode: 'numeric',
      },
    },
  ];

  const handleFieldChange = (field: FieldKey, value: string) => {
    const nextValue =
      field === 'quantity' ? normalizeNumberInput(value) : value;

    setFormData((prev) => ({
      ...prev,
      [field]: nextValue,
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground flex items-center">
        Core
        {errors.core && (
          <Badge variant="destructive" className="ml-2">
            Missing Data
          </Badge>
        )}
      </h3>

      {coreFields.map((field) => (
        <BasicInfoField
          key={field.id}
          {...field}
          value={formData[field.id]}
          error={errors[field.id]}
          onChange={(value) => handleFieldChange(field.id, value)}
        />
      ))}

      {/* Physical Section */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium text-foreground">Physical</h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="text"
              inputMode="decimal"
              placeholder="Height in cm"
              value={formData.height_cm}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  height_cm: normalizeNumberInput(e.target.value),
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="width">Width (cm)</Label>
            <Input
              id="width"
              type="text"
              inputMode="decimal"
              placeholder="Width in cm"
              value={formData.width_cm}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  width_cm: normalizeNumberInput(e.target.value),
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="depth">Depth (cm)</Label>
            <Input
              id="depth"
              type="text"
              inputMode="decimal"
              placeholder="Depth in cm"
              value={formData.depth_cm}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  depth_cm: normalizeNumberInput(e.target.value),
                }))
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight_kg">Mass (kg)</Label>
            <Input
              id="weight_kg"
              type="text"
              inputMode="decimal"
              placeholder="Mass in kg"
              value={formData.weight_kg}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  weight_kg: normalizeNumberInput(e.target.value),
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="material">Material</Label>
            <Input
              id="material"
              placeholder="e.g., wood, ceramic"
              value={formData.material}
              onChange={(e) =>
                setFormData({ ...formData, material: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <Label htmlFor="provenance">Provenance</Label>
          <Input
            id="provenance"
            placeholder="Source or previous owner"
            value={formData.provenance}
            onChange={(e) =>
              setFormData({ ...formData, provenance: e.target.value })
            }
          />
        </div>
      </div>
      {errors.core && (
        <p className="text-destructive text-sm mt-1">{errors.core}</p>
      )}
    </div>
  );
}
