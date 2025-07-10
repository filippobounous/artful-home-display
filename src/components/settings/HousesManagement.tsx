
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { IconSelector } from "@/components/IconSelector";
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import { HouseConfig, RoomConfig } from "@/types/inventory";

interface HousesManagementProps {
  houses: HouseConfig[];
  onAddHouse: (house: Omit<HouseConfig, 'id' | 'rooms'>) => void;
  onAddRoom: (houseId: string, room: Omit<RoomConfig, 'id'>) => void;
  onEditRoom: (houseId: string, roomId: string, updates: Partial<RoomConfig>) => void;
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
  onToggleHouse,
  onToggleRoom
}: HousesManagementProps) {
  const [newHouse, setNewHouse] = useState({
    name: '',
    country: '',
    address: '',
    yearBuilt: '',
    code: '',
    icon: 'home'
  });
  const [newRoom, setNewRoom] = useState({ name: '', houseId: '' });
  const [editingRoom, setEditingRoom] = useState<{ houseId: string; room: RoomConfig } | null>(null);
  const [editingHouse, setEditingHouse] = useState<HouseConfig | null>(null);
  const [showAddHouse, setShowAddHouse] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);

  const handleAddHouse = () => {
    if (!newHouse.name.trim()) return;
    onAddHouse({
      name: newHouse.name,
      country: newHouse.country,
      address: newHouse.address,
      yearBuilt: newHouse.yearBuilt ? parseInt(newHouse.yearBuilt) : undefined,
      code: newHouse.code,
      icon: newHouse.icon,
      visible: true
    });
    setNewHouse({
      name: '',
      country: '',
      address: '',
      yearBuilt: '',
      code: '',
      icon: 'home'
    });
    setShowAddHouse(false);
  };

  const handleAddRoom = () => {
    if (!newRoom.name.trim() || !newRoom.houseId) return;
    onAddRoom(newRoom.houseId, { 
      name: newRoom.name, 
      floor: 1,
      version: 1,
      is_deleted: false,
      visible: true 
    });
    setNewRoom({ name: '', houseId: '' });
    setShowAddRoom(false);
  };

  const handleEditRoom = () => {
    if (!editingRoom || !editingRoom.room.name.trim()) return;
    onEditRoom(editingRoom.houseId, editingRoom.room.id, { name: editingRoom.room.name });
    setEditingRoom(null);
  };

  const handleEditHouse = () => {
    if (!editingHouse || !editingHouse.name.trim()) return;
    onEditHouse(editingHouse.id, {
      name: editingHouse.name,
      country: editingHouse.country,
      address: editingHouse.address,
      yearBuilt: editingHouse.yearBuilt,
      code: editingHouse.code,
      icon: editingHouse.icon
    });
    setEditingHouse(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Houses & Rooms</h4>
        <div className="flex gap-2">
          <Dialog open={showAddRoom} onOpenChange={setShowAddRoom}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Room
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Room</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="house-select">House</Label>
                  <select
                    id="house-select"
                    className="w-full p-2 border rounded"
                    value={newRoom.houseId}
                    onChange={(e) => setNewRoom({ ...newRoom, houseId: e.target.value })}
                  >
                    <option value="">Select a house</option>
                    {houses.map(house => (
                      <option key={house.id} value={house.id}>{house.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="room-name">Room Name</Label>
                  <Input
                    id="room-name"
                    value={newRoom.name}
                    onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                    placeholder="e.g., Living Room, Kitchen"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddRoom(false)}>Cancel</Button>
                  <Button onClick={handleAddRoom}>Add Room</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showAddHouse} onOpenChange={setShowAddHouse}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add House
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New House</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="house-name">House Name</Label>
                  <Input
                    id="house-name"
                    value={newHouse.name}
                    onChange={(e) => setNewHouse({ ...newHouse, name: e.target.value })}
                    placeholder="e.g., Main House, Studio"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={newHouse.country}
                      onChange={(e) => setNewHouse({ ...newHouse, country: e.target.value })}
                      placeholder="e.g., France"
                    />
                  </div>
                  <div>
                    <Label htmlFor="code">Code</Label>
                    <Input
                      id="code"
                      value={newHouse.code}
                      onChange={(e) => setNewHouse({ ...newHouse, code: e.target.value })}
                      placeholder="e.g., MH"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={newHouse.address}
                    onChange={(e) => setNewHouse({ ...newHouse, address: e.target.value })}
                    placeholder="Full address"
                  />
                </div>
                <div>
                  <Label htmlFor="year-built">Year Built</Label>
                  <Input
                    id="year-built"
                    value={newHouse.yearBuilt}
                    onChange={(e) => setNewHouse({ ...newHouse, yearBuilt: e.target.value })}
                    placeholder="e.g., 1985"
                  />
                </div>
                <div>
                  <Label>Icon</Label>
                  <IconSelector
                    selectedIcon={newHouse.icon}
                    onIconSelect={(icon) => setNewHouse({ ...newHouse, icon })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddHouse(false)}>Cancel</Button>
                  <Button onClick={handleAddHouse}>Add House</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        {houses.map((house) => (
          <Card key={house.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <CardTitle className="text-lg">{house.name}</CardTitle>
                    <span className="text-sm text-gray-500">({house.country})</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={house.visible}
                    onCheckedChange={() => onToggleHouse(house.id)}
                  />
                  {house.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => setEditingHouse(house)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit House</DialogTitle>
                      </DialogHeader>
                      {editingHouse && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="edit-house-name">House Name</Label>
                            <Input
                              id="edit-house-name"
                              value={editingHouse.name}
                              onChange={(e) => setEditingHouse({ ...editingHouse, name: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit-country">Country</Label>
                              <Input
                                id="edit-country"
                                value={editingHouse.country}
                                onChange={(e) => setEditingHouse({ ...editingHouse, country: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-code">Code</Label>
                              <Input
                                id="edit-code"
                                value={editingHouse.code || ''}
                                onChange={(e) => setEditingHouse({ ...editingHouse, code: e.target.value })}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="edit-address">Address</Label>
                            <Input
                              id="edit-address"
                              value={editingHouse.address || ''}
                              onChange={(e) => setEditingHouse({ ...editingHouse, address: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-year-built">Year Built</Label>
                            <Input
                              id="edit-year-built"
                              value={editingHouse.yearBuilt ? editingHouse.yearBuilt.toString() : ''}
                              onChange={(e) => setEditingHouse({ ...editingHouse, yearBuilt: e.target.value ? parseInt(e.target.value) : undefined })}
                            />
                          </div>
                          <div>
                            <Label>Icon</Label>
                            <IconSelector
                              selectedIcon={editingHouse.icon}
                              onIconSelect={(icon) => setEditingHouse({ ...editingHouse, icon })}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setEditingHouse(null)}>Cancel</Button>
                            <Button onClick={handleEditHouse}>Save Changes</Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h5 className="font-medium text-sm text-gray-700 mb-3">Rooms</h5>
                {house.rooms.filter(room => !room.is_deleted).map((room) => (
                  <div key={room.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-3 h-3 text-gray-400" />
                      <span className="text-sm">{room.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={room.visible}
                        onCheckedChange={() => onToggleRoom(house.id, room.id)}
                      />
                      {room.visible ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3" />
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingRoom({ houseId: house.id, room })}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Room</DialogTitle>
                          </DialogHeader>
                          {editingRoom && (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="edit-room-name">Room Name</Label>
                                <Input
                                  id="edit-room-name"
                                  value={editingRoom.room.name}
                                  onChange={(e) =>
                                    setEditingRoom({
                                      ...editingRoom,
                                      room: { ...editingRoom.room, name: e.target.value }
                                    })
                                  }
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setEditingRoom(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleEditRoom}>Save Changes</Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Room</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{room.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDeleteRoom(house.id, room.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
