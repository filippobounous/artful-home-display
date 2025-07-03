
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Edit } from "lucide-react";
import { categoryConfigs, houseConfigs } from "@/types/inventory";

export function SettingsManagement() {
  const [newHouseName, setNewHouseName] = useState("");
  const [newHouseCountry, setNewHouseCountry] = useState("");
  const [newHouseAddress, setNewHouseAddress] = useState("");
  const [newHouseYear, setNewHouseYear] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [selectedHouse, setSelectedHouse] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const addHouse = () => {
    if (newHouseName.trim() && newHouseCountry.trim()) {
      console.log("Adding house:", {
        name: newHouseName,
        country: newHouseCountry,
        address: newHouseAddress,
        yearBuilt: newHouseYear ? parseInt(newHouseYear) : undefined
      });
      // In the future, this will connect to a database
      setNewHouseName("");
      setNewHouseCountry("");
      setNewHouseAddress("");
      setNewHouseYear("");
    }
  };

  const addRoom = () => {
    if (newRoomName.trim() && selectedHouse) {
      console.log("Adding room:", newRoomName, "to house:", selectedHouse);
      // In the future, this will connect to a database
      setNewRoomName("");
    }
  };

  const addCategory = () => {
    if (newCategoryName.trim()) {
      console.log("Adding category:", newCategoryName);
      // In the future, this will connect to a database
      setNewCategoryName("");
    }
  };

  const addSubcategory = () => {
    if (newSubcategoryName.trim() && selectedCategory) {
      console.log("Adding subcategory:", newSubcategoryName, "to category:", selectedCategory);
      // In the future, this will connect to a database
      setNewSubcategoryName("");
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="houses" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="houses">Houses & Rooms</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="houses" className="space-y-6">
          {/* Houses Management */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Houses</CardTitle>
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
                  <Input
                    placeholder="Country"
                    value={newHouseCountry}
                    onChange={(e) => setNewHouseCountry(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    placeholder="Full address"
                    value={newHouseAddress}
                    onChange={(e) => setNewHouseAddress(e.target.value)}
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
              </div>
              
              <Button onClick={addHouse} className="w-full">
                <Plus className="w-4 h-4 mr-1" />
                Add House
              </Button>
              
              <div className="space-y-2">
                <Label>Current Houses</Label>
                <div className="space-y-2">
                  {houseConfigs.map((house) => (
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
                  {houseConfigs.map((house) => (
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
                <Button onClick={addRoom} disabled={!selectedHouse}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Room
                </Button>
              </div>
              
              {selectedHouse && (
                <div className="space-y-2">
                  <Label>Rooms in {houseConfigs.find(h => h.id === selectedHouse)?.name}</Label>
                  <div className="flex flex-wrap gap-2">
                    {houseConfigs
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
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-6">
          {/* Categories Management */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addCategory}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Category
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>Current Categories</Label>
                <div className="flex flex-wrap gap-2">
                  {categoryConfigs.map((category) => (
                    <Badge key={category.id} variant="secondary" className="px-3 py-1">
                      {category.name}
                      <button className="ml-2 hover:text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subcategories Management */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Subcategories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Select Category</Label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a category</option>
                  {categoryConfigs.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Subcategory name"
                  value={newSubcategoryName}
                  onChange={(e) => setNewSubcategoryName(e.target.value)}
                  className="flex-1"
                  disabled={!selectedCategory}
                />
                <Button onClick={addSubcategory} disabled={!selectedCategory}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Subcategory
                </Button>
              </div>
              
              {selectedCategory && (
                <div className="space-y-2">
                  <Label>Subcategories in {categoryConfigs.find(c => c.id === selectedCategory)?.name}</Label>
                  <div className="flex flex-wrap gap-2">
                    {categoryConfigs
                      .find(c => c.id === selectedCategory)
                      ?.subcategories.map((subcategory) => (
                        <Badge key={subcategory.id} variant="secondary" className="px-3 py-1">
                          {subcategory.name}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
