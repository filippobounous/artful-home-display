import { ViewMode } from '@/types/inventory';
import { FilterHeader } from '@/components/filters/FilterHeader';
import { SearchInput } from '@/components/filters/SearchInput';
import { CombinedCategoryFilter } from '@/components/filters/CombinedCategoryFilter';
import { CombinedLocationFilter } from '@/components/filters/CombinedLocationFilter';
import { YearFilter } from '@/components/filters/YearFilter';
import { ArtistFilter } from '@/components/filters/ArtistFilter';
import { CurrencyFilter } from '@/components/filters/CurrencyFilter';
import { ValuationRangeFilter } from '@/components/filters/ValuationRangeFilter';
import { ConditionFilter } from '@/components/filters/ConditionFilter';
import { AppliedFilters } from '@/components/filters/AppliedFilters';
import { cn } from '@/lib/utils';

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
  yearOptions: string[];
  selectedYear: string[];
  setSelectedYear: (years: string[]) => void;
  artistOptions: string[];
  selectedArtist: string[];
  setSelectedArtist: (artists: string[]) => void;
  conditionOptions: string[];
  selectedCondition: string[];
  setSelectedCondition: (conditions: string[]) => void;
  currencyOptions: string[];
  selectedCurrency: string[];
  setSelectedCurrency: (currencies: string[]) => void;
  valuationRange: { min?: number; max?: number };
  setValuationRange: (range: { min?: number; max?: number }) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onDownloadCSV?: () => void;
  onDownloadJSON?: () => void;
  onDownloadImages?: () => void;
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
  yearOptions,
  selectedYear,
  setSelectedYear,
  artistOptions,
  selectedArtist,
  setSelectedArtist,
  conditionOptions,
  selectedCondition,
  setSelectedCondition,
  currencyOptions,
  selectedCurrency,
  setSelectedCurrency,
  valuationRange,
  setValuationRange,
  viewMode,
  setViewMode,
  onDownloadCSV,
  onDownloadJSON,
  onDownloadImages,
  permanentCategory,
  permanentHouse,
}: SearchFiltersProps) {
  const activeCount =
    (searchTerm ? 1 : 0) +
    selectedCategory.length +
    selectedSubcategory.length +
    selectedHouse.length +
    selectedRoom.length +
    selectedYear.length +
    selectedArtist.length +
    selectedCondition.length +
    selectedCurrency.length +
    (valuationRange.min ? 1 : 0) +
    (valuationRange.max ? 1 : 0);
  return (
    <div className="mb-8 space-y-6">
      {/* Header with title and view controls */}
      <FilterHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        onDownloadCSV={onDownloadCSV}
        onDownloadJSON={onDownloadJSON}
        onDownloadImages={onDownloadImages}
      />

      {/* Search and filters in aligned grid */}
      <div
        className={cn(
          'bg-card p-4 rounded-lg border shadow-sm relative',
          activeCount > 0 && 'border-primary',
        )}
      >
        {activeCount > 0 && (
          <span className="absolute top-2 right-2 text-xs font-semibold">
            {activeCount}
          </span>
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

          <div className="md:col-span-2">
            <YearFilter
              yearOptions={yearOptions}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
          </div>

          <div className="md:col-span-2">
            <ArtistFilter
              artistOptions={artistOptions}
              selectedArtist={selectedArtist}
              setSelectedArtist={setSelectedArtist}
            />
          </div>

          <div className="md:col-span-2">
            <ConditionFilter
              conditionOptions={conditionOptions}
              selectedCondition={selectedCondition}
              setSelectedCondition={setSelectedCondition}
            />
          </div>
              
          <div className="md:col-span-2">
            <CurrencyFilter
              currencyOptions={currencyOptions}
              selectedCurrency={selectedCurrency}
              setSelectedCurrency={setSelectedCurrency}
            />
          </div>

          <div className="md:col-span-2">
            <ValuationRangeFilter
              range={valuationRange}
              setRange={setValuationRange}
            />
          </div>
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
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedArtist={selectedArtist}
        setSelectedArtist={setSelectedArtist}
        selectedCondition={selectedCondition}
        setSelectedCondition={setSelectedCondition}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        valuationRange={valuationRange}
        setValuationRange={setValuationRange}
        permanentCategory={permanentCategory}
        permanentHouse={permanentHouse}
      />
    </div>
  );
}
