import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddItemBasicInfoProps {
  formData: any;
  setFormData: (data: any) => void;
  errors?: Record<string, string>;
}

export function AddItemBasicInfo({
  formData,
  setFormData,
  errors = {},
}: AddItemBasicInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-slate-900">Core Information</h3>

      <div>
        <Label htmlFor="code">Item Code</Label>
        <Input
          id="code"
          placeholder="Inventory code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          placeholder="Enter item name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
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
          required
        />
        {errors.creator && (
          <p className="text-destructive text-sm mt-1">{errors.creator}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="width">Width (cm)</Label>
          <Input
            id="width"
            type="number"
            step="0.01"
            placeholder="0"
            value={formData.width_cm}
            onChange={(e) =>
              setFormData({ ...formData, width_cm: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            step="0.01"
            placeholder="0"
            value={formData.height_cm}
            onChange={(e) =>
              setFormData({ ...formData, height_cm: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="depth">Depth (cm)</Label>
          <Input
            id="depth"
            type="number"
            step="0.01"
            placeholder="0"
            value={formData.depth_cm}
            onChange={(e) =>
              setFormData({ ...formData, depth_cm: e.target.value })
            }
          />
        </div>
      </div>

      <div>
        <Label htmlFor="quantity">Quantity *</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: e.target.value })
          }
          required
        />
        {errors.quantity && (
          <p className="text-destructive text-sm mt-1">{errors.quantity}</p>
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
          required
        />
        {errors.date_period && (
          <p className="text-destructive text-sm mt-1">{errors.date_period}</p>
        )}
      </div>

      <div>
        <Label htmlFor="origin_region">Origin Region *</Label>
        <Input
          id="origin_region"
          value={formData.origin_region}
          onChange={(e) =>
            setFormData({ ...formData, origin_region: e.target.value })
          }
          required
        />
        {errors.origin_region && (
          <p className="text-destructive text-sm mt-1">
            {errors.origin_region}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="material">Material</Label>
        <Input
          id="material"
          value={formData.material}
          onChange={(e) =>
            setFormData({ ...formData, material: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="weight_kg">Weight (kg)</Label>
          <Input
            id="weight_kg"
            type="number"
            step="0.01"
            value={formData.weight_kg}
            onChange={(e) =>
              setFormData({ ...formData, weight_kg: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="provenance">Provenance</Label>
          <Input
            id="provenance"
            value={formData.provenance}
            onChange={(e) =>
              setFormData({ ...formData, provenance: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
}
