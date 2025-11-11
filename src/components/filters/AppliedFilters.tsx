import { Button } from '@/components/ui/button';
import {
  AppliedFilterBadges,
  type AppliedFilterBadgeGroup,
} from '@/components/filters/AppliedFilterBadges';
import { useSettingsState } from '@/hooks/useSettingsState';

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
  selectedCreator: string[];
  setSelectedCreator: (creators: string[]) => void;
  valuationRange: { min?: number; max?: number };
  setValuationRange: (range: { min?: number; max?: number }) => void;
  permanentCategory?: string;
  permanentHouse?: string;
  labels: {
    creator: string;
    category: string;
    subcategory: string;
    year: string;
  };
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
  selectedCreator,
  setSelectedCreator,
  valuationRange,
  setValuationRange,
  permanentCategory,
  permanentHouse,
  labels,
}: AppliedFiltersProps) {
  const { categories, houses } = useSettingsState();

  const clearFilter = (type: string, value: string) => {
    switch (type) {
      case 'category':
        if (!permanentCategory) {
          setSelectedCategory(selectedCategory.filter((c) => c !== value));
        }
        break;
      case 'house':
        if (!permanentHouse) {
          setSelectedHouse(selectedHouse.filter((h) => h !== value));
        }
        break;
      case 'subcategory':
        setSelectedSubcategory(selectedSubcategory.filter((s) => s !== value));
        break;
      case 'room':
        setSelectedRoom(selectedRoom.filter((r) => r !== value));
        break;
      case 'year':
        setSelectedYear(selectedYear.filter((y) => y !== value));
        break;
      case 'creator':
        setSelectedCreator(selectedCreator.filter((a) => a !== value));
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
    setSelectedCreator([]);
    setValuationRange({});
    setSearchTerm('');
  };

  const hasActiveFilters =
    selectedCategory.length > 0 ||
    selectedHouse.length > 0 ||
    selectedSubcategory.length > 0 ||
    selectedRoom.length > 0 ||
    selectedYear.length > 0 ||
    selectedCreator.length > 0 ||
    valuationRange.min !== undefined ||
    valuationRange.max !== undefined ||
    searchTerm.length > 0;

  if (!hasActiveFilters) return null;

  const filterGroups: AppliedFilterBadgeGroup[] = [];

  if (searchTerm) {
    const searchOptions: AppliedFilterBadgeGroup['options'] = {
      search: { label: searchTerm },
    };

    filterGroups.push({
      id: 'search',
      labelPrefix: 'Search',
      selectedIds: ['search'],
      options: searchOptions,
      onRemove: () => setSearchTerm(''),
      variant: 'secondary',
    });
  }

  if (selectedCategory.length > 0) {
    const categoryOptions: AppliedFilterBadgeGroup['options'] = {};

    selectedCategory.forEach((categoryId) => {
      const category = categories.find((c) => c.id === categoryId);
      categoryOptions[categoryId] = { label: category?.name ?? categoryId };
    });

    filterGroups.push({
      id: 'category',
      labelPrefix: labels.category,
      selectedIds: selectedCategory,
      options: categoryOptions,
      onRemove: (id) => clearFilter('category', id),
      locked: Boolean(permanentCategory),
    });
  }

  if (selectedSubcategory.length > 0) {
    const subcategoryOptions: AppliedFilterBadgeGroup['options'] = {};
    const visibleSubcategories: string[] = [];

    selectedSubcategory.forEach((subcategoryId) => {
      const category = categories.find((c) =>
        c.subcategories.some((sub) => sub.id === subcategoryId),
      );
      const subcategory = category?.subcategories.find(
        (sub) => sub.id === subcategoryId,
      );
      if (!subcategory || !category) return;
      if (
        selectedCategory.includes(category.id) &&
        category.id !== permanentCategory
      ) {
        return;
      }

      visibleSubcategories.push(subcategoryId);
      subcategoryOptions[subcategoryId] = { label: subcategory.name };
    });

    if (visibleSubcategories.length > 0) {
      filterGroups.push({
        id: 'subcategory',
        labelPrefix: labels.subcategory,
        selectedIds: visibleSubcategories,
        options: subcategoryOptions,
        onRemove: (id) => clearFilter('subcategory', id),
        variant: 'secondary',
      });
    }
  }

  if (selectedHouse.length > 0) {
    const houseOptions: AppliedFilterBadgeGroup['options'] = {};

    selectedHouse.forEach((houseId) => {
      const house = houses.find((h) => h.id === houseId);
      houseOptions[houseId] = { label: house?.name ?? houseId };
    });

    filterGroups.push({
      id: 'house',
      labelPrefix: 'House',
      selectedIds: selectedHouse,
      options: houseOptions,
      onRemove: (id) => clearFilter('house', id),
      locked: Boolean(permanentHouse),
    });
  }

  if (selectedRoom.length > 0) {
    const roomOptions: AppliedFilterBadgeGroup['options'] = {};
    const visibleRooms: string[] = [];

    selectedRoom.forEach((roomPair) => {
      const [houseId, roomId] = roomPair.split('|');
      if (selectedHouse.includes(houseId)) return;
      const house = houses.find((h) => h.id === houseId);
      const room = house?.rooms.find((r) => r.id === roomId);

      visibleRooms.push(roomPair);
      roomOptions[roomPair] = {
        label: `${room?.name ?? roomId} (${house?.name ?? houseId})`,
      };
    });

    if (visibleRooms.length > 0) {
      filterGroups.push({
        id: 'room',
        labelPrefix: 'Room',
        selectedIds: visibleRooms,
        options: roomOptions,
        onRemove: (id) => clearFilter('room', id),
        variant: 'secondary',
      });
    }
  }

  if (selectedYear.length > 0) {
    const yearOptions: AppliedFilterBadgeGroup['options'] = {};

    selectedYear.forEach((year) => {
      yearOptions[year] = { label: year };
    });

    filterGroups.push({
      id: 'year',
      labelPrefix: labels.year,
      selectedIds: selectedYear,
      options: yearOptions,
      onRemove: (id) => clearFilter('year', id),
      variant: 'secondary',
    });
  }

  if (selectedCreator.length > 0) {
    const creatorOptions: AppliedFilterBadgeGroup['options'] = {};

    selectedCreator.forEach((creator) => {
      creatorOptions[creator] = { label: creator };
    });

    filterGroups.push({
      id: 'creator',
      labelPrefix: labels.creator,
      selectedIds: selectedCreator,
      options: creatorOptions,
      onRemove: (id) => clearFilter('creator', id),
      variant: 'secondary',
    });
  }

  if (valuationRange.min !== undefined || valuationRange.max !== undefined) {
    const valuationOptions: AppliedFilterBadgeGroup['options'] = {
      valuation: {
        label: `${valuationRange.min ?? 0} - ${
          valuationRange.max ?? '∞'
        }`,
      },
    };

    filterGroups.push({
      id: 'valuation',
      labelPrefix: 'Valuation',
      selectedIds: ['valuation'],
      options: valuationOptions,
      onRemove: () => setValuationRange({}),
      variant: 'secondary',
    });
  }

  return (
    <div className="bg-card p-4 rounded-lg border shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-muted-foreground">
          Applied Filters
        </h4>
        <Button variant="ghost" size="sm" onClick={clearAllFilters}>
          Clear All
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <AppliedFilterBadges groups={filterGroups} />
      </div>
    </div>
  );
}
