const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

import { InventoryItem } from '@/types/inventory';
import { sampleItems } from '@/data/sampleData';

function getAllInventory(): InventoryItem[] {
  const stored = localStorage.getItem('inventoryData');
  if (stored) {
    try {
      return JSON.parse(stored) as InventoryItem[];
    } catch {
      // fall through to sample items
    }
  }
  localStorage.setItem('inventoryData', JSON.stringify(sampleItems));
  return [...sampleItems];
}

function getLocalInventory(): InventoryItem[] {
  return getAllInventory().filter(item => !item.deleted);
}

function saveLocalInventory(items: InventoryItem[]) {
  localStorage.setItem('inventoryData', JSON.stringify(items));
}

export async function fetchInventory(): Promise<InventoryItem[]> {
  try {
    const response = await fetch(`${API_URL}/items`);
    if (!response.ok) throw new Error('Failed to fetch items');
    const data = await response.json();
    saveLocalInventory(data);
    return data.filter((item: InventoryItem) => !item.deleted);
  } catch {
    return getLocalInventory();
  }
}

export async function createInventoryItem(item: InventoryItem) {
  try {
    const response = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (!response.ok) throw new Error('Failed to create item');
    const data = await response.json();
    const items = getAllInventory();
    // ensure local storage stays in sync
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

export async function updateInventoryItem(id: number | string, updates: InventoryItem) {
  try {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update item');
    const data = await response.json();
    const items = getAllInventory().map(item => item.id === data.id ? data : item);
    saveLocalInventory(items);
    return data;
  } catch {
    const items = getAllInventory();
    let updatedItem: InventoryItem | null = null;
    const updated = items.map(item => {
      if (item.id === Number(id)) {
        const history = item.history ? [...item.history, { ...item }] : [{ ...item }];
        updatedItem = { ...item, ...updates, id: Number(id), history };
        return updatedItem;
      }
      return item;
    });
    saveLocalInventory(updated);
    return updatedItem as InventoryItem;
  }
}

export async function deleteInventoryItem(id: number | string) {
  try {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE',
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
