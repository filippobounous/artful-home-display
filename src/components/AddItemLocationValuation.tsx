import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { HierarchicalHouseRoomSelector } from "@/components/HierarchicalHouseRoomSelector";
import { HierarchicalCategorySelector } from "@/components/HierarchicalCategorySelector";

interface AddItemLocationValuationProps {
  formData: any;
  setFormData: (data: any) => void;
  errors?: Record<string, string>;
}

export function AddItemLocationValuation({
  formData,
  setFormData,
  errors = {},
}: AddItemLocationValuationProps) {
  const handleLocationChange = (house: string, room: string) => {
    const room_code = room || "";
    setFormData({ ...formData, house, room, room_code });
  };

  const handleCategoryChange = (category: string, subcategory: string) => {
    setFormData({ ...formData, category, subcategory });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-slate-900">
        Category & Location
      </h3>

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

      <HierarchicalHouseRoomSelector
        selectedHouse={formData.house}
        selectedRoom={formData.room}
        onSelectionChange={handleLocationChange}
        invalid={Boolean(errors.room_code)}
      />
      {errors.room_code && (
        <p className="text-destructive text-sm mt-1">{errors.room_code}</p>
      )}

      {/* Acquisition Section */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium text-slate-900">Acquisition</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="acquisition_value">Value</Label>
            <Input
              id="acquisition_value"
              type="number"
              placeholder="0.00"
              value={formData.acquisition_value}
              onChange={(e) =>
                setFormData({ ...formData, acquisition_value: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="acquisition_currency">Currency</Label>
            <Select
              value={formData.acquisition_currency}
              onValueChange={(value) =>
                setFormData({ ...formData, acquisition_currency: value })
              }
            >
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
                className={`w-full justify-start text-left font-normal ${formData.acquisition_date ? "" : "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.acquisition_date
                  ? format(formData.acquisition_date, "PPP")
                  : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.acquisition_date}
                onSelect={(date) =>
                  setFormData({ ...formData, acquisition_date: date })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.acquisition && (
            <p className="text-destructive text-sm mt-1">
              {errors.acquisition}
            </p>
          )}
        </div>
      </div>

      {/* Appraisal Section */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium text-slate-900">Appraisal</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="appraisal_value">Value</Label>
            <Input
              id="appraisal_value"
              type="number"
              placeholder="0.00"
              value={formData.appraisal_value}
              onChange={(e) =>
                setFormData({ ...formData, appraisal_value: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="appraisal_currency">Currency</Label>
            <Select
              value={formData.appraisal_currency}
              onValueChange={(value) =>
                setFormData({ ...formData, appraisal_currency: value })
              }
            >
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
                className={`w-full justify-start text-left font-normal ${formData.appraisal_date ? "" : "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.appraisal_date
                  ? format(formData.appraisal_date, "PPP")
                  : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.appraisal_date}
                onSelect={(date) =>
                  setFormData({ ...formData, appraisal_date: date })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
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
        {errors.appraisal && (
          <p className="text-destructive text-sm mt-1">{errors.appraisal}</p>
        )}
      </div>
    </div>
  );
}
