
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Download } from "lucide-react";
import { useSettingsState } from "@/hooks/useSettingsState";
import { IconSelector } from "@/components/IconSelector";
import { CsvUploader } from "@/components/CsvUploader";
import { useToast } from "@/hooks/use-toast";

export function SettingsManagement() {
  const [newHouseName, setNewHouseName] = useState("");
  const [newHouseCountry, setNewHouseCountry] = useState("");
  const [newHouseAddress, setNewHouseAddress] = useState("");
  const [newHouseYear, setNewHouseYear] = useState("");
  const [newHouseCode, setNewHouseCode] = useState("");
  const [newHouseIcon, setNewHouseIcon] = useState("house");
  const [newRoomName, setNewRoomName] = useState("");
  const [selectedHouse, setSelectedHouse] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("palette");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { categories, houses, addCategory, addHouse, addRoom, addSubcategory, downloadMappings } = useSettingsState();
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
      
      addHouse(newHouseName, newHouseCountry, newHouseAddress, newHouseYear ? parseInt(newHouseYear) : undefined, newHouseCode, newHouseIcon);
      
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
      addRoom(selectedHouse, newRoomName);
      
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

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName, newCategoryIcon);
      
      toast({
        title: "Category added",
        description: `${newCategoryName} has been added successfully`
      });
      
      setNewCategoryName("");
      setNewCategoryIcon("palette");
    } else {
      toast({
        title: "Missing information",
        description: "Please enter a category name",
        variant: "destructive"
      });
    }
  };

  const handleAddSubcategory = () => {
    if (newSubcategoryName.trim() && selectedCategory) {
      addSubcategory(selectedCategory, newSubcategoryName);
      
      toast({
        title: "Subcategory added",
        description: `${newSubcategoryName} has been added successfully`
      });
      
      setNewSubcategoryName("");
    } else {
      toast({
        title: "Missing information",
        description: "Please select a category and enter subcategory name",
        variant: "destructive"
      });
    }
  };

  const handleCsvUpload = (data: any[], type: string) => {
    console.log(`Processing ${type} upload:`, data);
    // Here you would process the CSV data and add to your state
    // This is a placeholder for the actual implementation
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Settings Management</h3>
        <Button onClick={downloadMappings} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download Mappings
        </Button>
      </div>

      <Tabs defaultValue="houses" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="houses">Houses & Rooms</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="upload">Bulk Upload</TabsTrigger>
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
                  <IconSelector
                    selectedIcon={newHouseIcon}
                    onIconSelect={setNewHouseIcon}
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
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-6">
          {/* Categories Management */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label>Category Name</Label>
                  <Input
                    placeholder="Category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Icon</Label>
                  <IconSelector
                    selectedIcon={newCategoryIcon}
                    onIconSelect={setNewCategoryIcon}
                  />
                </div>
                <Button onClick={handleAddCategory}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Category
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>Current Categories</Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
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
                  {categories.map((category) => (
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
                <Button onClick={handleAddSubcategory} disabled={!selectedCategory}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Subcategory
                </Button>
              </div>
              
              {selectedCategory && (
                <div className="space-y-2">
                  <Label>Subcategories in {categories.find(c => c.id === selectedCategory)?.name}</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories
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

        <TabsContent value="upload" className="space-y-6">
          <CsvUploader onUpload={handleCsvUpload} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
