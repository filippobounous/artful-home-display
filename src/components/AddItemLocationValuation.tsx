
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CombinedHouseRoomSelector } from "./CombinedHouseRoomSelector";

interface AddItemLocationValuationProps {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
}

export function AddItemLocationValuation({ formData, setFormData }: AddItemLocationValuationProps) {
  const handleLocationChange = (house: string, room: string) => {
    setFormData(prev => ({ ...prev, house, room }));
  };

  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "CHF", name: "Swiss Franc" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "SEK", name: "Swedish Krona" },
    { code: "NOK", name: "Norwegian Krone" },
    { code: "DKK", name: "Danish Krone" },
    { code: "NZD", name: "New Zealand Dollar" }
  ];

  return (
    <div className="space-y-4">
      <CombinedHouseRoomSelector
        selectedHouse={formData.house}
        selectedRoom={formData.room}
        onSelectionChange={handleLocationChange}
      />

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
            {currencies.map(currency => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </SelectItem>
            ))}
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
  );
}
