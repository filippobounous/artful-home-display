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
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          placeholder="Enter item title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="artist">Artist/Maker *</Label>
        <Input
          id="artist"
          placeholder="Artist or maker name"
          value={formData.artist}
          onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
          required
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
        <Label htmlFor="yearPeriod">Year/Period *</Label>
        <Input
          id="yearPeriod"
          placeholder="e.g., 1920s, 2023"
          value={formData.yearPeriod}
          onChange={(e) => setFormData({ ...formData, yearPeriod: e.target.value })}
          required
        />
      </div>
    </div>
  );
}
