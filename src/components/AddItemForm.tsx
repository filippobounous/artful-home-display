
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { categoryConfigs, houseConfigs } from "@/types/inventory";

export function AddItemForm() {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    category: "",
    subcategory: "",
    size: "",
    valuation: "",
    valuationDate: undefined as Date | undefined,
    valuationPerson: "",
    valuationCurrency: "USD",
    quantity: "1",
    yearPeriod: "",
    house: "",
    room: "",
    description: "",
    condition: "",
    notes: "",
    images: [] as string[]
  });

  const [newImageUrl, setNewImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your API
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }));
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Get subcategories for selected category
  const selectedCategoryConfig = categoryConfigs.find(cat => cat.id === formData.category);
  const availableSubcategories = selectedCategoryConfig?.subcategories || [];

  // Get rooms for selected house
  const selectedHouseConfig = houseConfigs.find(house => house.id === formData.house);
  const availableRooms = selectedHouseConfig?.rooms || [];

  // Reset subcategory when category changes
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value, subcategory: "" }));
  };

  // Reset room when house changes
  const handleHouseChange = (value: string) => {
    setFormData(prev => ({ ...prev, house: value, room: "" }));
  };

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle>Add New Item to Collection</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
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

            {/* Location and Valuation */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="house">House</Label>
                <Select
                  value={formData.house}
                  onValueChange={handleHouseChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select house" />
                  </SelectTrigger>
                  <SelectContent>
                    {houseConfigs.map(house => (
                      <SelectItem key={house.id} value={house.id}>
                        {house.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="room">Room</Label>
                <Select
                  value={formData.room}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, room: value }))}
                  disabled={!formData.house}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formData.house ? "Select room" : "Select house first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRooms.map(room => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="valuation">Valuation</Label>
                <Input
                  id="valuation"
                  type="number"
                  placeholder="0"
                  value={formData.valuation}
                  onChange={(e) => setFormData(prev => ({ ...prev, valuation: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="valuationCurrency">Valuation Currency</Label>
                <Select
                  value={formData.valuationCurrency}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, valuationCurrency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Valuation Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.valuationDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.valuationDate ? format(formData.valuationDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.valuationDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, valuationDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="valuationPerson">Valuation Person/Company</Label>
                <Input
                  id="valuationPerson"
                  placeholder="e.g., Art Appraisers Inc."
                  value={formData.valuationPerson}
                  onChange={(e) => setFormData(prev => ({ ...prev, valuationPerson: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Description and Notes */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <Label>Images</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Image URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1"
              />
              <Button type="button" onClick={addImage}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              Add to Collection
            </Button>
            <Button type="button" variant="outline" className="flex-1">
              Save as Draft
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
