
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categoryConfigs } from "@/types/inventory";

interface AddItemBasicInfoProps {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
}

export function AddItemBasicInfo({ formData, setFormData }: AddItemBasicInfoProps) {
  // Get subcategories for selected category
  const selectedCategoryConfig = categoryConfigs.find(cat => cat.id === formData.category);
  const availableSubcategories = selectedCategoryConfig?.subcategories || [];

  // Reset subcategory when category changes
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value, subcategory: "" }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="artist">Artist/Maker *</Label>
        <Input
          id="artist"
          value={formData.artist}
          onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categoryConfigs.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="subcategory">Subcategory</Label>
        <Select
          value={formData.subcategory}
          onValueChange={(value) => setFormData(prev => ({ ...prev, subcategory: value }))}
          disabled={!formData.category}
        >
          <SelectTrigger>
            <SelectValue placeholder={formData.category ? "Select subcategory" : "Select category first"} />
          </SelectTrigger>
          <SelectContent>
            {availableSubcategories.map(subcategory => (
              <SelectItem key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="yearPeriod">Year/Period</Label>
        <Input
          id="yearPeriod"
          placeholder="e.g., 1960s, 2020, 19th century"
          value={formData.yearPeriod}
          onChange={(e) => setFormData(prev => ({ ...prev, yearPeriod: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="size">Size/Dimensions</Label>
        <Input
          id="size"
          placeholder="e.g., 24x36 inches, 6 feet"
          value={formData.size}
          onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="condition">Condition</Label>
        <Select
          value={formData.condition}
          onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mint">Mint</SelectItem>
            <SelectItem value="excellent">Excellent</SelectItem>
            <SelectItem value="very good">Very Good</SelectItem>
            <SelectItem value="good">Good</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={formData.quantity}
          onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
        />
      </div>
    </div>
  );
}
