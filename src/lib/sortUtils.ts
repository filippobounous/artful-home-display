import { InventoryItem, HouseConfig, CategoryConfig } from "@/types/inventory";

function locationIndex(item: InventoryItem, houses: HouseConfig[]): number {
  if (item as any && (item as any).locationSort !== undefined) {
    const val = (item as any).locationSort;
    const num = typeof val === 'number' ? val : Number(val);
    if (!Number.isNaN(num)) return num;
  }
  const houseIdx = houses.findIndex(h => h.id === item.house);
  const roomIdx = houseIdx === -1 || !item.room ? -1 : houses[houseIdx].rooms.findIndex(r => r.id === item.room);
  const h = houseIdx === -1 ? 999 : houseIdx;
  const r = roomIdx === -1 ? 999 : roomIdx;
  return h * 1000 + r;
}

function categoryIndex(item: InventoryItem, categories: CategoryConfig[]): number {
  const catIdx = categories.findIndex(c => c.id === item.category);
  const subIdx = catIdx === -1 || !item.subcategory ? -1 : categories[catIdx].subcategories.findIndex(s => s.id === item.subcategory);
  const c = catIdx === -1 ? 999 : catIdx;
  const s = subIdx === -1 ? 999 : subIdx;
  return c * 1000 + s;
}

export function sortInventoryItems(
  items: InventoryItem[],
  sortField: string,
  sortDirection: 'asc' | 'desc',
  houses: HouseConfig[],
  categories: CategoryConfig[]
): InventoryItem[] {
  return [...items].sort((a, b) => {
    if (!sortField) return 0;
    let aValue: any;
    let bValue: any;
    if (sortField === 'location') {
      aValue = locationIndex(a, houses);
      bValue = locationIndex(b, houses);
    } else if (sortField === 'category') {
      aValue = categoryIndex(a, categories);
      bValue = categoryIndex(b, categories);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      aValue = a[sortField as keyof InventoryItem];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bValue = b[sortField as keyof InventoryItem];
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
