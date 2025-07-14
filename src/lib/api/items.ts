import { DecorItem, DecorItemInput } from '@/types/inventory';
import { sampleDecorItems } from '@/data/sampleData';
import { API_URL, API_KEY } from './common';

function getToken() {
  return localStorage.getItem('authToken') || '';
}

function buildHeaders(contentType?: string) {
  const headers: Record<string, string> = {};
  if (contentType) headers['Content-Type'] = contentType;
  if (API_KEY) headers['X-API-Key'] = API_KEY;
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

function getAllInventory(): DecorItem[] {
  const stored = localStorage.getItem('inventoryData');
  if (stored) {
    try {
      return JSON.parse(stored) as DecorItem[];
    } catch {
      // fall through to sample items
    }
  }
  localStorage.setItem('inventoryData', JSON.stringify(sampleDecorItems));
  return [...sampleDecorItems];
}

function getLocalInventory(): DecorItem[] {
  return getAllInventory().filter((item) => !item.deleted);
}

function saveLocalInventory(items: DecorItem[]) {
  localStorage.setItem('inventoryData', JSON.stringify(items));
}

function convertInput(input: DecorItemInput, id: number): DecorItem {
  return {
    id,
    code: input.code,
    title: input.name,
    artist: input.creator,
    originRegion: input.origin_region,
    category: input.category,
    subcategory: input.subcategory,
    material: input.material,
    widthCm: input.width_cm,
    heightCm: input.height_cm,
    depthCm: input.depth_cm,
    weightKg: input.weight_kg,
    provenance: input.provenance,
    image: '/placeholder.svg',
    description: input.description || '',
    house: input.house ?? input.house_code,
    room: input.room ?? input.room_code,
    yearPeriod: String(input.date_period),
    quantity: input.quantity,
    acquisitionDate: input.acquisition_date,
    acquisitionValue: input.acquisition_value,
    acquisitionCurrency: input.acquisition_currency,
    valuation: input.appraisal_value,
    valuationDate: input.appraisal_date,
    valuationPerson: input.appraisal_entity,
    valuationCurrency: input.appraisal_currency,
    notes: input.notes,
    deleted: input.is_deleted ?? false,
    history: [],
  } as DecorItem;
}

export function decorItemToInput(item: DecorItem): DecorItemInput {
  return {
    id: item.id,
    code: item.code,
    name: item.title,
    creator: item.artist || '',
    room_code: item.room || '',
    house: item.house,
    room: item.room,
    origin_region: item.originRegion || '',
    date_period: item.yearPeriod || '',
    material: item.material,
    width_cm: item.widthCm,
    height_cm: item.heightCm,
    depth_cm: item.depthCm,
    weight_kg: item.weightKg,
    provenance: item.provenance,
    category: item.category,
    subcategory: item.subcategory || '',
    quantity: item.quantity ?? 1,
    acquisition_date: item.acquisitionDate,
    acquisition_value: item.acquisitionValue,
    acquisition_currency: item.acquisitionCurrency,
    appraisal_value: item.valuation,
    appraisal_date: item.valuationDate,
    appraisal_entity: item.valuationPerson,
    appraisal_currency: item.valuationCurrency,
    description: item.description,
    notes: item.notes,
    version: item.version,
    is_deleted: item.deleted,
  } as DecorItemInput;
}

export async function fetchDecorItems(): Promise<DecorItem[]> {
  try {
    const response = await fetch(`${API_URL}/decoritems`, {
      headers: buildHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch items');
    const data = await response.json();
    saveLocalInventory(data);
    return data.filter((item: DecorItem) => !item.deleted);
  } catch {
    return getLocalInventory();
  }
}

export async function createDecorItem(item: DecorItemInput) {
  try {
    const response = await fetch(`${API_URL}/decoritems`, {
      method: 'POST',
      headers: buildHeaders('application/json'),
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to create item');
    const data = await response.json();
    const items = getAllInventory();
    const stored = convertInput(item, data.id);
    saveLocalInventory([...items, stored]);
    return stored;
  } catch {
    const items = getAllInventory();
    const newId = Math.max(0, ...items.map((i) => i.id || 0)) + 1;
    const newItem = convertInput(item, newId);
    saveLocalInventory([...items, newItem]);
    return newItem;
  }
}

export async function updateDecorItem(
  id: number | string,
  updates: Partial<DecorItemInput>,
) {
  try {
    const response = await fetch(`${API_URL}/decoritems/${id}`, {
      method: 'PUT',
      headers: buildHeaders('application/json'),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update item');
    const data = await response.json();
    const items = getAllInventory();
    const stored = convertInput(
      {
        ...updates,
        ...data,
      } as DecorItemInput,
      data.id,
    );
    saveLocalInventory(items.map((i) => (i.id === data.id ? stored : i)));
    return stored;
  } catch {
    const items = getAllInventory();
    let updatedItem: DecorItem | null = null;
    const updated = items.map((item) => {
      if (item.id === Number(id)) {
        const history = item.history
          ? [...item.history, { ...item }]
          : [{ ...item }];
        const converted = convertInput(
          {
            ...item,
            ...updates,
          } as DecorItemInput,
          Number(id),
        );
        updatedItem = { ...converted, history };
        return updatedItem;
      }
      return item;
    });
    saveLocalInventory(updated);
    return updatedItem as DecorItem;
  }
}

export async function restoreDecorItem(
  id: number | string,
  version: DecorItemInput,
) {
  return updateDecorItem(id, version);
}

export async function deleteDecorItem(id: number | string) {
  try {
    const response = await fetch(`${API_URL}/decoritems/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete item');
    const items = getAllInventory().map((item) =>
      item.id === Number(id) ? { ...item, deleted: true } : item,
    );
    saveLocalInventory(items);
    return true;
  } catch {
    const items = getAllInventory().map((item) =>
      item.id === Number(id) ? { ...item, deleted: true } : item,
    );
    saveLocalInventory(items);
    return true;
  }
}
