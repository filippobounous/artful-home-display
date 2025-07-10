
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettingsState } from "@/hooks/useSettingsState";

interface HierarchicalHouseRoomSelectorProps {
  selectedHouse: string;
  selectedRoom: string;
  onSelectionChange: (house: string, room: string) => void;
}

export function HierarchicalHouseRoomSelector({ 
  selectedHouse, 
  selectedRoom, 
  onSelectionChange 
}: HierarchicalHouseRoomSelectorProps) {
  const { houses } = useSettingsState();

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
          {houses.filter(h => !h.is_deleted).map((house) => (
            <div key={house.id}>
              <div className="px-2 py-1 text-sm font-medium text-slate-600 bg-muted">
                {house.name}
              </div>
              {house.rooms.filter(r => r.visible).map((room) => (
                <SelectItem 
                  key={`${house.id}|${room.id}`} 
                  value={`${house.id}|${room.id}`}
                  className="pl-6"
                >
                  {room.name}
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
