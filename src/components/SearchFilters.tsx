
import { Search, Grid, List, Table } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryFilter, HouseFilter, RoomFilter, ViewMode } from "@/types/inventory";
import { useSettingsState } from "@/hooks/useSettingsState";
import { MultiSelectFilter } from "@/components/MultiSelectFilter";

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
  const { houses, categories } = useSettingsState();

  // Get all available subcategories from selected categories
  const availableSubcategories = categories
    .filter(cat => selectedCategory.length === 0 || selectedCategory.includes(cat.id))
    .flatMap(cat => cat.subcategories)
    .filter((sub, index, arr) => arr.findIndex(s => s.id === sub.id) === index); // Remove duplicates

  // Get all available rooms from selected houses
  const availableRooms = houses
    .filter(house => selectedHouse.length === 0 || selectedHouse.includes(house.id))
    .flatMap(house => house.rooms)
    .filter((room, index, arr) => arr.findIndex(r => r.id === room.id) === index); // Remove duplicates

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search your collection..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full sm:w-48">
          <MultiSelectFilter
            placeholder="All Categories"
            options={categories.map(cat => ({ id: cat.id, name: cat.name }))}
            selectedValues={selectedCategory}
            onSelectionChange={setSelectedCategory}
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-48">
          <MultiSelectFilter
            placeholder="All Subcategories"
            options={availableSubcategories.map(sub => ({ id: sub.id, name: sub.name }))}
            selectedValues={selectedSubcategory}
            onSelectionChange={setSelectedSubcategory}
          />
        </div>
        <div className="w-full sm:w-48">
          <MultiSelectFilter
            placeholder="All Houses"
            options={houses.map(house => ({ id: house.id, name: house.name }))}
            selectedValues={selectedHouse}
            onSelectionChange={setSelectedHouse}
          />
        </div>
        <div className="w-full sm:w-48">
          <MultiSelectFilter
            placeholder="All Rooms"
            options={availableRooms.map(room => ({ id: room.id, name: room.name }))}
            selectedValues={selectedRoom}
            onSelectionChange={setSelectedRoom}
          />
        </div>
        <div className="flex gap-2 ml-auto">
          {onDownloadCSV && (
            <Button variant="outline" size="sm" onClick={onDownloadCSV}>
              Download CSV
            </Button>
          )}
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <Table className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
