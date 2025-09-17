import {
  HierarchicalMultiSelectFilter,
  ParentSelectionMode,
} from './HierarchicalMultiSelectFilter';
import { useSettingsState } from '@/hooks/useSettingsState';

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

  return (
    <HierarchicalMultiSelectFilter
      parents={houses}
      getParentId={(house) => house.id}
      getParentName={(house) => house.name}
      getParentVisible={(house) => house.visible}
      getChildren={(house) => house.rooms}
      getChildId={(house, room) => `${house.id}|${room.id}`}
      getChildName={(house, room) => `${room.name} (${house.name})`}
      isChildVisible={(_, room) =>
        permanentHouse ? true : Boolean(room.visible)}
      selectedParentIds={selectedHouse}
      setSelectedParentIds={setSelectedHouse}
      selectedChildIds={selectedRoom}
      setSelectedChildIds={setSelectedRoom}
      permanentParentId={permanentHouse}
      label="Houses & Rooms"
      placeholder="Select houses or rooms"
      childOnlyLabel="Rooms"
      childOnlyPlaceholder="Select rooms"
      parentSelectionMode={ParentSelectionMode.ChildrenControlParent}
    />
  );
}
