
import { MultiSelectFilter } from "@/components/MultiSelectFilter";
import { useSettingsState } from "@/hooks/useSettingsState";
import type { CheckboxCheckedState } from "@radix-ui/react-checkbox";

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
    const roomOptions = house.rooms.map(room => ({
      id: `${house.id}|${room.id}`,
      name: `${room.name} (${house.name})`
    }));

    return (
      <div className="md:col-span-2">
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

  // Create combined options with headers as tri-state checkboxes
  const combinedOptions = houses.flatMap(house => {
    const roomIds = house.rooms.map(r => `${house.id}|${r.id}`);
    const selectedRooms = selectedRoom.filter(id => roomIds.includes(id));
    const checkState: CheckboxCheckedState = selectedHouse.includes(house.id)
      ? true
      : selectedRooms.length > 0
        ? "indeterminate"
        : false;
    return [
      {
        id: house.id,
        name: house.name,
        header: true,
        checkState,
        onCheckChange: (checked: CheckboxCheckedState) => {
          if (!permanentHouse) {
            if (checked) {
              if (!selectedHouse.includes(house.id)) {
                setSelectedHouse([...selectedHouse, house.id]);
              }
            } else {
              setSelectedHouse(selectedHouse.filter(h => h !== house.id));
            }
          }
        }
      },
      ...house.rooms.map(room => ({
        id: `${house.id}|${room.id}`,
        name: `${room.name} (${house.name})`,
        indent: true
      }))
    ];
  });

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
        const [houseId, roomId] = value.split('|');
        if (houseId && roomId) {
          if (!houseIds.includes(houseId)) {
            houseIds.push(houseId);
          }
          roomIds.push(`${houseId}|${roomId}`);
        }
      }
    });

    setSelectedHouse(houseIds);
    setSelectedRoom(roomIds);
  };

  return (
    <div className="md:col-span-2">
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
