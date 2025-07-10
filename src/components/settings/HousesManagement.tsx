import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { IconSelector } from "@/components/IconSelector";
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff, ChevronDown, ChevronRight } from "lucide-react";
import { HouseConfig, RoomConfig } from "@/types/inventory";
import { countries } from "@/lib/countries";

interface HousesManagementProps {
  houses: HouseConfig[];
  onAddHouse: (house: Omit<HouseConfig, 'id' | 'rooms' | 'version' | 'is_deleted'>) => void;
  onAddRoom: (houseId: string, room: Omit<RoomConfig, 'id'>) => void;
  onEditRoom: (houseId: string, roomId: string, updates: Partial<RoomConfig>) => void;
  onEditHouse: (houseId: string, updates: Partial<HouseConfig>) => void;
  onDeleteRoom: (houseId: string, roomId: string) => void;
  onMoveHouse: (dragIndex: number, hoverIndex: number) => void;
  onMoveRoom: (houseId: string, dragIndex: number, hoverIndex: number) => void;
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
  onToggleRoom
}: HousesManagementProps) {
  const [newHouse, setNewHouse] = useState({
    name: '',
    code: '',
    icon: 'house',
    city: '',
    country: '',
    address: '',
    postal_code: '',
    beneficiary: '',
    latitude: '',
    longitude: '',
    description: '',
    notes: ''
  });
  const [newRoom, setNewRoom] = useState({ name: '', houseId: '' });
  const [editingRoom, setEditingRoom] = useState<{ houseId: string; room: RoomConfig } | null>(null);
  const [editingHouse, setEditingHouse] = useState<HouseConfig | null>(null);
  const [showAddHouse, setShowAddHouse] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [collapsedHouses, setCollapsedHouses] = useState<Set<string>>(new Set());
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [draggedHouse, setDraggedHouse] = useState<number | null>(null);

  const validateHouse = (house: typeof newHouse) => {
    const errors: Record<string, string> = {};
    
    if (!house.name.trim()) {
      errors.name = 'House name is required';
    }
    
    if (!house.city.trim()) {
      errors.city = 'City is required';
    }

    if (!house.country.trim()) {
      errors.country = 'Country is required';
    }

    if (!house.code.trim()) {
      errors.code = 'House code is required';
    } else if (house.code.length !== 4) {
      errors.code = 'House code must be exactly 4 characters long';
    }
    
    return errors;
  };

  const handleAddHouse = () => {
    const errors = validateHouse(newHouse);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    onAddHouse({
      name: newHouse.name,
      code: newHouse.code.toUpperCase(),
      icon: newHouse.icon,
      city: newHouse.city,
      country: newHouse.country,
      address: newHouse.address,
      postal_code: newHouse.postal_code,
      beneficiary: newHouse.beneficiary
        ? newHouse.beneficiary.split(',').map(b => b.trim())
        : undefined,
      latitude: newHouse.latitude ? parseFloat(newHouse.latitude) : undefined,
      longitude: newHouse.longitude ? parseFloat(newHouse.longitude) : undefined,
      description: newHouse.description || undefined,
      notes: newHouse.notes || undefined,
      version: 1,
      is_deleted: false
    });
    setNewHouse({
      name: '',
      code: '',
      icon: 'house',
      city: '',
      country: '',
      address: '',
      postal_code: '',
      beneficiary: '',
      latitude: '',
      longitude: '',
      description: '',
      notes: ''
    });
    setValidationErrors({});
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
    if (!editingHouse) return;
    const errors = validateHouse({
      name: editingHouse.name,
      code: editingHouse.code || '',
      city: editingHouse.city,
      country: editingHouse.country,
      address: editingHouse.address || '',
      postal_code: editingHouse.postal_code || '',
      beneficiary: '',
      latitude: '',
      longitude: '',
      description: '',
      notes: ''
    });
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    onEditHouse(editingHouse.id, {
      name: editingHouse.name,
      code: editingHouse.code?.toUpperCase(),
      icon: editingHouse.icon,
      city: editingHouse.city,
      country: editingHouse.country,
      address: editingHouse.address,
      postal_code: editingHouse.postal_code,
      beneficiary: editingHouse.beneficiary,
      latitude: editingHouse.latitude,
      longitude: editingHouse.longitude,
      description: editingHouse.description,
      notes: editingHouse.notes
    });
    setValidationErrors({});
    setEditingHouse(null);
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

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedHouse(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedHouse !== null && draggedHouse !== dropIndex) {
      onMoveHouse(draggedHouse, dropIndex);
    }
    setDraggedHouse(null);
  };

  const handleRoomDragStart = (e: React.DragEvent, houseId: string, roomIndex: number) => {
    e.dataTransfer.setData('text/plain', `${houseId}:${roomIndex}`);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleRoomDrop = (e: React.DragEvent, houseId: string, dropIndex: number) => {
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
                  <Label htmlFor="house-select">House *</Label>
                  <Select value={newRoom.houseId} onValueChange={(value) => setNewRoom({ ...newRoom, houseId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a house" />
                    </SelectTrigger>
                    <SelectContent>
                      {houses.map(house => (
                        <SelectItem key={house.id} value={house.id}>{house.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="room-name">Room Name *</Label>
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
                  <Label htmlFor="house-name">House Name *</Label>
                  <Input
                    id="house-name"
                    value={newHouse.name}
                    onChange={(e) => {
                      setNewHouse({ ...newHouse, name: e.target.value });
                      if (validationErrors.name) {
                        setValidationErrors({ ...validationErrors, name: '' });
                      }
                    }}
                    placeholder="e.g., Main House, Studio"
                    className={validationErrors.name ? 'border-red-500' : ''}
                  />
                  {validationErrors.name && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.name}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Select
                      value={newHouse.country}
                      onValueChange={(value) => {
                        setNewHouse({ ...newHouse, country: value });
                        if (validationErrors.country) {
                          setValidationErrors({ ...validationErrors, country: '' });
                        }
                      }}
                    >
                      <SelectTrigger className={validationErrors.country ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.country && (
                      <p className="text-sm text-red-500 mt-1">{validationErrors.country}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="code">Code * (4 characters)</Label>
                    <Input
                      id="code"
                      value={newHouse.code}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase().slice(0, 4);
                        setNewHouse({ ...newHouse, code: value });
                        if (validationErrors.code) {
                          setValidationErrors({ ...validationErrors, code: '' });
                        }
                      }}
                      placeholder="e.g., MH01"
                      maxLength={4}
                      className={validationErrors.code ? 'border-red-500' : ''}
                    />
                    {validationErrors.code && (
                      <p className="text-sm text-red-500 mt-1">{validationErrors.code}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={newHouse.city}
                      onChange={(e) => {
                        setNewHouse({ ...newHouse, city: e.target.value });
                        if (validationErrors.city) {
                          setValidationErrors({ ...validationErrors, city: '' });
                        }
                      }}
                      placeholder="e.g., Paris"
                      className={validationErrors.city ? 'border-red-500' : ''}
                    />
                    {validationErrors.city && (
                      <p className="text-sm text-red-500 mt-1">{validationErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="postal">Postal Code</Label>
                    <Input
                      id="postal"
                      value={newHouse.postal_code}
                      onChange={(e) => setNewHouse({ ...newHouse, postal_code: e.target.value })}
                      placeholder="e.g., 90210"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="beneficiary">Beneficiary (comma separated)</Label>
                  <Input
                    id="beneficiary"
                    value={newHouse.beneficiary}
                    onChange={(e) => setNewHouse({ ...newHouse, beneficiary: e.target.value })}
                    placeholder="e.g., Owner, Family"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      value={newHouse.latitude}
                      onChange={(e) => setNewHouse({ ...newHouse, latitude: e.target.value })}
                      placeholder="34.07"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      value={newHouse.longitude}
                      onChange={(e) => setNewHouse({ ...newHouse, longitude: e.target.value })}
                      placeholder="-118.40"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newHouse.description}
                    onChange={(e) => setNewHouse({ ...newHouse, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={newHouse.notes}
                    onChange={(e) => setNewHouse({ ...newHouse, notes: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Icon</Label>
                  <IconSelector
                    selectedIcon={newHouse.icon}
                    onIconSelect={(icon) => setNewHouse({ ...newHouse, icon })}
                  />
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

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {
                    setShowAddHouse(false);
                    setValidationErrors({});
                  }}>Cancel</Button>
                  <Button onClick={handleAddHouse}>Add House</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        {houses.map((house, houseIndex) => (
          <Card 
            key={house.id}
            draggable
            onDragStart={(e) => handleDragStart(e, houseIndex)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, houseIndex)}
            className="cursor-move"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{house.name}</CardTitle>
                      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {house.code}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {house.address ? `${house.address.split(',')[0]}, ` : ''}{house.country}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
                            <Label htmlFor="edit-house-name">House Name *</Label>
                            <Input
                              id="edit-house-name"
                              value={editingHouse.name}
                              onChange={(e) => {
                                setEditingHouse({ ...editingHouse, name: e.target.value });
                                if (validationErrors.name) {
                                  setValidationErrors({ ...validationErrors, name: '' });
                                }
                              }}
                              className={validationErrors.name ? 'border-red-500' : ''}
                            />
                            {validationErrors.name && (
                              <p className="text-sm text-red-500 mt-1">{validationErrors.name}</p>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit-country">Country *</Label>
                              <Select
                                value={editingHouse.country}
                                onValueChange={(value) => {
                                  setEditingHouse({ ...editingHouse, country: value });
                                  if (validationErrors.country) {
                                    setValidationErrors({ ...validationErrors, country: '' });
                                  }
                                }}
                              >
                                <SelectTrigger className={validationErrors.country ? 'border-red-500' : ''}>
                                  <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                                <SelectContent>
                                  {countries.map(country => (
                                    <SelectItem key={country} value={country}>{country}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {validationErrors.country && (
                                <p className="text-sm text-red-500 mt-1">{validationErrors.country}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="edit-code">Code * (4 characters)</Label>
                              <Input
                                id="edit-code"
                                value={editingHouse.code || ''}
                                onChange={(e) => {
                                  const value = e.target.value.toUpperCase().slice(0, 4);
                                  setEditingHouse({ ...editingHouse, code: value });
                                  if (validationErrors.code) {
                                    setValidationErrors({ ...validationErrors, code: '' });
                                  }
                                }}
                                maxLength={4}
                                className={validationErrors.code ? 'border-red-500' : ''}
                              />
                              {validationErrors.code && (
                                <p className="text-sm text-red-500 mt-1">{validationErrors.code}</p>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit-city">City *</Label>
                              <Input
                                id="edit-city"
                                value={editingHouse.city}
                                onChange={(e) => {
                                  setEditingHouse({ ...editingHouse, city: e.target.value });
                                  if (validationErrors.city) {
                                    setValidationErrors({ ...validationErrors, city: '' });
                                  }
                                }}
                                className={validationErrors.city ? 'border-red-500' : ''}
                              />
                              {validationErrors.city && (
                                <p className="text-sm text-red-500 mt-1">{validationErrors.city}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="edit-postal">Postal Code</Label>
                              <Input
                                id="edit-postal"
                                value={editingHouse.postal_code || ''}
                                onChange={(e) => setEditingHouse({ ...editingHouse, postal_code: e.target.value })}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="edit-beneficiary">Beneficiary (comma separated)</Label>
                            <Input
                              id="edit-beneficiary"
                              value={editingHouse.beneficiary ? editingHouse.beneficiary.join(', ') : ''}
                              onChange={(e) =>
                                setEditingHouse({
                                  ...editingHouse,
                                  beneficiary: e.target.value.split(',').map(b => b.trim())
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit-latitude">Latitude</Label>
                              <Input
                                id="edit-latitude"
                                value={editingHouse.latitude ?? ''}
                                onChange={(e) =>
                                  setEditingHouse({
                                    ...editingHouse,
                                    latitude: e.target.value ? parseFloat(e.target.value) : undefined
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-longitude">Longitude</Label>
                              <Input
                                id="edit-longitude"
                                value={editingHouse.longitude ?? ''}
                                onChange={(e) =>
                                  setEditingHouse({
                                    ...editingHouse,
                                    longitude: e.target.value ? parseFloat(e.target.value) : undefined
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="edit-description">Description</Label>
                            <Input
                              id="edit-description"
                              value={editingHouse.description || ''}
                              onChange={(e) => setEditingHouse({ ...editingHouse, description: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-notes">Notes</Label>
                            <Input
                              id="edit-notes"
                              value={editingHouse.notes || ''}
                              onChange={(e) => setEditingHouse({ ...editingHouse, notes: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Icon</Label>
                            <IconSelector
                              selectedIcon={editingHouse.icon}
                              onIconSelect={(icon) => setEditingHouse({ ...editingHouse, icon })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-address">Address</Label>
                            <Input
                              id="edit-address"
                              value={editingHouse.address || ''}
                              onChange={(e) => setEditingHouse({ ...editingHouse, address: e.target.value })}
                            />
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => {
                              setEditingHouse(null);
                              setValidationErrors({});
                            }}>Cancel</Button>
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
              <Collapsible 
                open={!collapsedHouses.has(house.id)} 
                onOpenChange={() => toggleHouseCollapse(house.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <h5 className="font-medium text-sm text-gray-700">
                      Rooms ({house.rooms.filter(room => !room.is_deleted).length})
                    </h5>
                    {collapsedHouses.has(house.id) ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-3">
                  {house.rooms.filter(room => !room.is_deleted).map((room, roomIndex) => (
                    <div 
                      key={room.id} 
                      className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-move"
                      draggable
                      onDragStart={(e) => handleRoomDragStart(e, house.id, roomIndex)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleRoomDrop(e, house.id, roomIndex)}
                    >
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
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
