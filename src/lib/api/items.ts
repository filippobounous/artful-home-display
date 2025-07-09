import { DecorItem } from '@/types/inventory';
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
  return getAllInventory().filter(item => !item.deleted);
}

function saveLocalInventory(items: DecorItem[]) {
  localStorage.setItem('inventoryData', JSON.stringify(items));
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

export async function createDecorItem(item: DecorItem) {
  try {
    const response = await fetch(`${API_URL}/decoritems`, {
      method: 'POST',
      headers: buildHeaders('application/json'),
      body: JSON.stringify(item)
    });
    if (!response.ok) throw new Error('Failed to create item');
    const data = await response.json();
    const items = getAllInventory();
    saveLocalInventory([...items, { ...data, deleted: false, history: [] }]);
    return data;
  } catch {
    const items = getAllInventory();
    const newId = Math.max(0, ...items.map(i => i.id || 0)) + 1;
    const newItem = { ...item, id: newId, deleted: false, history: [] };
    saveLocalInventory([...items, newItem]);
    return newItem;
  }
}

export async function updateDecorItem(id: number | string, updates: DecorItem) {
  try {
    const response = await fetch(`${API_URL}/decoritems/${id}`, {
      method: 'PUT',
      headers: buildHeaders('application/json'),
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update item');
    const data = await response.json();
    const items = getAllInventory().map(item => item.id === data.id ? data : item);
    saveLocalInventory(items);
    return data;
  } catch {
    const items = getAllInventory();
    let updatedItem: DecorItem | null = null;
    const updated = items.map(item => {
      if (item.id === Number(id)) {
        const history = item.history ? [...item.history, { ...item }] : [{ ...item }];
        updatedItem = { ...item, ...updates, id: Number(id), history };
        return updatedItem;
      }
      return item;
    });
    saveLocalInventory(updated);
    return updatedItem as DecorItem;
  }
}

export async function restoreDecorItem(id: number | string, version: DecorItem) {
  return updateDecorItem(id, version);
}

export async function deleteDecorItem(id: number | string) {
  try {
    const response = await fetch(`${API_URL}/decoritems/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete item');
    const items = getAllInventory().map(item => item.id === Number(id) ? { ...item, deleted: true } : item);
    saveLocalInventory(items);
    return true;
  } catch {
    const items = getAllInventory().map(item => item.id === Number(id) ? { ...item, deleted: true } : item);
    saveLocalInventory(items);
    return true;
  }
}
