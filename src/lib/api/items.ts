
import {
  DecorItem,
  BookItem,
  MusicItem,
  DecorItemInput,
} from '@/types/inventory';
import { testDecorItems } from '@/data/testData';
import { testBooks } from '@/data/booksTestData';
import { testMusic } from '@/data/musicTestData';
import { API_URL, withAuthHeaders } from './common';

const isApiConfigured = () => {
  return !!API_URL;
};

const isTestDataEnabled = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('useTestData') === 'true';
};

function getLocalItems(): DecorItem[] {
  const stored = localStorage.getItem('inventoryData');
  if (!stored) {
    localStorage.setItem('inventoryData', '[]');
    return [];
  }
  try {
    return JSON.parse(stored) as DecorItem[];
  } catch {
    return [];
  }
}

function saveLocalItems(items: DecorItem[]) {
  localStorage.setItem('inventoryData', JSON.stringify(items));
}

function inputToDecorItem(input: DecorItemInput): DecorItem {
  return {
    id: input.id ?? Date.now(),
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
    house: input.house,
    room: input.room,
    yearPeriod: String(input.date_period),
    quantity: input.quantity,
    acquisitionDate: input.acquisition_date,
    acquisitionValue: input.acquisition_value,
    acquisitionCurrency: input.acquisition_currency,
    valuationDate: input.appraisal_date,
    valuation: input.appraisal_value,
    valuationCurrency: input.appraisal_currency,
    valuationPerson: input.appraisal_entity,
    description: input.description,
    notes: input.notes,
    condition: 'good',
    image: '/placeholder.svg',
    deleted: input.is_deleted ?? false,
    history: [],
    version: input.version,
  };
}

export function decorItemToInput(item: DecorItem): DecorItemInput {
  return {
    id: item.id,
    code: item.code,
    name: item.title,
    creator: item.artist || '',
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
    quantity: item.quantity || 1,
    house: item.house,
    room: item.room,
    room_code: item.room || '',
    acquisition_date: item.acquisitionDate,
    acquisition_value: item.acquisitionValue,
    acquisition_currency: item.acquisitionCurrency,
    appraisal_date: item.valuationDate,
    appraisal_value: item.valuation,
    appraisal_currency: item.valuationCurrency,
    appraisal_entity: item.valuationPerson,
    description: item.description,
    notes: item.notes,
    version: item.version,
    is_deleted: item.deleted || false,
  };
}

export async function fetchDecorItems(): Promise<DecorItem[]> {
  const testDataEnabled = isTestDataEnabled();
  
  if (testDataEnabled) {
    return Promise.resolve(testDecorItems);
  }
  
  if (!isApiConfigured()) {
    return Promise.resolve([]);
  }
  
  try {
    const response = await fetch(`${API_URL}/items`, {
      headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
    });
    if (!response.ok) throw new Error('API request failed');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch decor items:', error);
    return [];
  }
}

export async function fetchDecorItem(
  id: number | string,
): Promise<DecorItem | null> {
  const testDataEnabled = isTestDataEnabled();
  
  if (testDataEnabled) {
    return Promise.resolve(
      testDecorItems.find((i) => i.id === Number(id)) || null,
    );
  }
  
  if (!isApiConfigured()) {
    return Promise.resolve(null);
  }
  
  try {
    const response = await fetch(`${API_URL}/items/${id}`, {
      headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
    });
    if (!response.ok) throw new Error('Failed to fetch item');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch decor item:', error);
    return null;
  }
}

export async function fetchBookItems(): Promise<BookItem[]> {
  const testDataEnabled = isTestDataEnabled();
  
  if (testDataEnabled) {
    return Promise.resolve(testBooks);
  }
  
  if (!isApiConfigured()) {
    return Promise.resolve([]);
  }
  
  try {
    const response = await fetch(`${API_URL}/books`, {
      headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
    });
    if (!response.ok) throw new Error('API request failed');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch book items:', error);
    return [];
  }
}

export async function fetchMusicItems(): Promise<MusicItem[]> {
  const testDataEnabled = isTestDataEnabled();
  
  if (testDataEnabled) {
    return Promise.resolve(testMusic);
  }
  
  if (!isApiConfigured()) {
    return Promise.resolve([]);
  }
  
  try {
    const response = await fetch(`${API_URL}/music`, {
      headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
    });
    if (!response.ok) throw new Error('API request failed');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch music items:', error);
    return [];
  }
}

export async function createDecorItem(
  input: DecorItemInput,
): Promise<DecorItem> {
  const testDataEnabled = isTestDataEnabled();
  
  if (testDataEnabled || !isApiConfigured()) {
    const items = getLocalItems();
    const newItem = inputToDecorItem(input);
    const nextId =
      items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    newItem.id = nextId;
    items.push(newItem);
    saveLocalItems(items);
    return Promise.resolve(newItem);
  }
  
  try {
    const response = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error('Failed to create item');
    return await response.json();
  } catch (error) {
    console.error('Failed to create decor item:', error);
    throw error;
  }
}

export async function updateDecorItem(
  id: number | string,
  input: DecorItemInput,
): Promise<DecorItem> {
  const testDataEnabled = isTestDataEnabled();
  
  if (testDataEnabled || !isApiConfigured()) {
    const items = getLocalItems();
    const idx = items.findIndex((i) => i.id === Number(id));
    const existing = idx >= 0 ? items[idx] : null;
    const updated = inputToDecorItem({ ...input, id: Number(id) });
    if (existing) {
      const history = existing.history
        ? [...existing.history, { ...existing }]
        : [{ ...existing }];
      updated.history = history;
      updated.version = (existing.version || 1) + 1;
      items[idx] = updated;
    } else {
      items.push(updated);
    }
    saveLocalItems(items);
    return Promise.resolve(updated);
  }
  
  try {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'PUT',
      headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error('Failed to update item');
    return await response.json();
  } catch (error) {
    console.error('Failed to update decor item:', error);
    throw error;
  }
}

export async function deleteDecorItem(id: number): Promise<void> {
  const testDataEnabled = isTestDataEnabled();
  
  if (testDataEnabled || !isApiConfigured()) {
    const items = getLocalItems().map((i) =>
      i.id === id ? { ...i, deleted: true } : i,
    );
    saveLocalItems(items);
    return Promise.resolve();
  }
  
  try {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE',
      headers: withAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete item');
  } catch (error) {
    console.error('Failed to delete decor item:', error);
    throw error;
  }
}

export async function restoreDecorItem(
  id: number,
  version: DecorItemInput,
): Promise<DecorItem> {
  const testDataEnabled = isTestDataEnabled();
  
  if (testDataEnabled || !isApiConfigured()) {
    const items = getLocalItems();
    const idx = items.findIndex((i) => i.id === id);
    if (idx < 0) throw new Error('Item not found');
    const current = items[idx];
    const restored = inputToDecorItem({ ...version, id });
    const history = current.history
      ? [...current.history, { ...current }]
      : [{ ...current }];
    restored.history = history;
    restored.version = (current.version || 1) + 1;
    restored.deleted = false;
    items[idx] = restored;
    saveLocalItems(items);
    return Promise.resolve(restored);
  }
  
  try {
    const response = await fetch(`${API_URL}/items/${id}/restore`, {
      method: 'POST',
      headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(version),
    });
    if (!response.ok) throw new Error('Failed to restore item');
    return await response.json();
  } catch (error) {
    console.error('Failed to restore decor item:', error);
    throw error;
  }
}
