import { createHierarchicalSettingsSelector } from '@/components/createHierarchicalSettingsSelector';
import type { HouseConfig, RoomConfig } from '@/types/inventory';

interface HierarchicalHouseRoomSelectorProps {
  selectedHouse: string;
  selectedRoom: string;
  onSelectionChange: (house: string, room: string) => void;
  invalid?: boolean;
}

const HouseRoomSelector = createHierarchicalSettingsSelector<
  HouseConfig,
  RoomConfig
>({
  label: 'Location (House - Room) *',
  labelFor: 'houseRoom',
  placeholder: 'Select house and room',
  selectParents: (state) => state.houses,
  getChildren: (house) => house.rooms,
  requireChildSelection: true,
  isParentVisible: (house) => Boolean(house.visible),
  isChildVisible: (room) => Boolean(room.visible),
});

export function HierarchicalHouseRoomSelector({
  selectedHouse,
  selectedRoom,
  onSelectionChange,
  invalid = false,
}: HierarchicalHouseRoomSelectorProps) {
  return (
    <HouseRoomSelector
      selectedParent={selectedHouse}
      selectedChild={selectedRoom}
      onSelectionChange={onSelectionChange}
      invalid={invalid}
    />
  );
}
