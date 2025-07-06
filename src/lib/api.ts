const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

import { InventoryItem } from '@/types/inventory';

export async function fetchInventory(): Promise<InventoryItem[]> {
  const response = await fetch(`${API_URL}/items`);
  if (!response.ok) {
    throw new Error('Failed to fetch items');
  }
  return response.json();
}

export async function createInventoryItem(item: InventoryItem) {
  const response = await fetch(`${API_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  if (!response.ok) {
    throw new Error('Failed to create item');
  }
  return response.json();
}

export async function updateInventoryItem(id: number | string, updates: InventoryItem) {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!response.ok) {
    throw new Error('Failed to update item');
  }
  return response.json();
}
