
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
    setFormData({ ...formData, house, room_code: room });
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
        selectedRoom={formData.room_code}
        onSelectionChange={handleLocationChange}
      />



      {/* Acquisition Section */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="font-medium text-slate-700">Acquisition Information</h4>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="acqValue">Purchase Price</Label>
            <Input
              id="acqValue"
              type="number"
              placeholder="0.00"
              value={formData.acquisitionValue}
              onChange={(e) => setFormData({ ...formData, acquisitionValue: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="acqCurrency">Currency</Label>
            <Select value={formData.acquisitionCurrency} onValueChange={(value) => setFormData({ ...formData, acquisitionCurrency: value })}>
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
          <Label>Acquisition Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${formData.acquisitionDate ? "" : "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.acquisitionDate ? format(formData.acquisitionDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.acquisitionDate}
                onSelect={(date) => setFormData({ ...formData, acquisitionDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Appraisal Section */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="font-medium text-slate-700">Appraisal Information</h4>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="appValue">Appraisal Value</Label>
            <Input
              id="appValue"
              type="number"
              placeholder="0.00"
              value={formData.appraisalValue}
              onChange={(e) => setFormData({ ...formData, appraisalValue: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="appCurrency">Currency</Label>
            <Select value={formData.appraisalCurrency} onValueChange={(value) => setFormData({ ...formData, appraisalCurrency: value })}>
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
          <Label>Appraisal Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${formData.appraisalDate ? "" : "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.appraisalDate ? format(formData.appraisalDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.appraisalDate}
                onSelect={(date) => setFormData({ ...formData, appraisalDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="appEntity">Appraised By</Label>
          <Input
            id="appEntity"
            placeholder="Appraiser name or organization"
            value={formData.appraisalEntity}
            onChange={(e) => setFormData({ ...formData, appraisalEntity: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
