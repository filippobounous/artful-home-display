
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Download } from "lucide-react";
import { IconSelector } from "@/components/IconSelector";
import { useToast } from "@/hooks/use-toast";

const countries = [
  "United States", "Canada", "United Kingdom", "France", "Germany", "Italy", "Spain", 
  "Netherlands", "Switzerland", "Australia", "Japan", "Singapore", "Monaco", "Austria"
];

interface HousesManagementProps {
  houses: any[];
  onAddHouse: (name: string, country: string, address: string, yearBuilt: number | undefined, code: string, icon: string) => void;
  onAddRoom: (houseId: string, roomName: string) => void;
}

export function HousesManagement({ houses, onAddHouse, onAddRoom }: HousesManagementProps) {
  const [newHouseName, setNewHouseName] = useState("");
  const [newHouseCountry, setNewHouseCountry] = useState("");
  const [newHouseAddress, setNewHouseAddress] = useState("");
  const [newHouseYear, setNewHouseYear] = useState("");
  const [newHouseCode, setNewHouseCode] = useState("");
  const [newHouseIcon, setNewHouseIcon] = useState("house");
  const [newRoomName, setNewRoomName] = useState("");
  const [selectedHouse, setSelectedHouse] = useState("");

  const { toast } = useToast();

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
    if (newRoomName.trim() && selectedHouse) {
      onAddRoom(selectedHouse, newRoomName);
      
      toast({
        title: "Room added",
        description: `${newRoomName} has been added successfully`
      });
      
      setNewRoomName("");
    } else {
      toast({
        title: "Missing information",
        description: "Please select a house and enter room name",
        variant: "destructive"
      });
    }
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
              <select
                value={newHouseCountry}
                onChange={(e) => setNewHouseCountry(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
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
            <div>
              <Label>Icon</Label>
              <div className="mt-1">
                <IconSelector
                  selectedIcon={newHouseIcon}
                  onIconSelect={setNewHouseIcon}
                />
              </div>
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
          
          <Button onClick={handleAddHouse} className="w-full">
            <Plus className="w-4 h-4 mr-1" />
            Add House
          </Button>
          
          <div className="space-y-2">
            <Label>Current Houses</Label>
            <div className="space-y-2">
              {houses.map((house) => (
                <div key={house.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
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
                    <button className="text-slate-400 hover:text-destructive">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
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
            <select
              value={selectedHouse}
              onChange={(e) => setSelectedHouse(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a house</option>
              {houses.map((house) => (
                <option key={house.id} value={house.id}>
                  {house.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Room name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              className="flex-1"
              disabled={!selectedHouse}
            />
            <Button onClick={handleAddRoom} disabled={!selectedHouse}>
              <Plus className="w-4 h-4 mr-1" />
              Add Room
            </Button>
          </div>
          
          {selectedHouse && (
            <div className="space-y-2">
              <Label>Rooms in {houses.find(h => h.id === selectedHouse)?.name}</Label>
              <div className="flex flex-wrap gap-2">
                {houses
                  .find(h => h.id === selectedHouse)
                  ?.rooms.map((room) => (
                    <Badge key={room.id} variant="secondary" className="px-3 py-1">
                      {room.name}
                      <button className="ml-2 hover:text-destructive">
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
