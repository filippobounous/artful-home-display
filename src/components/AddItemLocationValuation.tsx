
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { HierarchicalHouseRoomSelector } from "@/components/HierarchicalHouseRoomSelector";
import { HierarchicalCategorySelector } from "@/components/HierarchicalCategorySelector";

interface AddItemLocationValuationProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function AddItemLocationValuation({ formData, setFormData }: AddItemLocationValuationProps) {
  const handleLocationChange = (house: string, room: string) => {
    setFormData({ ...formData, house, room });
  };

  const handleCategoryChange = (category: string, subcategory: string) => {
    setFormData({ ...formData, category, subcategory });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-slate-900">Category & Location</h3>
      
      <HierarchicalCategorySelector
        selectedCategory={formData.category}
        selectedSubcategory={formData.subcategory}
        onSelectionChange={handleCategoryChange}
      />

      <HierarchicalHouseRoomSelector
        selectedHouse={formData.house}
        selectedRoom={formData.room}
        onSelectionChange={handleLocationChange}
      />

      <div>
        <Label htmlFor="condition">Condition</Label>
        <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
          <SelectTrigger
            className={formData.condition ? undefined : "text-muted-foreground"}
          >
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

      {/* Valuation Section */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="font-medium text-slate-700">Valuation Information</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="valuation">Valuation Amount</Label>
            <Input
              id="valuation"
              type="number"
              placeholder="0.00"
              value={formData.valuation}
              onChange={(e) => setFormData({ ...formData, valuation: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="valuationCurrency">Currency</Label>
            <Select value={formData.valuationCurrency} onValueChange={(value) => setFormData({ ...formData, valuationCurrency: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
                <SelectItem value="CAD">CAD ($)</SelectItem>
                <SelectItem value="AUD">AUD ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Valuation Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${formData.valuationDate ? "" : "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.valuationDate ? format(formData.valuationDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.valuationDate}
                onSelect={(date) => setFormData({ ...formData, valuationDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="valuationPerson">Valued By</Label>
          <Input
            id="valuationPerson"
            placeholder="Appraiser name or organization"
            value={formData.valuationPerson}
            onChange={(e) => setFormData({ ...formData, valuationPerson: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
