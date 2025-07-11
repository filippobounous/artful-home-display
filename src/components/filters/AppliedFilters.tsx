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
  selectedYear: string[];
  setSelectedYear: (years: string[]) => void;
  selectedArtist: string[];
  setSelectedArtist: (artists: string[]) => void;
  valuationRange: { min?: number; max?: number };
  setValuationRange: (range: { min?: number; max?: number }) => void;
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
  selectedYear,
  setSelectedYear,
  selectedArtist,
  setSelectedArtist,
  valuationRange,
  setValuationRange,
  permanentCategory,
  permanentHouse,
}: AppliedFiltersProps) {
  const { categories, houses } = useSettingsState();

  const clearFilter = (type: string, value: string) => {
    switch (type) {
      case "category":
        if (!permanentCategory) {
          setSelectedCategory(selectedCategory.filter((c) => c !== value));
        }
        break;
      case "house":
        if (!permanentHouse) {
          setSelectedHouse(selectedHouse.filter((h) => h !== value));
        }
        break;
      case "subcategory":
        setSelectedSubcategory(selectedSubcategory.filter((s) => s !== value));
        break;
      case "room":
        setSelectedRoom(selectedRoom.filter((r) => r !== value));
        break;
      case "year":
        setSelectedYear(selectedYear.filter((y) => y !== value));
        break;
      case "artist":
        setSelectedArtist(selectedArtist.filter((a) => a !== value));
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
    setSelectedYear([]);
    setSelectedArtist([]);
    setValuationRange({});
    setSearchTerm("");
  };

  const hasActiveFilters =
    selectedCategory.length > 0 ||
    selectedHouse.length > 0 ||
    selectedSubcategory.length > 0 ||
    selectedRoom.length > 0 ||
    selectedYear.length > 0 ||
    selectedArtist.length > 0 ||
    valuationRange.min !== undefined ||
    valuationRange.max !== undefined ||
    searchTerm.length > 0;

  if (!hasActiveFilters) return null;

  return (
    <div className="bg-card p-4 rounded-lg border shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Applied Filters
        </h4>
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
          const category = categories.find((c) => c.id === categoryId);
          const locked = permanentCategory && categoryId === permanentCategory;
          return (
            <Badge key={categoryId} variant="default" className="px-3 py-1">
              Category: {category?.name}
              {!permanentCategory && (
                <X
                  className="w-3 h-3 ml-2 cursor-pointer hover:text-destructive"
                  onClick={() => clearFilter("category", categoryId)}
                />
              )}
            </Badge>
          );
        })}
        {selectedSubcategory.map((subcategoryId) => {
          const category = categories.find((c) =>
            c.subcategories.some((sub) => sub.id === subcategoryId),
          );
          const subcategory = category?.subcategories.find(
            (s) => s.id === subcategoryId,
          );
          if (!subcategory || !category) return null;
          if (
            selectedCategory.includes(category.id) &&
            category.id !== permanentCategory
          )
            return null;
          return (
            <Badge
              key={subcategoryId}
              variant="secondary"
              className="px-3 py-1"
            >
              Subcategory: {subcategory.name}
              <X
                className="w-3 h-3 ml-2 cursor-pointer hover:text-destructive"
                onClick={() => clearFilter("subcategory", subcategoryId)}
              />
            </Badge>
          );
        })}
        {selectedHouse.map((houseId) => {
          const house = houses.find((h) => h.id === houseId);
          const locked = permanentHouse && houseId === permanentHouse;
          return (
            <Badge key={houseId} variant="default" className="px-3 py-1">
              House: {house?.name}
              {!permanentHouse && (
                <X
                  className="w-3 h-3 ml-2 cursor-pointer hover:text-destructive"
                  onClick={() => clearFilter("house", houseId)}
                />
              )}
            </Badge>
          );
        })}
        {selectedRoom.map((roomPair) => {
          const [houseId, roomId] = roomPair.split("|");
          if (selectedHouse.includes(houseId)) return null;
          const house = houses.find((h) => h.id === houseId);
          const room = house?.rooms.find((r) => r.id === roomId);
          return (
            <Badge key={roomPair} variant="secondary" className="px-3 py-1">
              Room: {room?.name} ({house?.name})
              <X
                className="w-3 h-3 ml-2 cursor-pointer hover:text-destructive"
                onClick={() => clearFilter("room", roomPair)}
              />
            </Badge>
          );
        })}
        {selectedYear.map((year) => (
          <Badge key={year} variant="secondary" className="px-3 py-1">
            Year: {year}
            <X
              className="w-3 h-3 ml-2 cursor-pointer hover:text-destructive"
              onClick={() => clearFilter("year", year)}
            />
          </Badge>
        ))}
        {selectedArtist.map((artist) => (
          <Badge key={artist} variant="secondary" className="px-3 py-1">
            Artist: {artist}
            <X
              className="w-3 h-3 ml-2 cursor-pointer hover:text-destructive"
              onClick={() => clearFilter("artist", artist)}
            />
          </Badge>
        ))}
        {(valuationRange.min !== undefined ||
          valuationRange.max !== undefined) && (
          <Badge variant="secondary" className="px-3 py-1">
            Valuation: {valuationRange.min ?? 0} - {valuationRange.max ?? "∞"}
            <X
              className="w-3 h-3 ml-2 cursor-pointer hover:text-destructive"
              onClick={() => setValuationRange({})}
            />
          </Badge>
        )}
      </div>
    </div>
  );
}
