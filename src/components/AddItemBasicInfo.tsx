import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddItemBasicInfoProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function AddItemBasicInfo({ formData, setFormData }: AddItemBasicInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-slate-900">Core Information</h3>
      
      <div>
        <Label htmlFor="code">Code</Label>
        <Input
          id="code"
          placeholder="Optional code"
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
      </div>

      <div>
        <Label htmlFor="creator">Creator *</Label>
        <Input
          id="creator"
          placeholder="Artist or maker name"
          value={formData.creator}
          onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="origin">Origin Region *</Label>
        <Input
          id="origin"
          placeholder="Where is it from?"
          value={formData.originRegion}
          onChange={(e) => setFormData({ ...formData, originRegion: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="material">Material</Label>
        <Input
          id="material"
          placeholder="What is it made of?"
          value={formData.material}
          onChange={(e) => setFormData({ ...formData, material: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="width">Width (cm)</Label>
          <Input
            id="width"
            type="number"
            step="0.01"
            placeholder="0"
            value={formData.widthCm}
            onChange={(e) => setFormData({ ...formData, widthCm: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            step="0.01"
            placeholder="0"
            value={formData.heightCm}
            onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="depth">Depth (cm)</Label>
          <Input
            id="depth"
            type="number"
            step="0.01"
            placeholder="0"
            value={formData.depthCm}
            onChange={(e) => setFormData({ ...formData, depthCm: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="weight">Weight (kg)</Label>
        <Input
          id="weight"
          type="number"
          step="0.01"
          placeholder="0"
          value={formData.weightKg}
          onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="provenance">Provenance</Label>
        <Input
          id="provenance"
          placeholder="Where it was bought or comes from"
          value={formData.provenance}
          onChange={(e) => setFormData({ ...formData, provenance: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="quantity">Quantity *</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="datePeriod">Date/Period *</Label>
        <Input
          id="datePeriod"
          placeholder="e.g., 1920s, 2023"
          value={formData.datePeriod}
          onChange={(e) => setFormData({ ...formData, datePeriod: e.target.value })}
          required
        />
      </div>
    </div>
  );
}
