
import { MultiSelectFilter } from "@/components/MultiSelectFilter";
import { useSettingsState } from "@/hooks/useSettingsState";

interface CombinedLocationFilterProps {
  selectedHouse: string[];
  setSelectedHouse: (houses: string[]) => void;
  selectedRoom: string[];
  setSelectedRoom: (rooms: string[]) => void;
  permanentHouse?: string;
}

export function CombinedLocationFilter({
  selectedHouse,
  setSelectedHouse,
  selectedRoom,
  setSelectedRoom,
  permanentHouse,
}: CombinedLocationFilterProps) {
  const { houses } = useSettingsState();

  if (permanentHouse) {
    const house = houses.find(h => h.id === permanentHouse);
    if (!house) return null;
    const roomOptions = house.rooms.map(room => ({ id: room.id, name: room.name }));

    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Rooms</label>
        <MultiSelectFilter
          placeholder="Select rooms"
          options={roomOptions}
          selectedValues={selectedRoom}
          onSelectionChange={setSelectedRoom}
        />
      </div>
    );
  }

  // Create combined options with format "House - Room"
  const combinedOptions = houses.flatMap(house => [
    // Add general house option
    { id: house.id, name: house.name },
    // Add specific room options
    ...house.rooms.map(room => ({
      id: room.id,
      name: `${house.name} - ${room.name}`
    }))
  ]);

  // Combine selected values for display
  const allSelectedValues = [...selectedHouse, ...selectedRoom];
  
  const handleSelectionChange = (values: string[]) => {
    const houseIds: string[] = [];
    const roomIds: string[] = [];
    
    values.forEach(value => {
      const house = houses.find(h => h.id === value);
      if (house) {
        houseIds.push(value);
      } else {
        const room = houses
          .flatMap(h => h.rooms)
          .find(r => r.id === value);
        if (room) {
          roomIds.push(value);
        }
      }
    });
    
    setSelectedHouse(houseIds);
    setSelectedRoom(roomIds);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">Houses & Rooms</label>
      <MultiSelectFilter
        placeholder="Select houses or rooms"
        options={combinedOptions}
        selectedValues={allSelectedValues}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
}
