import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Download, Edit, Save } from "lucide-react";
import { IconSelector } from "@/components/IconSelector";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { API_URL } from "@/lib/api/common";
import type { RoomConfig } from "@/types/inventory";

const countries = [
  "United States", "Canada", "United Kingdom", "France", "Germany", "Italy", "Spain", 
  "Netherlands", "Switzerland", "Australia", "Japan", "Singapore", "Monaco", "Austria"
];

interface HousesManagementProps {
  houses: any[];
  onAddHouse: (name: string, country: string, address: string, yearBuilt: number | undefined, code: string, icon: string) => void;
  onAddRoom: (houseId: string, room: Partial<RoomConfig> & { name: string; floor: number }) => void;
  onEditRoom?: (houseId: string, roomId: string, updates: Partial<RoomConfig>) => void;
  onEditHouse?: (houseId: string, updates: any) => void;
  onDeleteRoom?: (houseId: string, roomId: string) => void;
}

export function HousesManagement({ houses, onAddHouse, onAddRoom, onEditRoom, onEditHouse, onDeleteRoom }: HousesManagementProps) {
  const [newHouseName, setNewHouseName] = useState("");
  const [newHouseCountry, setNewHouseCountry] = useState("");
  const [newHouseAddress, setNewHouseAddress] = useState("");
  const [newHouseYear, setNewHouseYear] = useState("");
  const [newHouseCode, setNewHouseCode] = useState("");
  const [newHouseIcon, setNewHouseIcon] = useState("house");
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomFloor, setNewRoomFloor] = useState("");
  const [newRoomType, setNewRoomType] = useState("");
  const [newRoomArea, setNewRoomArea] = useState("");
  const [newRoomWindows, setNewRoomWindows] = useState("");
  const [newRoomDoors, setNewRoomDoors] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [newRoomNotes, setNewRoomNotes] = useState("");
  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [selectedHouse, setSelectedHouse] = useState("");
  const [editingHouse, setEditingHouse] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const [roomEditData, setRoomEditData] = useState<any>({});

  const { toast } = useToast();

  useEffect(() => {
    fetch(`${API_URL}/roomtypes`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setRoomTypes(Array.isArray(data) ? data : []))
      .catch(() => setRoomTypes([]));
  }, []);

  const handleAddHouse = () => {
    if (newHouseName.trim() && newHouseCountry.trim() && newHouseCode.trim()) {
      if (newHouseCode.length !== 4) {
        toast({
          title: "Invalid house code",
          description: "House code must be exactly 4 characters long",
          variant: "destructive"
        });
        return;
      }
      
      onAddHouse(newHouseName, newHouseCountry, newHouseAddress, newHouseYear ? parseInt(newHouseYear) : undefined, newHouseCode, newHouseIcon);
      
      toast({
        title: "House added",
        description: `${newHouseName} has been added successfully`
      });
      
      setNewHouseName("");
      setNewHouseCountry("");
      setNewHouseAddress("");
      setNewHouseYear("");
      setNewHouseCode("");
      setNewHouseIcon("house");
    } else {
      toast({
        title: "Missing required fields",
        description: "Please fill in house name, country, and code",
        variant: "destructive"
      });
    }
  };

  const handleAddRoom = () => {
    if (newRoomName.trim() && newRoomFloor.trim() && selectedHouse) {
      onAddRoom(selectedHouse, {
        name: newRoomName,
        floor: parseInt(newRoomFloor, 10),
        room_type: newRoomType || undefined,
        area_sqm: newRoomArea ? parseFloat(newRoomArea) : undefined,
        windows: newRoomWindows ? parseInt(newRoomWindows, 10) : undefined,
        doors: newRoomDoors ? parseInt(newRoomDoors, 10) : undefined,
        description: newRoomDescription || undefined,
        notes: newRoomNotes || undefined,
      });

      toast({
        title: "Room added",
        description: `${newRoomName} has been added successfully`
      });

      setNewRoomName("");
      setNewRoomFloor("");
      setNewRoomType("");
      setNewRoomArea("");
      setNewRoomWindows("");
      setNewRoomDoors("");
      setNewRoomDescription("");
      setNewRoomNotes("");
    } else {
      toast({
        title: "Missing information",
        description: "Please fill in required fields",
        variant: "destructive"
      });
    }
  };

  const handleEditHouse = (house: any) => {
    setEditingHouse(house.id);
    setEditData({
      name: house.name,
      country: house.country,
      address: house.address || "",
      yearBuilt: house.yearBuilt?.toString() || "",
      code: house.code,
      icon: house.icon
    });
  };

  const handleSaveEdit = () => {
    if (editData.name.trim() && editData.country.trim() && editData.code.trim()) {
      if (editData.code.length !== 4) {
        toast({
          title: "Invalid house code",
          description: "House code must be exactly 4 characters long",
          variant: "destructive"
        });
        return;
      }

      const updates = {
        name: editData.name,
        country: editData.country,
        address: editData.address,
        yearBuilt: editData.yearBuilt ? parseInt(editData.yearBuilt) : undefined,
        code: editData.code.toUpperCase(),
        icon: editData.icon
      };

      if (onEditHouse) {
        onEditHouse(editingHouse!, updates);
      }

      toast({
        title: "House updated",
        description: "House has been updated successfully"
      });

      setEditingHouse(null);
      setEditData({});
    } else {
      toast({
        title: "Missing required fields",
        description: "Please fill in house name, country, and code",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingHouse(null);
    setEditData({});
  };

  const handleDeleteRoom = (houseId: string, roomId: string) => {
    if (onDeleteRoom) {
      onDeleteRoom(houseId, roomId);
      toast({
        title: "Room deleted",
        description: "Room has been removed successfully"
      });
    }
  };

  const handleEditRoom = (room: RoomConfig) => {
    setEditingRoom(room.id);
    setRoomEditData({
      name: room.name,
      floor: room.floor?.toString() || "",
      room_type: room.room_type || "",
      area_sqm: room.area_sqm?.toString() || "",
      windows: room.windows?.toString() || "",
      doors: room.doors?.toString() || "",
      description: room.description || "",
      notes: room.notes || "",
    });
  };

  const handleSaveRoomEdit = () => {
    if (!editingRoom || !selectedHouse) return;
    if (roomEditData.name.trim() && roomEditData.floor.trim()) {
      onEditRoom?.(selectedHouse, editingRoom, {
        name: roomEditData.name,
        floor: parseInt(roomEditData.floor, 10),
        room_type: roomEditData.room_type || undefined,
        area_sqm: roomEditData.area_sqm ? parseFloat(roomEditData.area_sqm) : undefined,
        windows: roomEditData.windows ? parseInt(roomEditData.windows, 10) : undefined,
        doors: roomEditData.doors ? parseInt(roomEditData.doors, 10) : undefined,
        description: roomEditData.description || undefined,
        notes: roomEditData.notes || undefined,
      });
      toast({ title: "Room updated", description: "Room has been updated" });
      setEditingRoom(null);
      setRoomEditData({});
    } else {
      toast({ title: "Missing information", description: "Please fill in required fields", variant: "destructive" });
    }
  };

  const handleCancelRoomEdit = () => {
    setEditingRoom(null);
    setRoomEditData({});
  };

  const downloadHousesTemplate = () => {
    const template = "name,country,address,yearBuilt,code\nMy House,United States,123 Main St,1985,MH01\nGuest House,United States,125 Main St,1990,GH01";
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'houses-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Houses Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Houses</CardTitle>
          <Button onClick={downloadHousesTemplate} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>House Name *</Label>
              <Input
                placeholder="House name"
                value={newHouseName}
                onChange={(e) => setNewHouseName(e.target.value)}
              />
            </div>
            <div>
              <Label>Country *</Label>
              <Select
                value={newHouseCountry}
                onValueChange={setNewHouseCountry}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>House Code * (4 characters)</Label>
              <Input
                placeholder="e.g., MH01"
                value={newHouseCode}
                onChange={(e) => setNewHouseCode(e.target.value.slice(0, 4))}
                maxLength={4}
              />
            </div>
            <div>
              <Label>Year Built</Label>
              <Input
                placeholder="e.g., 1985"
                type="number"
                value={newHouseYear}
                onChange={(e) => setNewHouseYear(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Address</Label>
              <Input
                placeholder="Full address"
                value={newHouseAddress}
                onChange={(e) => setNewHouseAddress(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Icon</Label>
              <div className="mt-1">
                <IconSelector
                  selectedIcon={newHouseIcon}
                  onIconSelect={setNewHouseIcon}
                />
              </div>
            </div>
            <div className="pt-6">
              <Button onClick={handleAddHouse}>
                <Plus className="w-4 h-4 mr-1" />
                Add House
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Current Houses</Label>
            <div className="space-y-2">
              {houses.map((house) => (
                <div key={house.id} className="p-3 border rounded-lg">
                  {editingHouse === house.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>House Name *</Label>
                          <Input
                            value={editData.name}
                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Country *</Label>
                          <Select
                            value={editData.country}
                            onValueChange={(value) => setEditData({ ...editData, country: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>House Code * (4 characters)</Label>
                          <Input
                            value={editData.code}
                            onChange={(e) => setEditData({...editData, code: e.target.value.slice(0, 4)})}
                            maxLength={4}
                          />
                        </div>
                        <div>
                          <Label>Year Built</Label>
                          <Input
                            type="number"
                            value={editData.yearBuilt}
                            onChange={(e) => setEditData({...editData, yearBuilt: e.target.value})}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Address</Label>
                          <Input
                            value={editData.address}
                            onChange={(e) => setEditData({...editData, address: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Icon</Label>
                          <div className="mt-1">
                            <IconSelector
                              selectedIcon={editData.icon}
                              onIconSelect={(icon) => setEditData({...editData, icon})}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleSaveEdit}>
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{house.name}</h4>
                        <p className="text-sm text-slate-600">{house.country}</p>
                        {house.address && (
                          <p className="text-xs text-slate-500">{house.address}</p>
                        )}
                        {house.yearBuilt && (
                          <p className="text-xs text-slate-500">Built: {house.yearBuilt}</p>
                        )}
                        <p className="text-xs text-slate-500">Code: {house.code}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditHouse(house)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <button className="text-slate-400 hover:text-destructive p-1">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Management */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Rooms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Select House</Label>
            <Select
              value={selectedHouse}
              onValueChange={setSelectedHouse}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a house" />
              </SelectTrigger>
              <SelectContent>
                {houses.map((house) => (
                  <SelectItem key={house.id} value={house.id}>
                    {house.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Room Name *</Label>
              <Input
                placeholder="Room name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                disabled={!selectedHouse}
              />
            </div>
            <div>
              <Label>Floor *</Label>
              <Input
                type="number"
                placeholder="0"
                value={newRoomFloor}
                onChange={(e) => setNewRoomFloor(e.target.value)}
                disabled={!selectedHouse}
              />
            </div>
            <div>
              <Label>Room Type</Label>
              <Select value={newRoomType} onValueChange={setNewRoomType} disabled={!selectedHouse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Area (sqm)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0"
                value={newRoomArea}
                onChange={(e) => setNewRoomArea(e.target.value)}
                disabled={!selectedHouse}
              />
            </div>
            <div>
              <Label>Windows</Label>
              <Input
                type="number"
                placeholder="0"
                value={newRoomWindows}
                onChange={(e) => setNewRoomWindows(e.target.value)}
                disabled={!selectedHouse}
              />
            </div>
            <div>
              <Label>Doors</Label>
              <Input
                type="number"
                placeholder="0"
                value={newRoomDoors}
                onChange={(e) => setNewRoomDoors(e.target.value)}
                disabled={!selectedHouse}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={newRoomDescription}
                onChange={(e) => setNewRoomDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Notes</Label>
              <Textarea
                value={newRoomNotes}
                onChange={(e) => setNewRoomNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <Button onClick={handleAddRoom} disabled={!selectedHouse} className="mt-2">
            <Plus className="w-4 h-4 mr-1" />
            Add Room
          </Button>

          {editingRoom && (
            <div className="mt-6 space-y-4">
              <Label>Edit Room</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Room Name *</Label>
                  <Input
                    value={roomEditData.name || ""}
                    onChange={(e) => setRoomEditData({ ...roomEditData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Floor *</Label>
                  <Input
                    type="number"
                    value={roomEditData.floor || ""}
                    onChange={(e) => setRoomEditData({ ...roomEditData, floor: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Room Type</Label>
                  <Select value={roomEditData.room_type || ""} onValueChange={(val) => setRoomEditData({ ...roomEditData, room_type: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Area (sqm)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={roomEditData.area_sqm || ""}
                    onChange={(e) => setRoomEditData({ ...roomEditData, area_sqm: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Windows</Label>
                  <Input
                    type="number"
                    value={roomEditData.windows || ""}
                    onChange={(e) => setRoomEditData({ ...roomEditData, windows: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Doors</Label>
                  <Input
                    type="number"
                    value={roomEditData.doors || ""}
                    onChange={(e) => setRoomEditData({ ...roomEditData, doors: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={roomEditData.description || ""}
                    onChange={(e) => setRoomEditData({ ...roomEditData, description: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={roomEditData.notes || ""}
                    onChange={(e) => setRoomEditData({ ...roomEditData, notes: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancelRoomEdit}>
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button onClick={handleSaveRoomEdit}>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          )}
          
          {selectedHouse && (
            <div className="space-y-2">
              <Label>Rooms in {houses.find(h => h.id === selectedHouse)?.name}</Label>
              <div className="flex flex-wrap gap-2">
                {houses
                  .find(h => h.id === selectedHouse)
                  ?.rooms.map((room) => (
                    <Badge key={room.id} variant="secondary" className="px-3 py-1">
                      {room.name}
                      <button
                        className="ml-2 hover:text-primary"
                        onClick={() => handleEditRoom(room)}
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        className="ml-1 hover:text-destructive"
                        onClick={() => handleDeleteRoom(selectedHouse, room.id)}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
