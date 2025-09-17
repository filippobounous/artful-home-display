import { HouseConfig, defaultHouses } from '@/types/inventory';
import { API_URL, withAuthHeaders } from './common';

function buildHeaders(contentType?: string) {
  const headers: Record<string, string> = {};
  if (contentType) headers['Content-Type'] = contentType;
  return withAuthHeaders(headers);
}

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
  return getAllHouses().filter((h) => !h.is_deleted);
}

function saveLocalHouses(houses: HouseConfig[]) {
  localStorage.setItem('houses', JSON.stringify(houses));
}

export async function fetchHouses(): Promise<HouseConfig[]> {
  try {
    const response = await fetch(`${API_URL}/houses`, {
      headers: buildHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch houses');
    const data = await response.json();
    saveLocalHouses(data);
    return data.filter((h: HouseConfig) => !h.is_deleted);
  } catch {
    return getLocalHouses();
  }
}

export async function createHouse(house: HouseConfig) {
  try {
    const response = await fetch(`${API_URL}/houses`, {
      method: 'POST',
      headers: buildHeaders('application/json'),
      body: JSON.stringify(house),
    });
    if (!response.ok) throw new Error('Failed to create house');
    const data = await response.json();
    const houses = getAllHouses();
    saveLocalHouses([...houses, { ...data, is_deleted: false, history: [] }]);
    return data;
  } catch {
    const houses = getAllHouses();
    const newHouse = { ...house, is_deleted: false, history: [] };
    saveLocalHouses([...houses, newHouse]);
    return newHouse;
  }
}

export async function updateHouse(id: string, updates: Partial<HouseConfig>) {
  try {
    const response = await fetch(`${API_URL}/houses/${id}`, {
      method: 'PUT',
      headers: buildHeaders('application/json'),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update house');
    const data = await response.json();
    const houses = getAllHouses().map((h) => (h.id === data.id ? data : h));
    saveLocalHouses(houses);
    return data;
  } catch {
    const houses = getAllHouses();
    let updatedHouse: HouseConfig | null = null;
    const updated = houses.map((h) => {
      if (h.id === id) {
        const history = h.history ? [...h.history, { ...h }] : [{ ...h }];
        updatedHouse = {
          ...h,
          ...updates,
          version: (h.version || 1) + 1,
          history,
        };
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
      method: 'DELETE',
      headers: buildHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete house');
    const houses = getAllHouses().map((h) =>
      h.id === id ? { ...h, is_deleted: true } : h,
    );
    saveLocalHouses(houses);
    return true;
  } catch {
    const houses = getAllHouses().map((h) =>
      h.id === id ? { ...h, is_deleted: true } : h,
    );
    saveLocalHouses(houses);
    return true;
  }
}

export { getAllHouses, getLocalHouses, saveLocalHouses };
