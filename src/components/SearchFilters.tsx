
import { Search, Grid, List, Table, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ViewMode } from "@/types/inventory";
import { HierarchicalCategorySelector } from "@/components/HierarchicalCategorySelector";
import { HierarchicalHouseRoomSelector } from "@/components/HierarchicalHouseRoomSelector";

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string[];
  setSelectedCategory: (categories: string[]) => void;
  selectedSubcategory: string[];
  setSelectedSubcategory: (subcategories: string[]) => void;
  selectedHouse: string[];
  setSelectedHouse: (houses: string[]) => void;
  selectedRoom: string[];
  setSelectedRoom: (rooms: string[]) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onDownloadCSV?: () => void;
}

export function SearchFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedHouse,
  setSelectedHouse,
  selectedRoom,
  setSelectedRoom,
  viewMode,
  setViewMode,
  onDownloadCSV,
}: SearchFiltersProps) {
  // Convert array selections to single values for hierarchical selectors
  const singleCategory = selectedCategory[0] || "";
  const singleSubcategory = selectedSubcategory[0] || "";
  const singleHouse = selectedHouse[0] || "";
  const singleRoom = selectedRoom[0] || "";

  const handleCategoryChange = (category: string, subcategory: string) => {
    setSelectedCategory(category ? [category] : []);
    setSelectedSubcategory(subcategory ? [subcategory] : []);
  };

  const handleLocationChange = (house: string, room: string) => {
    setSelectedHouse(house ? [house] : []);
    setSelectedRoom(room ? [room] : []);
  };

  return (
    <div className="mb-8 space-y-6">
      {/* Header with title and view controls */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Filter & View Options</h3>
        <div className="flex items-center gap-2">
          {onDownloadCSV && (
            <Button variant="outline" size="sm" onClick={onDownloadCSV}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          )}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-none border-x"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-l-none"
            >
              <Table className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search and filters in aligned grid */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Search - spans 2 columns */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Search Collection</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search titles, descriptions, artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category selector */}
          <div>
            <HierarchicalCategorySelector
              selectedCategory={singleCategory}
              selectedSubcategory={singleSubcategory}
              onSelectionChange={handleCategoryChange}
            />
          </div>

          {/* Location selector */}
          <div>
            <HierarchicalHouseRoomSelector
              selectedHouse={singleHouse}
              selectedRoom={singleRoom}
              onSelectionChange={handleLocationChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
