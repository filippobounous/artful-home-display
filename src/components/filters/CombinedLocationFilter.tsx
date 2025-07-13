import { MultiSelectFilter } from '@/components/MultiSelectFilter';
import { useSettingsState } from '@/hooks/useSettingsState';
import type { CheckedState } from '@radix-ui/react-checkbox';

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
    const house = houses.find((h) => h.id === permanentHouse);
    if (!house) return null;
    const roomOptions = house.rooms.map((room) => ({
      id: `${house.id}|${room.id}`,
      name: `${room.name} (${house.name})`,
    }));

    return (
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Rooms
        </label>
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
  const visibleHouses = houses.filter((h) => h.visible);
  const combinedOptions = visibleHouses.flatMap((house) => {
    const roomIds = house.rooms
      .filter((r) => r.visible)
      .map((r) => `${house.id}|${r.id}`);
    const selectedRooms = selectedRoom.filter((id) => roomIds.includes(id));
    const allSelected =
      selectedRooms.length === roomIds.length && roomIds.length > 0;
    const checkState: CheckedState =
      selectedHouse.includes(house.id) || allSelected
        ? true
        : selectedRooms.length > 0
          ? 'indeterminate'
          : false;
    return [
      {
        id: house.id,
        name: house.name,
        header: true,
        checkState,
        onCheckChange: (checked: CheckedState) => {
          if (!permanentHouse) {
            if (checked) {
              const allIds = house.rooms.map((r) => `${house.id}|${r.id}`);
              if (!selectedHouse.includes(house.id)) {
                setSelectedHouse([...selectedHouse, house.id]);
              }
              setSelectedRoom([
                ...selectedRoom.filter((r) => !r.startsWith(`${house.id}|`)),
                ...allIds,
              ]);
            } else {
              setSelectedHouse(selectedHouse.filter((h) => h !== house.id));
              setSelectedRoom(
                selectedRoom.filter((r) => !r.startsWith(`${house.id}|`)),
              );
            }
          }
        },
      },
      ...house.rooms
        .filter((r) => r.visible)
        .map((room) => ({
          id: `${house.id}|${room.id}`,
          name: `${room.name} (${house.name})`,
          indent: true,
        })),
    ];
  });

  // Combine selected values for display
  const allSelectedValues = [...selectedHouse, ...selectedRoom];

  // Determine how many logical selections exist for badge display
  const selectedCount = visibleHouses.reduce((cnt, house) => {
    const roomKeys = house.rooms
      .filter((r) => r.visible)
      .map((r) => `${house.id}|${r.id}`);
    const selectedRooms = selectedRoom.filter((r) => roomKeys.includes(r));
    const allSelected =
      selectedRooms.length === roomKeys.length && roomKeys.length > 0;
    if (selectedHouse.includes(house.id) || allSelected) {
      return cnt + 1;
    }
    return cnt + selectedRooms.length;
  }, 0);

  const handleSelectionChange = (values: string[]) => {
    const houseIds: string[] = [];
    const roomIds: string[] = [];

    visibleHouses.forEach((house) => {
      const roomKeys = house.rooms
        .filter((r) => r.visible)
        .map((r) => `${house.id}|${r.id}`);
      const selectedForHouse = values.filter((v) => roomKeys.includes(v));
      const allSelected =
        selectedForHouse.length === roomKeys.length && roomKeys.length > 0;
      const houseSelected = values.includes(house.id);

      if (allSelected || (houseSelected && selectedForHouse.length === 0)) {
        houseIds.push(house.id);
      }

      if (allSelected) {
        roomIds.push(...roomKeys);
      } else {
        roomIds.push(...selectedForHouse);
      }
    });

    setSelectedHouse(houseIds);
    setSelectedRoom(roomIds);
  };

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Houses & Rooms
      </label>
      <MultiSelectFilter
        placeholder="Select houses or rooms"
        options={combinedOptions}
        selectedValues={allSelectedValues}
        onSelectionChange={handleSelectionChange}
        selectedCount={selectedCount}
      />
    </div>
  );
}
