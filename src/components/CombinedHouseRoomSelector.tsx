
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { houseConfigs } from "@/types/inventory";

interface CombinedHouseRoomSelectorProps {
  selectedHouse: string;
  selectedRoom: string;
  onSelectionChange: (house: string, room: string) => void;
}

export function CombinedHouseRoomSelector({ 
  selectedHouse, 
  selectedRoom, 
  onSelectionChange 
}: CombinedHouseRoomSelectorProps) {
  // Create combined options
  const combinedOptions = houseConfigs.flatMap(house => 
    house.rooms.map(room => ({
      value: `${house.id}|${room.id}`,
      label: `${house.name} - ${room.name}`,
      houseId: house.id,
      roomId: room.id
    }))
  );

  const currentValue = selectedHouse && selectedRoom ? `${selectedHouse}|${selectedRoom}` : "";

  const handleSelectionChange = (value: string) => {
    if (value) {
      const [houseId, roomId] = value.split('|');
      onSelectionChange(houseId, roomId);
    } else {
      onSelectionChange("", "");
    }
  };

  return (
    <div>
      <Label htmlFor="houseRoom">Location (House - Room) *</Label>
      <Select
        value={currentValue}
        onValueChange={handleSelectionChange}
      >
        <SelectTrigger
          className={currentValue ? undefined : "text-muted-foreground"}
        >
          <SelectValue placeholder="Select house and room" />
        </SelectTrigger>
        <SelectContent>
          {combinedOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
