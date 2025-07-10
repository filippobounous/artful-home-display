import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import { useSettingsState } from "@/hooks/useSettingsState";
import { HousesManagement } from "@/components/settings/HousesManagement";
import { CategoriesManagement } from "@/components/settings/CategoriesManagement";
import { BulkUpload } from "@/components/settings/BulkUpload";
import { HouseConfig } from "@/types/inventory";

export function SettingsManagement() {
  const { 
    categories, 
    houses, 
    addCategory, 
    addHouse, 
    editHouse,
    editRoom,
    addRoom,
    deleteRoom,
    addSubcategory,
    deleteSubcategory,
    downloadMappings,
    moveHouse,
    moveRoom,
    moveCategory,
    moveSubcategory,
    toggleHouseVisibility,
    toggleRoomVisibility,
    toggleCategoryVisibility,
    toggleSubcategoryVisibility
  } = useSettingsState();

  const handleCsvUpload = (data: any[], type: string) => {
    console.log(`Processing ${type} upload:`, data);
    // Here you would process the CSV data and add to your state
    // This is a placeholder for the actual implementation
  };

  const handleAddHouse = (house: Omit<HouseConfig, 'id' | 'rooms'>) => {
    addHouse(house);
  };

  const downloadCsvMappings = () => {
    // Convert houses to CSV
    const housesCsv = [
      'House Name,City,Country,Address,Postal Code,Code,Icon',
      ...houses.map(h =>
        `"${h.name}","${h.city}","${h.country}","${h.address || ''}","${h.postal_code || ''}","${h.code}"`)
    ].join('\n');

    // Convert categories to CSV
    const categoriesCsv = [
      'Category Name,Icon',
      ...categories.map(c => `"${c.name}","${c.icon}"`)
    ].join('\n');

    // Create combined CSV with sections
    const csvContent = `Houses\n${housesCsv}\n\nCategories\n${categoriesCsv}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory-mappings.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Settings Management</h3>
        <div className="flex gap-2">
          <Button onClick={downloadCsvMappings} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download CSV
          </Button>
          <Button onClick={downloadMappings} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download JSON
          </Button>
        </div>
      </div>

      <Tabs defaultValue="houses" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="houses">Houses & Rooms</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="upload">Bulk Upload</TabsTrigger>
        </TabsList>
        
        <TabsContent value="houses">
          <HousesManagement
            houses={houses}
            onAddHouse={handleAddHouse}
            onAddRoom={addRoom}
            onEditRoom={editRoom}
            onEditHouse={editHouse}
            onDeleteRoom={deleteRoom}
            onMoveHouse={moveHouse}
            onMoveRoom={moveRoom}
            onToggleHouse={toggleHouseVisibility}
            onToggleRoom={toggleRoomVisibility}
          />
        </TabsContent>
        
        <TabsContent value="categories">
          <CategoriesManagement
            categories={categories}
            onAddCategory={addCategory}
            onAddSubcategory={addSubcategory}
            onDeleteSubcategory={deleteSubcategory}
            onMoveCategory={moveCategory}
            onMoveSubcategory={moveSubcategory}
            onToggleCategory={toggleCategoryVisibility}
            onToggleSubcategory={toggleSubcategoryVisibility}
          />
        </TabsContent>

        <TabsContent value="upload">
          <BulkUpload onUpload={handleCsvUpload} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
