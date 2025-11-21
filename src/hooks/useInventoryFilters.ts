import { useCallback, useMemo, useState } from 'react';
import type {
  CategoryConfig,
  DecorItem,
  HouseConfig,
  ViewMode,
} from '@/types/inventory';
import { sortInventoryItems } from '@/lib/sortUtils';

export type InventorySortField =
  | 'title'
  | 'artist'
  | 'category'
  | 'valuation'
  | 'yearPeriod'
  | 'location';

export interface ValuationRange {
  min?: number;
  max?: number;
}

interface UseInventoryFiltersOptions {
  items: DecorItem[];
  categories: CategoryConfig[];
  houses: HouseConfig[];
  permanentCategoryId?: string;
  permanentHouseId?: string;
  initialViewMode?: ViewMode;
  initialSortField?: InventorySortField;
  initialSortDirection?: 'asc' | 'desc';
}

export function useInventoryFilters({
  items,
  categories,
  houses,
  permanentCategoryId,
  permanentHouseId,
  initialViewMode = 'table',
  initialSortField = 'title',
  initialSortDirection = 'asc',
}: UseInventoryFiltersOptions) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string[]>([]);
  const [valuationRange, setValuationRange] = useState<ValuationRange>({});
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [sortField, setSortField] =
    useState<InventorySortField>(initialSortField);
  const [sortDirection, setSortDirection] =
    useState<'asc' | 'desc'>(initialSortDirection);

  const yearOptions = useMemo(() => {
    const years = new Set<string>();
    items.forEach((item) => {
      if (item.yearPeriod) {
        years.add(item.yearPeriod);
      }
    });
    return Array.from(years);
  }, [items]);

  const artistOptions = useMemo(() => {
    const artists = new Set<string>();
    items.forEach((item) => {
      if (item.artist) {
        artists.add(item.artist);
      }
    });
    return Array.from(artists);
  }, [items]);

  const conditionOptions = useMemo(() => {
    const conditions = new Set<string>();
    items.forEach((item) => {
      if (item.condition) {
        conditions.add(item.condition);
      }
    });
    return Array.from(conditions);
  }, [items]);

  const currencyOptions = useMemo(() => {
    const currencies = new Set<string>();
    items.forEach((item) => {
      if (item.valuationCurrency) {
        currencies.add(item.valuationCurrency);
      }
    });
    return Array.from(currencies);
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (item.deleted) return false;
      if (permanentCategoryId && item.category !== permanentCategoryId) {
        return false;
      }
      if (permanentHouseId && item.house !== permanentHouseId) {
        return false;
      }

      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        term === '' ||
        item.title.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term)) ||
        (item.notes && item.notes.toLowerCase().includes(term)) ||
        (item.artist && item.artist.toLowerCase().includes(term));

      if (!matchesSearch) return false;

      const matchesCategory =
        selectedCategory.length === 0 ||
        selectedCategory.includes(item.category);

      if (!matchesCategory) return false;

      const matchesSubcategory =
        selectedSubcategory.length === 0 ||
        (item.subcategory && selectedSubcategory.includes(item.subcategory));

      if (!matchesSubcategory) return false;

      const matchesHouse =
        selectedHouse.length === 0 ||
        selectedHouse.includes(item.house || '');

      if (!matchesHouse) return false;

      const roomKey = `${item.house || ''}|${item.room || ''}`;
      const matchesRoom =
        selectedRoom.length === 0 || selectedRoom.includes(roomKey);

      if (!matchesRoom) return false;

      const matchesYear =
        selectedYear.length === 0 ||
        (item.yearPeriod && selectedYear.includes(item.yearPeriod));

      if (!matchesYear) return false;

      const matchesArtist =
        selectedArtist.length === 0 ||
        (item.artist && selectedArtist.includes(item.artist));

      if (!matchesArtist) return false;

      const matchesCondition =
        selectedCondition.length === 0 ||
        (item.condition && selectedCondition.includes(item.condition));

      if (!matchesCondition) return false;

      const matchesCurrency =
        selectedCurrency.length === 0 ||
        (item.valuationCurrency &&
          selectedCurrency.includes(item.valuationCurrency));

      if (!matchesCurrency) return false;

      const matchesValuation =
        (!valuationRange.min ||
          (item.valuation && item.valuation >= valuationRange.min)) &&
        (!valuationRange.max ||
          (item.valuation && item.valuation <= valuationRange.max));

      return matchesValuation;
    });
  }, [
    items,
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    selectedHouse,
    selectedRoom,
    selectedYear,
    selectedArtist,
    selectedCondition,
    selectedCurrency,
    valuationRange,
    permanentCategoryId,
    permanentHouseId,
  ]);

  const sortedItems = useMemo(() => {
    return sortInventoryItems(
      filteredItems,
      sortField,
      sortDirection,
      houses,
      categories,
    );
  }, [filteredItems, sortField, sortDirection, houses, categories]);

  const handleSort = useCallback(
    (field: InventorySortField, direction: 'asc' | 'desc') => {
      setSortField(field);
      setSortDirection(direction);
    },
    [setSortField, setSortDirection],
  );

  return {
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
    selectedCondition,
    setSelectedCondition,
    selectedCurrency,
    setSelectedCurrency,
    valuationRange,
    setValuationRange,
    viewMode,
    setViewMode,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    handleSort,
    yearOptions,
    artistOptions,
    conditionOptions,
    currencyOptions,
    filteredItems,
    sortedItems,
  };
}
