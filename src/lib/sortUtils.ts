import { DecorItem, HouseConfig, CategoryConfig } from '@/types/inventory';

function locationIndex(item: DecorItem, houses: HouseConfig[]): number {
  if (item && item.locationSort !== undefined) {
    const val = item.locationSort;
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

function categoryIndex(item: DecorItem, categories: CategoryConfig[]): number {
  const catIdx = categories.findIndex((c) => c.id === item.category);
  const subIdx =
    catIdx === -1 || !item.subcategory
      ? -1
      : categories[catIdx].subcategories.findIndex(
          (s) => s.id === item.subcategory,
        );
  const c = catIdx === -1 ? 999 : catIdx;
  const s = subIdx === -1 ? 999 : subIdx;
  return c * 1000 + s;
}

export function sortInventoryItems(
  items: DecorItem[],
  sortField: string,
  sortDirection: 'asc' | 'desc',
  houses: HouseConfig[],
  categories: CategoryConfig[],
): DecorItem[] {
  return [...items].sort((a, b) => {
    if (!sortField) return 0;
    let aValue: string | number | undefined;
    let bValue: string | number | undefined;
    if (sortField === 'location') {
      aValue = locationIndex(a, houses);
      bValue = locationIndex(b, houses);
    } else if (sortField === 'category') {
      aValue = categoryIndex(a, categories);
      bValue = categoryIndex(b, categories);
    } else {
      aValue = a[sortField as keyof DecorItem];

      bValue = b[sortField as keyof DecorItem];
      if (sortField === 'valuation') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      } else {
        aValue = String(aValue || '').toLowerCase();
        bValue = String(bValue || '').toLowerCase();
      }
    }
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
}
