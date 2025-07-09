const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

import { DecorItem, HouseConfig, RoomConfig, defaultHouses } from '@/types/inventory';
import { sampleDecorItems } from '@/data/sampleData';

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
    const response = await fetch(`${API_URL}/decoritems`);
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

export async function updateDecorItem(id: number | string, updates: DecorItem) {
  try {
    const response = await fetch(`${API_URL}/decoritems/${id}`, {
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


// ---- Houses & Rooms ----

function getAllHouses(): HouseConfig[] {
  const stored = localStorage.getItem('houses');
  if (stored) {
    try {
      return JSON.parse(stored) as HouseConfig[];
    } catch {
      // fall through to defaults
    }
  }
  localStorage.setItem('houses', JSON.stringify(defaultHouses));
  return [...defaultHouses];
}

function getLocalHouses(): HouseConfig[] {
  return getAllHouses().filter(h => !h.deleted);
}

function saveLocalHouses(houses: HouseConfig[]) {
  localStorage.setItem('houses', JSON.stringify(houses));
}

export async function fetchHouses(): Promise<HouseConfig[]> {
  try {
    const response = await fetch(`${API_URL}/houses`);
    if (!response.ok) throw new Error('Failed to fetch houses');
    const data = await response.json();
    saveLocalHouses(data);
    return data.filter((h: HouseConfig) => !h.deleted);
  } catch {
    return getLocalHouses();
  }
}

export async function createHouse(house: HouseConfig) {
  try {
    const response = await fetch(`${API_URL}/houses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(house)
    });
    if (!response.ok) throw new Error('Failed to create house');
    const data = await response.json();
    const houses = getAllHouses();
    saveLocalHouses([...houses, { ...data, deleted: false, history: [] }]);
    return data;
  } catch {
    const houses = getAllHouses();
    const newHouse = { ...house, deleted: false, history: [] };
    saveLocalHouses([...houses, newHouse]);
    return newHouse;
  }
}

export async function updateHouse(id: string, updates: Partial<HouseConfig>) {
  try {
    const response = await fetch(`${API_URL}/houses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update house');
    const data = await response.json();
    const houses = getAllHouses().map(h => h.id === data.id ? data : h);
    saveLocalHouses(houses);
    return data;
  } catch {
    const houses = getAllHouses();
    let updatedHouse: HouseConfig | null = null;
    const updated = houses.map(h => {
      if (h.id === id) {
        const history = h.history ? [...h.history, { ...h }] : [{ ...h }];
        updatedHouse = { ...h, ...updates, history };
        return updatedHouse;
      }
      return h;
    });
    saveLocalHouses(updated);
    return updatedHouse as HouseConfig;
  }
}

export async function deleteHouse(id: string) {
  try {
    const response = await fetch(`${API_URL}/houses/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete house');
    const houses = getAllHouses().map(h => h.id === id ? { ...h, deleted: true } : h);
    saveLocalHouses(houses);
    return true;
  } catch {
    const houses = getAllHouses().map(h => h.id === id ? { ...h, deleted: true } : h);
    saveLocalHouses(houses);
    return true;
  }
}

export async function addRoom(houseId: string, room: RoomConfig) {
  try {
    const response = await fetch(`${API_URL}/houses/${houseId}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(room)
    });
    if (!response.ok) throw new Error('Failed to add room');
    const data = await response.json();
    const houses = getAllHouses().map(h =>
      h.id === houseId ? { ...h, rooms: [...h.rooms, { ...data, deleted: false, history: [] }] } : h
    );
    saveLocalHouses(houses);
    return data;
  } catch {
    const houses = getAllHouses().map(h =>
      h.id === houseId ? { ...h, rooms: [...h.rooms, { ...room, deleted: false, history: [] }] } : h
    );
    saveLocalHouses(houses);
    return { ...room, deleted: false, history: [] };
  }
}

export async function updateRoom(
  houseId: string,
  roomId: string,
  updates: Partial<RoomConfig>
) {
  try {
    const response = await fetch(`${API_URL}/houses/${houseId}/rooms/${roomId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update room');
    const data = await response.json();
    const houses = getAllHouses().map(h =>
      h.id === houseId
        ? { ...h, rooms: h.rooms.map(r => (r.id === roomId ? data : r)) }
        : h
    );
    saveLocalHouses(houses);
    return data;
  } catch {
    const houses = getAllHouses();
    let updatedRoom: RoomConfig | null = null;
    const updated = houses.map(h => {
      if (h.id === houseId) {
        return {
          ...h,
          rooms: h.rooms.map(r => {
            if (r.id === roomId) {
              const history = r.history ? [...r.history, { ...r }] : [{ ...r }];
              updatedRoom = { ...r, ...updates, history };
              return updatedRoom;
            }
            return r;
          })
        };
      }
      return h;
    });
    saveLocalHouses(updated);
    return updatedRoom as RoomConfig;
  }
}

export async function deleteRoom(houseId: string, roomId: string) {
  try {
    const response = await fetch(`${API_URL}/houses/${houseId}/rooms/${roomId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete room');
    const houses = getAllHouses().map(h =>
      h.id === houseId ? { ...h, rooms: h.rooms.map(r => r.id === roomId ? { ...r, deleted: true } : r) } : h
    );
    saveLocalHouses(houses);
    return true;
  } catch {
    const houses = getAllHouses().map(h =>
      h.id === houseId ? { ...h, rooms: h.rooms.map(r => r.id === roomId ? { ...r, deleted: true } : r) } : h
    );
    saveLocalHouses(houses);
    return true;
  }
}

