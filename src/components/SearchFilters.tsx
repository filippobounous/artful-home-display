
import { ViewMode } from "@/types/inventory";
import { FilterHeader } from "@/components/filters/FilterHeader";
import { SearchInput } from "@/components/filters/SearchInput";
import { CombinedCategoryFilter } from "@/components/filters/CombinedCategoryFilter";
import { CombinedLocationFilter } from "@/components/filters/CombinedLocationFilter";
import { AppliedFilters } from "@/components/filters/AppliedFilters";
import { cn } from "@/lib/utils";

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
  permanentCategory?: string;
  permanentHouse?: string;
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
  permanentCategory,
  permanentHouse,
}: SearchFiltersProps) {
  const activeCount =
    (searchTerm ? 1 : 0) +
    selectedCategory.length +
    selectedSubcategory.length +
    selectedHouse.length +
    selectedRoom.length;
  return (
    <div className="mb-8 space-y-6">
      {/* Header with title and view controls */}
      <FilterHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        onDownloadCSV={onDownloadCSV}
      />

      {/* Search and filters in aligned grid */}
      <div
        className={cn(
          "bg-white p-4 rounded-lg border shadow-sm relative",
          activeCount > 0 && "border-primary"
        )}
      >
        {activeCount > 0 && (
          <span className="absolute top-2 right-2 text-xs font-semibold">{activeCount}</span>
        )}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end">
          {/* Search - spans 2 columns */}
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {/* Combined Category/Subcategory Filter */}
          <CombinedCategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            permanentCategory={permanentCategory}
          />

          {/* Combined House/Room Filter */}
          <CombinedLocationFilter
            selectedHouse={selectedHouse}
            setSelectedHouse={setSelectedHouse}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
            permanentHouse={permanentHouse}
          />

        </div>
      </div>

      {/* Applied Filters */}
      <AppliedFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSubcategory={selectedSubcategory}
        setSelectedSubcategory={setSelectedSubcategory}
        selectedHouse={selectedHouse}
        setSelectedHouse={setSelectedHouse}
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        permanentCategory={permanentCategory}
        permanentHouse={permanentHouse}
      />
    </div>
  );
}
