import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconSelector } from '@/components/IconSelector';
import { countries } from '@/lib/countries';
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { HouseConfig, RoomConfig } from '@/types/inventory';
import { RoomDeletionDialog } from './RoomDeletionDialog';
import { useSettingsState } from '@/hooks/useSettingsState';

interface HousesManagementProps {
  houses: HouseConfig[];
  onAddHouse: (house: Omit<HouseConfig, 'id' | 'rooms'>) => void;
  onAddRoom: (
    houseId: string,
    room: Partial<RoomConfig> & { name: string; floor: number },
  ) => void;
  onEditRoom: (
    houseId: string,
    roomId: string,
    updates: Partial<RoomConfig>,
  ) => void;
  onEditHouse: (houseId: string, updates: Partial<HouseConfig>) => void;
  onDeleteRoom: (houseId: string, roomId: string) => void;
  onMoveHouse: (dragIndex: number, hoverIndex: number) => void;
  onMoveRoom: (houseId: string, dragIndex: number, hoverIndex: number) => void;
  onToggleHouse: (houseId: string) => void;
  onToggleRoom: (houseId: string, roomId: string) => void;
}

export function HousesManagement({
  houses,
  onAddHouse,
  onAddRoom,
  onEditRoom,
  onEditHouse,
  onDeleteRoom,
  onMoveHouse,
  onMoveRoom,
  onToggleHouse,
  onToggleRoom,
}: HousesManagementProps) {
  const { getLinkedItems, deleteRoomWithReassignment, validateRoom } =
    useSettingsState();

  const [newHouse, setNewHouse] = useState({
    name: '',
    country: '',
    city: '',
    address: '',
    code: '',
    icon: 'home',
    postal_code: '',
    latitude: undefined,
    longitude: undefined,
    description: '',
    notes: '',
    beneficiary: [] as string[],
    version: 1,
    visible: true,
    is_deleted: false,
  });

  const [editingHouse, setEditingHouse] = useState<HouseConfig | null>(null);
  const [newRoom, setNewRoom] = useState({
    name: '',
    floor: 0,
    room_type: '',
    area_sqm: undefined,
    windows: undefined,
    doors: undefined,
    description: '',
    notes: '',
    code: '',
  });
  const [editingRoom, setEditingRoom] = useState<{
    house: HouseConfig;
    room: RoomConfig;
  } | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<{
    house: HouseConfig;
    room: RoomConfig;
  } | null>(null);
  const [showAddHouse, setShowAddHouse] = useState(false);
  const [showAddHouseValidation, setShowAddHouseValidation] = useState(false);
  const [showEditHouse, setShowEditHouse] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState<{
    houseId: string;
    houseCode: string;
  } | null>(null);
  const [showEditRoom, setShowEditRoom] = useState(false);
  const [collapsedHouses, setCollapsedHouses] = useState<Set<string>>(
    new Set(),
  );
  const [draggedHouse, setDraggedHouse] = useState<number | null>(null);
  const [roomError, setRoomError] = useState<string>('');
  const [showHouseValidation, setShowHouseValidation] = useState(false);
  const [showAddRoomValidation, setShowAddRoomValidation] = useState(false);
  const [showRoomValidation, setShowRoomValidation] = useState(false);

  const handleAddHouse = () => {
    try {
      onAddHouse(newHouse);
      setNewHouse({
        name: '',
        country: '',
        city: '',
        address: '',
        code: '',
        icon: 'home',
        postal_code: '',
        latitude: undefined,
        longitude: undefined,
        description: '',
        notes: '',
        beneficiary: [],
        version: 1,
        visible: true,
        is_deleted: false,
      });
      setShowAddHouse(false);
      setShowAddHouseValidation(false);
    } catch (error) {
      console.error('Error adding house:', error);
      setShowAddHouseValidation(true);
    }
  };

  const handleEditHouse = () => {
    if (!editingHouse) return;
    try {
      onEditHouse(editingHouse.id, editingHouse);
      setEditingHouse(null);
      setShowEditHouse(false);
      setShowHouseValidation(false);
    } catch (error) {
      console.error('Error editing house:', error);
      setShowHouseValidation(true);
    }
  };

  const handleAddRoom = () => {
    if (!showAddRoom) return;
    try {
      onAddRoom(showAddRoom.houseId, {
        ...newRoom,
        house_code: showAddRoom.houseCode,
      });
      setNewRoom({
        name: '',
        floor: 0,
        room_type: '',
        area_sqm: undefined,
        windows: undefined,
        doors: undefined,
        description: '',
        notes: '',
        code: '',
      });
      setShowAddRoom(null);
      setShowAddRoomValidation(false);
    } catch (error) {
      console.error('Error adding room:', error);
      setShowAddRoomValidation(true);
    }
  };

  const handleEditRoom = () => {
    if (!editingRoom) return;

    // Validate required fields
    const validationErrors = validateRoom(editingRoom.room);
    if (validationErrors.length > 0) {
      setRoomError(validationErrors.join(', '));
      setShowRoomValidation(true);
      return;
    }

    try {
      onEditRoom(editingRoom.house.id, editingRoom.room.id, editingRoom.room);
      setEditingRoom(null);
      setShowEditRoom(false);
      setRoomError('');
      setShowRoomValidation(false);
    } catch (error) {
      console.error('Error editing room:', error);
      setRoomError(
        error instanceof Error ? error.message : 'Unknown error occurred',
      );
    }
  };

  const handleDeleteRoom = (house: HouseConfig, room: RoomConfig) => {
    const linkedItems = getLinkedItems(house.id, room.id);
    setRoomToDelete({ house, room });
  };

  const handleConfirmDelete = () => {
    if (!roomToDelete) return;
    try {
      onDeleteRoom(roomToDelete.house.id, roomToDelete.room.id);
      setRoomToDelete(null);
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const handleReassignItems = (newHouseId: string, newRoomId: string) => {
    if (!roomToDelete) return;
    deleteRoomWithReassignment(
      roomToDelete.house.id,
      roomToDelete.room.id,
      newHouseId,
      newRoomId,
    );
    setRoomToDelete(null);
  };

  const toggleHouseCollapse = (houseId: string) => {
    const newCollapsed = new Set(collapsedHouses);
    if (newCollapsed.has(houseId)) {
      newCollapsed.delete(houseId);
    } else {
      newCollapsed.add(houseId);
    }
    setCollapsedHouses(newCollapsed);
  };

  const handleHouseDragStart = (e: React.DragEvent, index: number) => {
    setDraggedHouse(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleHouseDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleHouseDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedHouse !== null && draggedHouse !== dropIndex) {
      onMoveHouse(draggedHouse, dropIndex);
    }
    setDraggedHouse(null);
  };

  const handleRoomDragStart = (
    e: React.DragEvent,
    houseId: string,
    roomIndex: number,
  ) => {
    e.dataTransfer.setData('text/plain', `${houseId}:${roomIndex}`);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleRoomDrop = (
    e: React.DragEvent,
    houseId: string,
    dropIndex: number,
  ) => {
    e.preventDefault();
    const dragData = e.dataTransfer.getData('text/plain');
    const [dragHouseId, dragRoomIndex] = dragData.split(':');

    if (dragHouseId === houseId && parseInt(dragRoomIndex) !== dropIndex) {
      onMoveRoom(houseId, parseInt(dragRoomIndex), dropIndex);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Houses & Rooms</h4>
        <Dialog
          open={showAddHouse}
          onOpenChange={(open) => {
            setShowAddHouse(open);
            if (!open) setShowAddHouseValidation(false);
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add House
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New House</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="house-name">House Name *</Label>
                <Input
                  id="house-name"
                  value={newHouse.name}
                  onChange={(e) =>
                    setNewHouse({ ...newHouse, name: e.target.value })
                  }
                  placeholder="e.g., Main House"
                />
                {showAddHouseValidation && !newHouse.name.trim() && (
                  <p className="text-destructive text-sm mt-1">
                    This field is required
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="house-country">Country *</Label>
                <Select
                  value={newHouse.country}
                  onValueChange={(value) =>
                    setNewHouse({ ...newHouse, country: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {showAddHouseValidation && !newHouse.country.trim() && (
                  <p className="text-destructive text-sm mt-1">
                    This field is required
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="house-city">City *</Label>
                <Input
                  id="house-city"
                  value={newHouse.city}
                  onChange={(e) =>
                    setNewHouse({ ...newHouse, city: e.target.value })
                  }
                  placeholder="e.g., New York"
                />
                {showAddHouseValidation && !newHouse.city.trim() && (
                  <p className="text-destructive text-sm mt-1">
                    This field is required
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="house-code">Code * (4 characters)</Label>
                <Input
                  id="house-code"
                  value={newHouse.code}
                  onChange={(e) =>
                    setNewHouse({
                      ...newHouse,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="e.g., MH01"
                  maxLength={4}
                />
                {showAddHouseValidation && !newHouse.code.trim() && (
                  <p className="text-destructive text-sm mt-1">
                    This field is required
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <Label htmlFor="house-address">Address</Label>
                <Input
                  id="house-address"
                  value={newHouse.address}
                  onChange={(e) =>
                    setNewHouse({ ...newHouse, address: e.target.value })
                  }
                  placeholder="e.g., 123 Main Street"
                />
              </div>
              <div>
                <Label htmlFor="house-postal">Postal Code</Label>
                <Input
                  id="house-postal"
                  value={newHouse.postal_code}
                  onChange={(e) =>
                    setNewHouse({ ...newHouse, postal_code: e.target.value })
                  }
                  placeholder="e.g., 10001"
                />
              </div>
              <div>
                <Label htmlFor="house-lat">Latitude</Label>
                <Input
                  id="house-lat"
                  type="number"
                  step="any"
                  value={newHouse.latitude || ''}
                  onChange={(e) =>
                    setNewHouse({
                      ...newHouse,
                      latitude: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="e.g., 40.7128"
                />
              </div>
              <div>
                <Label htmlFor="house-lng">Longitude</Label>
                <Input
                  id="house-lng"
                  type="number"
                  step="any"
                  value={newHouse.longitude || ''}
                  onChange={(e) =>
                    setNewHouse({
                      ...newHouse,
                      longitude: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="e.g., -74.0060"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="house-beneficiary">
                  Beneficiary (comma separated)
                </Label>
                <Input
                  id="house-beneficiary"
                  value={newHouse.beneficiary.join(', ')}
                  onChange={(e) =>
                    setNewHouse({
                      ...newHouse,
                      beneficiary: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter((s) => s),
                    })
                  }
                  placeholder="e.g., John Doe, Jane Smith"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="house-description">Description</Label>
                <Textarea
                  id="house-description"
                  value={newHouse.description}
                  onChange={(e) =>
                    setNewHouse({ ...newHouse, description: e.target.value })
                  }
                  placeholder="Brief description of the house"
                  rows={3}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="house-notes">Notes</Label>
                <Textarea
                  id="house-notes"
                  value={newHouse.notes}
                  onChange={(e) =>
                    setNewHouse({ ...newHouse, notes: e.target.value })
                  }
                  placeholder="Additional notes"
                  rows={3}
                />
              </div>
              <div className="col-span-2">
                <Label>Icon</Label>
                <IconSelector
                  selectedIcon={newHouse.icon}
                  onIconSelect={(icon) => setNewHouse({ ...newHouse, icon })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowAddHouse(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddHouse}>Add House</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {houses.map((house, houseIndex) => (
          <Card
            key={house.id}
            draggable
            onDragStart={(e) => handleHouseDragStart(e, houseIndex)}
            onDragOver={handleHouseDragOver}
            onDrop={(e) => handleHouseDrop(e, houseIndex)}
            className="cursor-move border-border bg-card"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{house.name}</CardTitle>
                      <span className="text-sm font-mono bg-muted text-muted-foreground px-2 py-1 rounded">
                        {house.code}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {house.address && `${house.address}, `}
                      {house.city}, {house.country}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingHouse(house);
                      setShowEditHouse(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Switch
                    checked={house.visible}
                    onCheckedChange={() => onToggleHouse(house.id)}
                  />
                  {house.visible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Collapsible
                open={!collapsedHouses.has(house.id)}
                onOpenChange={() => toggleHouseCollapse(house.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-0 h-auto"
                  >
                    <h5 className="font-medium text-sm text-muted-foreground">
                      Rooms ({house.rooms.length})
                    </h5>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAddRoom({
                            houseId: house.id,
                            houseCode: house.code,
                          });
                        }}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      {collapsedHouses.has(house.id) ? (
                        <ChevronRight className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-3">
                  {house.rooms.map((room, roomIndex) => (
                    <div
                      key={room.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-move border border-border"
                      draggable
                      onDragStart={(e) =>
                        handleRoomDragStart(e, house.id, roomIndex)
                      }
                      onDragOver={handleHouseDragOver}
                      onDrop={(e) => handleRoomDrop(e, house.id, roomIndex)}
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{room.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingRoom({ house, room });
                            setShowEditRoom(true);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Switch
                          checked={room.visible}
                          onCheckedChange={() =>
                            onToggleRoom(house.id, room.id)
                          }
                        />
                        {room.visible ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRoom(house, room)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit House Dialog */}
      <Dialog open={showEditHouse} onOpenChange={setShowEditHouse}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-background">
          <DialogHeader>
            <DialogTitle>Edit House</DialogTitle>
          </DialogHeader>
          {editingHouse && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-house-name">House Name *</Label>
                <Input
                  id="edit-house-name"
                  value={editingHouse.name}
                  onChange={(e) =>
                    setEditingHouse({ ...editingHouse, name: e.target.value })
                  }
                  placeholder="e.g., Main House"
                />
                {showHouseValidation && !editingHouse.name.trim() && (
                  <p className="text-destructive text-sm mt-1">
                    This field is required
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-house-country">Country *</Label>
                <Select
                  value={editingHouse.country}
                  onValueChange={(value) =>
                    setEditingHouse({ ...editingHouse, country: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {showHouseValidation && !editingHouse.country.trim() && (
                  <p className="text-destructive text-sm mt-1">
                    This field is required
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-house-city">City *</Label>
                <Input
                  id="edit-house-city"
                  value={editingHouse.city}
                  onChange={(e) =>
                    setEditingHouse({ ...editingHouse, city: e.target.value })
                  }
                  placeholder="e.g., New York"
                />
                {showHouseValidation && !editingHouse.city.trim() && (
                  <p className="text-destructive text-sm mt-1">
                    This field is required
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-house-code">Code * (4 characters)</Label>
                {/* Code cannot be edited once set */}
                <Input
                  id="edit-house-code"
                  value={editingHouse.code}
                  disabled
                  placeholder="e.g., MH01"
                  maxLength={4}
                />
                {showHouseValidation && !editingHouse.code.trim() && (
                  <p className="text-destructive text-sm mt-1">
                    This field is required
                  </p>
                )}
              </div>
              <div className="col-span-2 grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="edit-house-address">Address</Label>
                  <Input
                    id="edit-house-address"
                    value={editingHouse.address || ''}
                    onChange={(e) =>
                      setEditingHouse({
                        ...editingHouse,
                        address: e.target.value,
                      })
                    }
                    placeholder="e.g., 123 Main Street"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-house-postal">Postal Code</Label>
                  <Input
                    id="edit-house-postal"
                    value={editingHouse.postal_code || ''}
                    onChange={(e) =>
                      setEditingHouse({
                        ...editingHouse,
                        postal_code: e.target.value,
                      })
                    }
                    placeholder="e.g., 10001"
                  />
                </div>
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-house-lat">Latitude</Label>
                  <Input
                    id="edit-house-lat"
                    type="number"
                    step="any"
                    value={editingHouse.latitude || ''}
                    onChange={(e) =>
                      setEditingHouse({
                        ...editingHouse,
                        latitude: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="e.g., 40.7128"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-house-lng">Longitude</Label>
                  <Input
                    id="edit-house-lng"
                    type="number"
                    step="any"
                    value={editingHouse.longitude || ''}
                    onChange={(e) =>
                      setEditingHouse({
                        ...editingHouse,
                        longitude: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="e.g., -74.0060"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-house-beneficiary">
                  Beneficiary (comma separated)
                </Label>
                <Input
                  id="edit-house-beneficiary"
                  value={editingHouse.beneficiary?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingHouse({
                      ...editingHouse,
                      beneficiary: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter((s) => s),
                    })
                  }
                  placeholder="e.g., John Doe, Jane Smith"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-house-description">Description</Label>
                <Textarea
                  id="edit-house-description"
                  value={editingHouse.description || ''}
                  onChange={(e) =>
                    setEditingHouse({
                      ...editingHouse,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description of the house"
                  rows={3}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-house-notes">Notes</Label>
                <Textarea
                  id="edit-house-notes"
                  value={editingHouse.notes || ''}
                  onChange={(e) =>
                    setEditingHouse({ ...editingHouse, notes: e.target.value })
                  }
                  placeholder="Additional notes"
                  rows={3}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowEditHouse(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditHouse}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Room Dialog */}
      <Dialog
        open={!!showAddRoom}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddRoom(null);
            setShowAddRoomValidation(false);
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="room-name">Room Name *</Label>
              <Input
                id="room-name"
                value={newRoom.name}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, name: e.target.value })
                }
                placeholder="e.g., Living Room"
              />
              {showAddRoomValidation && !newRoom.name.trim() && (
                <p className="text-destructive text-sm mt-1">
                  This field is required
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="room-floor">Floor *</Label>
              <Input
                id="room-floor"
                type="number"
                value={newRoom.floor}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, floor: parseInt(e.target.value) })
                }
                placeholder="e.g., 1"
              />
              {showAddRoomValidation &&
                (newRoom.floor === undefined || isNaN(newRoom.floor)) && (
                  <p className="text-destructive text-sm mt-1">
                    This field is required
                  </p>
                )}
            </div>
            <div>
              <Label htmlFor="room-type">Room Type</Label>
              <Select
                value={newRoom.room_type}
                onValueChange={(value) =>
                  setNewRoom({ ...newRoom, room_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="living">Living Room</SelectItem>
                  <SelectItem value="bedroom">Bedroom</SelectItem>
                  <SelectItem value="kitchen">Kitchen</SelectItem>
                  <SelectItem value="bathroom">Bathroom</SelectItem>
                  <SelectItem value="dining">Dining Room</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="storage">Storage</SelectItem>
                  <SelectItem value="garage">Garage</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="room-area">Area (sqm)</Label>
              <Input
                id="room-area"
                type="number"
                step="0.1"
                value={newRoom.area_sqm || ''}
                onChange={(e) =>
                  setNewRoom({
                    ...newRoom,
                    area_sqm: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
                placeholder="e.g., 25.5"
              />
            </div>
            <div>
              <Label htmlFor="room-windows">Windows</Label>
              <Input
                id="room-windows"
                type="number"
                value={newRoom.windows || ''}
                onChange={(e) =>
                  setNewRoom({
                    ...newRoom,
                    windows: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                placeholder="e.g., 2"
              />
            </div>
            <div>
              <Label htmlFor="room-doors">Doors</Label>
              <Input
                id="room-doors"
                type="number"
                value={newRoom.doors || ''}
                onChange={(e) =>
                  setNewRoom({
                    ...newRoom,
                    doors: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                placeholder="e.g., 1"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="room-description">Description</Label>
              <Textarea
                id="room-description"
                value={newRoom.description}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, description: e.target.value })
                }
                placeholder="Brief description of the room"
                rows={3}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="room-notes">Notes</Label>
              <Textarea
                id="room-notes"
                value={newRoom.notes}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, notes: e.target.value })
                }
                placeholder="Additional notes"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="room-code">Room Code</Label>
              <Input
                id="room-code"
                value={newRoom.code}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, code: e.target.value })
                }
                placeholder="Auto-generated if empty"
              />
            </div>
            <div>
              <Label>House Code</Label>
              <Input value={showAddRoom?.houseCode || ''} disabled />
              <p className="text-xs text-muted-foreground mt-1">
                Code is auto-generated from the house code.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowAddRoom(null)}>
              Cancel
            </Button>
            <Button onClick={handleAddRoom}>Add Room</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Room Dialog */}
      <Dialog open={showEditRoom} onOpenChange={setShowEditRoom}>
        <DialogContent className="max-w-2xl bg-background">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
          </DialogHeader>
          {editingRoom && (
            <>
              {roomError && (
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Error:</strong> {roomError}
                  </AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-room-name">Room Name *</Label>
                  <Input
                    id="edit-room-name"
                    value={editingRoom.room.name}
                    onChange={(e) =>
                      setEditingRoom({
                        ...editingRoom,
                        room: { ...editingRoom.room, name: e.target.value },
                      })
                    }
                    placeholder="e.g., Living Room"
                  />
                  {showRoomValidation && !editingRoom.room.name.trim() && (
                    <p className="text-destructive text-sm mt-1">
                      This field is required
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="edit-room-floor">Floor *</Label>
                  <Input
                    id="edit-room-floor"
                    type="number"
                    value={editingRoom.room.floor}
                    onChange={(e) =>
                      setEditingRoom({
                        ...editingRoom,
                        room: {
                          ...editingRoom.room,
                          floor: parseInt(e.target.value),
                        },
                      })
                    }
                    placeholder="e.g., 1"
                  />
                  {showRoomValidation &&
                    (editingRoom.room.floor === undefined ||
                      isNaN(editingRoom.room.floor)) && (
                      <p className="text-destructive text-sm mt-1">
                        This field is required
                      </p>
                    )}
                </div>
                <div>
                  <Label htmlFor="edit-room-type">Room Type</Label>
                  <Select
                    value={editingRoom.room.room_type || ''}
                    onValueChange={(value) =>
                      setEditingRoom({
                        ...editingRoom,
                        room: { ...editingRoom.room, room_type: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="living">Living Room</SelectItem>
                      <SelectItem value="bedroom">Bedroom</SelectItem>
                      <SelectItem value="kitchen">Kitchen</SelectItem>
                      <SelectItem value="bathroom">Bathroom</SelectItem>
                      <SelectItem value="dining">Dining Room</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="storage">Storage</SelectItem>
                      <SelectItem value="garage">Garage</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-room-area">Area (sqm)</Label>
                  <Input
                    id="edit-room-area"
                    type="number"
                    step="0.1"
                    value={editingRoom.room.area_sqm || ''}
                    onChange={(e) =>
                      setEditingRoom({
                        ...editingRoom,
                        room: {
                          ...editingRoom.room,
                          area_sqm: e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        },
                      })
                    }
                    placeholder="e.g., 25.5"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-room-windows">Windows</Label>
                  <Input
                    id="edit-room-windows"
                    type="number"
                    value={editingRoom.room.windows || ''}
                    onChange={(e) =>
                      setEditingRoom({
                        ...editingRoom,
                        room: {
                          ...editingRoom.room,
                          windows: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        },
                      })
                    }
                    placeholder="e.g., 2"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-room-doors">Doors</Label>
                  <Input
                    id="edit-room-doors"
                    type="number"
                    value={editingRoom.room.doors || ''}
                    onChange={(e) =>
                      setEditingRoom({
                        ...editingRoom,
                        room: {
                          ...editingRoom.room,
                          doors: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        },
                      })
                    }
                    placeholder="e.g., 1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-room-description">Description</Label>
                  <Textarea
                    id="edit-room-description"
                    value={editingRoom.room.description || ''}
                    onChange={(e) =>
                      setEditingRoom({
                        ...editingRoom,
                        room: {
                          ...editingRoom.room,
                          description: e.target.value,
                        },
                      })
                    }
                    placeholder="Brief description of the room"
                    rows={3}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-room-notes">Notes</Label>
                  <Textarea
                    id="edit-room-notes"
                    value={editingRoom.room.notes || ''}
                    onChange={(e) =>
                      setEditingRoom({
                        ...editingRoom,
                        room: { ...editingRoom.room, notes: e.target.value },
                      })
                    }
                    placeholder="Additional notes"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-room-code">Room Code</Label>
                  <Input
                    id="edit-room-code"
                    value={editingRoom.room.code || ''}
                    onChange={(e) =>
                      setEditingRoom({
                        ...editingRoom,
                        room: { ...editingRoom.room, code: e.target.value },
                      })
                    }
                    placeholder="Auto-generated if empty"
                  />
                </div>
                <div>
                  <Label>House Code</Label>
                  <Input value={editingRoom.house.code} disabled />
                  <p className="text-xs text-muted-foreground mt-1">
                    Code is auto-generated from the house code.
                  </p>
                </div>
              </div>
            </>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditRoom(false);
                setRoomError('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditRoom}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Room Deletion Dialog */}
      <RoomDeletionDialog
        open={!!roomToDelete}
        onOpenChange={(open) => !open && setRoomToDelete(null)}
        room={roomToDelete?.room || null}
        house={roomToDelete?.house || null}
        linkedItemsCount={
          roomToDelete
            ? getLinkedItems(roomToDelete.house.id, roomToDelete.room.id).length
            : 0
        }
        allHouses={houses}
        onConfirmDelete={handleConfirmDelete}
        onReassignItems={handleReassignItems}
      />
    </div>
  );
}
