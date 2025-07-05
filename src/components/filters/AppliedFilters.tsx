
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useSettingsState } from "@/hooks/useSettingsState";

interface AppliedFiltersProps {
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
  permanentCategory?: string;
  permanentHouse?: string;
}

export function AppliedFilters({
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
  permanentCategory,
  permanentHouse,
}: AppliedFiltersProps) {
  const { categories, houses } = useSettingsState();

  const clearFilter = (type: string, value: string) => {
    switch (type) {
      case 'category':
        if (!permanentCategory) {
          setSelectedCategory(selectedCategory.filter(c => c !== value));
        }
        break;
      case 'house':
        if (!permanentHouse) {
          setSelectedHouse(selectedHouse.filter(h => h !== value));
        }
        break;
      case 'subcategory':
        setSelectedSubcategory(selectedSubcategory.filter(s => s !== value));
        break;
      case 'room':
        setSelectedRoom(selectedRoom.filter(r => r !== value));
        break;
    }
  };

  const clearAllFilters = () => {
    if (!permanentCategory) {
      setSelectedCategory([]);
    }
    setSelectedSubcategory([]);
    if (!permanentHouse) {
      setSelectedHouse([]);
    }
    setSelectedRoom([]);
    setSearchTerm("");
  };

  const hasActiveFilters = selectedCategory.length > 0 || selectedHouse.length > 0 || 
                          selectedSubcategory.length > 0 || selectedRoom.length > 0 || 
                          searchTerm.length > 0;

  if (!hasActiveFilters) return null;

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-slate-700">Applied Filters</h4>
        <Button variant="ghost" size="sm" onClick={clearAllFilters}>
          Clear All
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {searchTerm && (
          <Badge variant="secondary" className="px-3 py-1">
            Search: {searchTerm}
            <X 
              className="w-3 h-3 ml-2 cursor-pointer hover:text-destructive" 
              onClick={() => setSearchTerm("")}
            />
          </Badge>
        )}
        {selectedCategory.map((categoryId) => {
          const category = categories.find(c => c.id === categoryId);
          const locked = permanentCategory && categoryId === permanentCategory;
          return (
            <Badge key={categoryId} variant={locked ? "default" : "secondary"} className="px-3 py-1">
              Category: {category?.name}
              {!permanentCategory && (
                <X
                  className="w-3 h-3 ml-2 cursor-pointer hover:text-destructive"
                  onClick={() => clearFilter('category', categoryId)}
                />
              )}
            </Badge>
          );
        })}
        {selectedSubcategory.map((subcategoryId) => {
          const subcategory = categories
            .flatMap(c => c.subcategories)
            .find(s => s.id === subcategoryId);
          return (
            <Badge key={subcategoryId} variant="secondary" className="px-3 py-1">
              Subcategory: {subcategory?.name}
              <X 
                className="w-3 h-3 ml-2 cursor-pointer hover:text-destructive" 
                onClick={() => clearFilter('subcategory', subcategoryId)}
              />
            </Badge>
          );
        })}
        {selectedHouse.map((houseId) => {
          const house = houses.find(h => h.id === houseId);
          const locked = permanentHouse && houseId === permanentHouse;
          return (
            <Badge key={houseId} variant={locked ? "default" : "secondary"} className="px-3 py-1">
              House: {house?.name}
              {!permanentHouse && (
                <X
                  className="w-3 h-3 ml-2 cursor-pointer hover:text-destructive"
                  onClick={() => clearFilter('house', houseId)}
                />
              )}
            </Badge>
          );
        })}
        {selectedRoom.map((roomId) => {
          const room = houses
            .flatMap(h => h.rooms)
            .find(r => r.id === roomId);
          return (
            <Badge key={roomId} variant="secondary" className="px-3 py-1">
              Room: {room?.name}
              <X 
                className="w-3 h-3 ml-2 cursor-pointer hover:text-destructive" 
                onClick={() => clearFilter('room', roomId)}
              />
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
