import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import type { DecorItemFormData } from '@/types/forms';

interface AddItemBasicInfoProps {
  formData: DecorItemFormData;
  setFormData: React.Dispatch<React.SetStateAction<DecorItemFormData>>;
  errors?: Record<string, string>;
}

export function AddItemBasicInfo({
  formData,
  setFormData,
  errors = {},
}: AddItemBasicInfoProps) {
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

      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          placeholder="Enter item name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={cn(
            errors.name && 'border-destructive focus-visible:ring-destructive',
          )}
        />
        {errors.name && (
          <p className="text-destructive text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <Label htmlFor="creator">Creator *</Label>
        <Input
          id="creator"
          placeholder="Artist or maker name"
          value={formData.creator}
          onChange={(e) =>
            setFormData({ ...formData, creator: e.target.value })
          }
          className={cn(
            errors.creator &&
              'border-destructive focus-visible:ring-destructive',
          )}
        />
        {errors.creator && (
          <p className="text-destructive text-sm mt-1">{errors.creator}</p>
        )}
      </div>

      <div>
        <Label htmlFor="date_period">Date/Period *</Label>
        <Input
          id="date_period"
          placeholder="e.g., 1920s, 2023"
          value={formData.date_period}
          onChange={(e) =>
            setFormData({ ...formData, date_period: e.target.value })
          }
          className={cn(
            errors.date_period &&
              'border-destructive focus-visible:ring-destructive',
          )}
        />
        {errors.date_period && (
          <p className="text-destructive text-sm mt-1">{errors.date_period}</p>
        )}
      </div>

      <div>
        <Label htmlFor="origin_region">Origin Region *</Label>
        <Input
          id="origin_region"
          placeholder="Country or region"
          value={formData.origin_region}
          onChange={(e) =>
            setFormData({ ...formData, origin_region: e.target.value })
          }
          className={cn(
            errors.origin_region &&
              'border-destructive focus-visible:ring-destructive',
          )}
        />
        {errors.origin_region && (
          <p className="text-destructive text-sm mt-1">
            {errors.origin_region}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="quantity">Quantity *</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          placeholder="Enter quantity"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: e.target.value })
          }
          className={cn(
            errors.quantity &&
              'border-destructive focus-visible:ring-destructive',
          )}
        />
        {errors.quantity && (
          <p className="text-destructive text-sm mt-1">{errors.quantity}</p>
        )}
      </div>

      {/* Physical Section */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium text-foreground">Physical</h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              step="0.01"
              placeholder="Height in cm"
              value={formData.height_cm}
              onChange={(e) =>
                setFormData({ ...formData, height_cm: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="width">Width (cm)</Label>
            <Input
              id="width"
              type="number"
              step="0.01"
              placeholder="Width in cm"
              value={formData.width_cm}
              onChange={(e) =>
                setFormData({ ...formData, width_cm: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="depth">Depth (cm)</Label>
            <Input
              id="depth"
              type="number"
              step="0.01"
              placeholder="Depth in cm"
              value={formData.depth_cm}
              onChange={(e) =>
                setFormData({ ...formData, depth_cm: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight_kg">Mass (kg)</Label>
            <Input
              id="weight_kg"
              type="number"
              step="0.01"
              placeholder="Mass in kg"
              value={formData.weight_kg}
              onChange={(e) =>
                setFormData({ ...formData, weight_kg: e.target.value })
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
