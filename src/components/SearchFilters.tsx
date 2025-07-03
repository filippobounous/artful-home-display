
import { Search, Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryFilter, ViewMode, HouseFilter, RoomFilter } from "@/types/inventory";
import { houseConfigs } from "@/types/inventory";

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: CategoryFilter;
  setSelectedCategory: (category: CategoryFilter) => void;
  selectedHouse: HouseFilter;
  setSelectedHouse: (house: HouseFilter) => void;
  selectedRoom: RoomFilter;
  setSelectedRoom: (room: RoomFilter) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export function SearchFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedHouse,
  setSelectedHouse,
  selectedRoom,
  setSelectedRoom,
  viewMode,
  setViewMode,
}: SearchFiltersProps) {
  // Get current house configuration for dynamic room filtering
  const currentHouseConfig = houseConfigs.find(h => h.id === selectedHouse);
  const availableRooms = currentHouseConfig?.rooms || [];

  const handleHouseChange = (value: HouseFilter) => {
    setSelectedHouse(value);
    // Reset room selection when house changes
    setSelectedRoom("all");
  };

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
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="art">Art</SelectItem>
            <SelectItem value="furniture">Furniture</SelectItem>
            <SelectItem value="sculpture">Sculpture</SelectItem>
            <SelectItem value="decorative">Decorative</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedHouse} onValueChange={handleHouseChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="House" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Houses</SelectItem>
            {houseConfigs.map(house => (
              <SelectItem key={house.id} value={house.id}>
                {house.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedRoom} onValueChange={setSelectedRoom}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Room" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rooms</SelectItem>
            {selectedHouse === "all" ? (
              <>
                <SelectItem value="living-room">Living Room</SelectItem>
                <SelectItem value="bedroom">Bedroom</SelectItem>
                <SelectItem value="kitchen">Kitchen</SelectItem>
                <SelectItem value="dining-room">Dining Room</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="bathroom">Bathroom</SelectItem>
                <SelectItem value="hallway">Hallway</SelectItem>
              </>
            ) : (
              availableRooms.map(room => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <div className="flex gap-2 ml-auto">
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
        </div>
      </div>
    </div>
  );
}
