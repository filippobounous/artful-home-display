import {
  type InventoryItem,
  type HouseConfig,
  type CategoryConfig,
  type CollectionType,
} from '@/types/inventory';

function locationIndex(item: InventoryItem, houses: HouseConfig[]): number {
  const withSort = item as InventoryItem & { locationSort?: number | string };
  if (withSort.locationSort !== undefined) {
    const val = withSort.locationSort;
    const num = typeof val === 'number' ? val : Number(val);
    if (!Number.isNaN(num)) return num;
  }
  const houseIdx = houses.findIndex((h) => h.id === item.house);
  const roomIdx =
    houseIdx === -1 || !item.room
      ? -1
      : houses[houseIdx].rooms.findIndex((r) => r.id === item.room);
  const h = houseIdx === -1 ? 999 : houseIdx;
  const r = roomIdx === -1 ? 999 : roomIdx;
  return h * 1000 + r;
}

function getCategoryId(item: InventoryItem): string | undefined {
  if ('category' in item && item.category) return item.category;
  if ('genre' in item && item.genre) return item.genre;
  return undefined;
}

function getSubcategoryId(item: InventoryItem): string | undefined {
  if ('subcategory' in item && item.subcategory) return item.subcategory;
  return undefined;
}

function categoryIndex(
  item: InventoryItem,
  categories: CategoryConfig[],
): number {
  const categoryId = getCategoryId(item);
  const subcategoryId = getSubcategoryId(item);
  const catIdx = categoryId
    ? categories.findIndex((c) => c.id === categoryId)
    : -1;
  const subIdx =
    catIdx === -1 || !subcategoryId
      ? -1
      : categories[catIdx].subcategories.findIndex(
          (s) => s.id === subcategoryId,
        );
  const c = catIdx === -1 ? 999 : catIdx;
  const s = subIdx === -1 ? 999 : subIdx;
  return c * 1000 + s;
}

function getCreatorName(item: InventoryItem): string | undefined {
  if ('artist' in item && item.artist) return item.artist;
  if ('author' in item && item.author) return item.author;
  return undefined;
}

function getYearSortValue(item: InventoryItem): number | string {
  if ('publicationYear' in item && item.publicationYear)
    return item.publicationYear;
  if ('releaseYear' in item && item.releaseYear) return item.releaseYear;
  if ('yearPeriod' in item && item.yearPeriod) {
    const numeric = Number(item.yearPeriod);
    return Number.isNaN(numeric) ? item.yearPeriod : numeric;
  }
  return '';
}

export function sortInventoryItems(
  items: InventoryItem[],
  sortField: string,
  sortDirection: 'asc' | 'desc',
  houses: HouseConfig[],
  categories: CategoryConfig[],
  _collection: CollectionType,
): InventoryItem[] {
  return [...items].sort((a, b) => {
    if (!sortField) return 0;
    let aValue: string | number;
    let bValue: string | number;
    if (sortField === 'location') {
      aValue = locationIndex(a, houses);
      bValue = locationIndex(b, houses);
    } else if (sortField === 'category') {
      aValue = categoryIndex(a, categories);
      bValue = categoryIndex(b, categories);
    } else if (sortField === 'creator') {
      aValue = (getCreatorName(a) ?? '').toLowerCase();
      bValue = (getCreatorName(b) ?? '').toLowerCase();
    } else if (sortField === 'year') {
      aValue = getYearSortValue(a);
      bValue = getYearSortValue(b);
    } else {
      const aFieldValue = (a as Record<string, unknown>)[sortField];
      const bFieldValue = (b as Record<string, unknown>)[sortField];

      if (sortField === 'valuation') {
        aValue = Number(aFieldValue) || 0;
        bValue = Number(bFieldValue) || 0;
      } else {
        aValue = String(aFieldValue || '').toLowerCase();
        bValue = String(bFieldValue || '').toLowerCase();
      }
    }
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
}
