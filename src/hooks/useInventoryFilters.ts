import { useCallback, useMemo, useState } from 'react';
import type {
  CategoryConfig,
  HouseConfig,
  ViewMode,
  InventoryItem,
  CollectionType,
} from '@/types/inventory';
import { sortInventoryItems } from '@/lib/sortUtils';
import {
  getCreatorLabel,
  getItemCategory,
  getItemCreator,
  getItemSubcategory,
  getItemValuationValue,
  getItemYear,
} from '@/lib/inventoryDisplay';

export type InventorySortField =
  | 'title'
  | 'creator'
  | 'category'
  | 'valuation'
  | 'year'
  | 'location';

export interface ValuationRange {
  min?: number;
  max?: number;
}

interface UseInventoryFiltersOptions {
  items: InventoryItem[];
  categories: CategoryConfig[];
  houses: HouseConfig[];
  collection: CollectionType;
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
  collection,
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
  const [selectedCreator, setSelectedCreator] = useState<string[]>([]);
  const [valuationRange, setValuationRange] = useState<ValuationRange>({});
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [sortField, setSortField] =
    useState<InventorySortField>(initialSortField);
  const [sortDirection, setSortDirection] =
    useState<'asc' | 'desc'>(initialSortDirection);

  const yearOptions = useMemo(() => {
    const years = new Set<string>();
    items.forEach((item) => {
      const year = getItemYear(item);
      if (year) years.add(year);
    });
    return Array.from(years);
  }, [items]);

  const creatorOptions = useMemo(() => {
    const creators = new Set<string>();
    items.forEach((item) => {
      const creator = getItemCreator(item);
      if (creator) creators.add(creator);
    });
    return Array.from(creators);
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (item.deleted) return false;
      const itemCategory = getItemCategory(item);
      if (permanentCategoryId && itemCategory !== permanentCategoryId) {
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
        (getItemCreator(item) &&
          getItemCreator(item)!.toLowerCase().includes(term)) ||
        ('publisher' in item &&
          item.publisher &&
          item.publisher.toLowerCase().includes(term)) ||
        ('isbn' in item && item.isbn && item.isbn.toLowerCase().includes(term));

      if (!matchesSearch) return false;

      const matchesCategory =
        selectedCategory.length === 0 ||
        (itemCategory && selectedCategory.includes(itemCategory));

      if (!matchesCategory) return false;

      const matchesSubcategory =
        selectedSubcategory.length === 0 ||
        (getItemSubcategory(item) &&
          selectedSubcategory.includes(getItemSubcategory(item)!));

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
        (getItemYear(item) && selectedYear.includes(getItemYear(item)!));

      if (!matchesYear) return false;

      const matchesCreator =
        selectedCreator.length === 0 ||
        (getItemCreator(item) &&
          selectedCreator.includes(getItemCreator(item)!));

      if (!matchesCreator) return false;

      const valuation = getItemValuationValue(item);
      const matchesValuation =
        (valuationRange.min === undefined ||
          (valuation !== undefined && valuation >= valuationRange.min)) &&
        (valuationRange.max === undefined ||
          (valuation !== undefined && valuation <= valuationRange.max));

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
    selectedCreator,
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
      collection,
    );
  }, [
    filteredItems,
    sortField,
    sortDirection,
    houses,
    categories,
    collection,
  ]);

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
    selectedCreator,
    setSelectedCreator,
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
    creatorOptions,
    filteredItems,
    sortedItems,
    labels: {
      creator: getCreatorLabel(collection),
    },
  };
}
