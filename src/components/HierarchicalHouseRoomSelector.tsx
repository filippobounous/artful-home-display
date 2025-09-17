import { HierarchicalSelector } from '@/components/HierarchicalSelector';
import { useSettingsState } from '@/hooks/useSettingsState';

interface HierarchicalHouseRoomSelectorProps {
  selectedHouse: string;
  selectedRoom: string;
  onSelectionChange: (house: string, room: string) => void;
  invalid?: boolean;
}

export function HierarchicalHouseRoomSelector({
  selectedHouse,
  selectedRoom,
  onSelectionChange,
  invalid = false,
}: HierarchicalHouseRoomSelectorProps) {
  const { houses } = useSettingsState();

  return (
    <HierarchicalSelector
      label="Location (House - Room) *"
      labelFor="houseRoom"
      placeholder="Select house and room"
      parents={houses}
      selectedParent={selectedHouse}
      selectedChild={selectedRoom}
      onSelectionChange={onSelectionChange}
      getChildren={(house) => house.rooms}
      getParentId={(house) => house.id}
      getParentName={(house) => house.name}
      getChildId={(room) => room.id}
      getChildName={(room) => room.name}
      invalid={invalid}
      requireChildSelection
      isParentVisible={(house) => Boolean(house.visible)}
      isChildVisible={(room) => Boolean(room.visible)}
    />
  );
}
