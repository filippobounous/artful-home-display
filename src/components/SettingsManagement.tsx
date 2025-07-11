import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import { useSettingsState } from "@/hooks/useSettingsState";
import { HousesManagement } from "@/components/settings/HousesManagement";
import { CategoriesManagement } from "@/components/settings/CategoriesManagement";
import { BulkUpload } from "@/components/settings/BulkUpload";
import { DownloadDialog } from "@/components/settings/DownloadDialog";
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
    toggleSubcategoryVisibility,
  } = useSettingsState();

  const [showDownloadDialog, setShowDownloadDialog] = useState(false);

  const handleCsvUpload = (data: any[], type: string) => {
    console.log(`Processing ${type} upload:`, data);
    // Here you would process the CSV data and add to your state
    // This is a placeholder for the actual implementation
  };

  const handleJsonUpload = (data: any[], type: string) => {
    console.log(`Processing ${type} JSON upload:`, data);
    // Here you would process the JSON data and add to your state
    // This is a placeholder for the actual implementation
  };

  const handleAddHouse = (house: Omit<HouseConfig, "id" | "rooms">) => {
    addHouse(house);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Settings Management</h3>
        <div className="flex gap-2">
          <Button onClick={() => setShowDownloadDialog(true)} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="houses" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="houses">Houses & Rooms</TabsTrigger>
          <TabsTrigger value="categories">
            Categories & Subcategories
          </TabsTrigger>
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
            onEditCategory={editCategory}
            onEditSubcategory={editSubcategory}
            onDeleteSubcategory={deleteSubcategory}
            onMoveCategory={moveCategory}
            onMoveSubcategory={moveSubcategory}
            onToggleCategory={toggleCategoryVisibility}
            onToggleSubcategory={toggleSubcategoryVisibility}
          />
        </TabsContent>

        <TabsContent value="upload">
          <BulkUpload
            onCsvUpload={handleCsvUpload}
            onJsonUpload={handleJsonUpload}
          />
        </TabsContent>
      </Tabs>

      <DownloadDialog
        open={showDownloadDialog}
        onOpenChange={setShowDownloadDialog}
        houses={houses}
        categories={categories}
      />
    </div>
  );
}
