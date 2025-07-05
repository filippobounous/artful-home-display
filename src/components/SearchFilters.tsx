
import { Search, Grid, List, Table, Download, X, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ViewMode } from "@/types/inventory";
import { MultiSelectFilter } from "@/components/MultiSelectFilter";
import { useSettingsState } from "@/hooks/useSettingsState";

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
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
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
  onSort,
  sortField,
  sortDirection,
}: SearchFiltersProps) {
  const { categories, houses } = useSettingsState();

  const categoryOptions = categories.map(cat => ({ id: cat.id, name: cat.name }));
  const houseOptions = houses.map(house => ({ id: house.id, name: house.name }));

  // Get subcategory options based on selected categories
  const subcategoryOptions = categories
    .filter(cat => selectedCategory.includes(cat.id))
    .flatMap(cat => cat.subcategories.map(sub => ({ id: sub.id, name: sub.name })));

  // Get room options based on selected houses
  const roomOptions = houses
    .filter(house => selectedHouse.includes(house.id))
    .flatMap(house => house.rooms.map(room => ({ id: room.id, name: room.name })));

  const clearFilter = (type: string, value: string) => {
    switch (type) {
      case 'category':
        if (!permanentCategory) {
          setSelectedCategory(selectedCategory.filter(c => c !== value));
        }
        break;
      case 'house':
        setSelectedHouse(selectedHouse.filter(h => h !== value));
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
    setSelectedHouse([]);
    setSelectedRoom([]);
    setSearchTerm("");
  };

  const hasActiveFilters = selectedCategory.length > 0 || selectedHouse.length > 0 || 
                          selectedSubcategory.length > 0 || selectedRoom.length > 0 || 
                          searchTerm.length > 0;

  const handleSort = (field: string) => {
    if (onSort) {
      const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(field, newDirection);
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortDirection === 'asc' ? '↑' : '↓';
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
          {onSort && viewMode === "table" && (
            <div className="flex gap-1">
              <Button 
                variant={sortField === 'title' ? "default" : "outline"} 
                size="sm" 
                onClick={() => handleSort('title')}
              >
                {getSortIcon('title')}
                <span className="ml-1">Title</span>
              </Button>
              <Button 
                variant={sortField === 'artist' ? "default" : "outline"} 
                size="sm" 
                onClick={() => handleSort('artist')}
              >
                {getSortIcon('artist')}
                <span className="ml-1">Artist</span>
              </Button>
              <Button 
                variant={sortField === 'valuation' ? "default" : "outline"} 
                size="sm" 
                onClick={() => handleSort('valuation')}
              >
                {getSortIcon('valuation')}
                <span className="ml-1">Value</span>
              </Button>
              <Button 
                variant={sortField === 'category' ? "default" : "outline"} 
                size="sm" 
                onClick={() => handleSort('category')}
              >
                {getSortIcon('category')}
                <span className="ml-1">Category</span>
              </Button>
            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
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

          {/* Category multi-selector - only if not permanent */}
          {!permanentCategory && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Categories</label>
              <MultiSelectFilter
                placeholder="Select categories"
                options={categoryOptions}
                selectedValues={selectedCategory}
                onSelectionChange={setSelectedCategory}
              />
            </div>
          )}

          {/* Subcategory multi-selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Subcategories</label>
            <MultiSelectFilter
              placeholder="Select subcategories"
              options={subcategoryOptions}
              selectedValues={selectedSubcategory}
              onSelectionChange={setSelectedSubcategory}
            />
          </div>

          {/* House multi-selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Houses</label>
            <MultiSelectFilter
              placeholder="Select houses"
              options={houseOptions}
              selectedValues={selectedHouse}
              onSelectionChange={setSelectedHouse}
            />
          </div>

          {/* Room multi-selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Rooms</label>
            <MultiSelectFilter
              placeholder="Select rooms"
              options={roomOptions}
              selectedValues={selectedRoom}
              onSelectionChange={setSelectedRoom}
            />
          </div>
        </div>
      </div>

      {/* Applied Filters */}
      {hasActiveFilters && (
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
              return (
                <Badge key={categoryId} variant={permanentCategory ? "default" : "secondary"} className="px-3 py-1">
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
              return (
                <Badge key={houseId} variant="secondary" className="px-3 py-1">
                  House: {house?.name}
                  <X 
                    className="w-3 h-3 ml-2 cursor-pointer hover:text-destructive" 
                    onClick={() => clearFilter('house', houseId)}
                  />
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
      )}
    </div>
  );
}
