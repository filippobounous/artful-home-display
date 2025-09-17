import { CombinedParentChildSelect } from '@/components/CombinedParentChildSelect';
import { useSettingsState } from '@/hooks/useSettingsState';

interface CombinedHouseRoomSelectorProps {
  selectedHouse: string;
  selectedRoom: string;
  onSelectionChange: (house: string, room: string) => void;
}

export function CombinedHouseRoomSelector({
  selectedHouse,
  selectedRoom,
  onSelectionChange,
}: CombinedHouseRoomSelectorProps) {
  const { houses } = useSettingsState();

  return (
    <CombinedParentChildSelect
      selectId="houseRoom"
      label="Location (House - Room) *"
      placeholder="Select house and room"
      items={houses}
      selectedParentId={selectedHouse}
      selectedChildId={selectedRoom}
      getParentId={(house) => house.id}
      getChildren={(house) => house.rooms}
      getChildId={(room) => room.id}
      buildOptionLabel={(house, room) => `${house.name} - ${room.name}`}
      buildValue={(houseId, roomId) => `${houseId}|${roomId}`}
      parseValue={(value) => {
        const [houseId, roomId] = value.split('|');
        return { parentId: houseId, childId: roomId };
      }}
      buildCurrentValue={(houseId, roomId) =>
        houseId && roomId ? `${houseId}|${roomId}` : ''
      }
      onSelectionChange={onSelectionChange}
    />
  );
}
