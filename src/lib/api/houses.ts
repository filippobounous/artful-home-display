import { HouseConfig, collectionDefaultHouses, type CollectionType } from '@/types/inventory';
import { API_URL, withAuthHeaders } from './common';

function buildHeaders(contentType?: string) {
  const headers: Record<string, string> = {};
  if (contentType) headers['Content-Type'] = contentType;
  return withAuthHeaders(headers);
}

const housesStorageKey = (collection: CollectionType) => `${collection}-houses`;

function getDefaults(collection: CollectionType): HouseConfig[] {
  return collectionDefaultHouses[collection] ?? [];
}

function getAllHouses(collection: CollectionType): HouseConfig[] {
  const stored = localStorage.getItem(housesStorageKey(collection));
  if (stored) {
    try {
      return JSON.parse(stored) as HouseConfig[];
    } catch {
      // ignore parse errors and fall back to defaults
    }
  }
  const defaults = getDefaults(collection);
  localStorage.setItem(housesStorageKey(collection), JSON.stringify(defaults));
  return [...defaults];
}

function getLocalHouses(collection: CollectionType): HouseConfig[] {
  return getAllHouses(collection).filter((h) => !h.is_deleted);
}

function saveLocalHouses(collection: CollectionType, houses: HouseConfig[]) {
  localStorage.setItem(housesStorageKey(collection), JSON.stringify(houses));
}

function getEndpoint(collection: CollectionType) {
  if (!API_URL) return '';
  if (collection === 'art') return `${API_URL}/houses`;
  return `${API_URL}/${collection}/houses`;
}

export async function fetchHouses(
  collection: CollectionType,
): Promise<HouseConfig[]> {
  try {
    const endpoint = getEndpoint(collection);
    if (!endpoint) throw new Error('API not configured');
    const response = await fetch(endpoint, {
      headers: buildHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch houses');
    const data = (await response.json()) as HouseConfig[];
    saveLocalHouses(collection, data);
    return data.filter((h) => !h.is_deleted);
  } catch {
    return getLocalHouses(collection);
  }
}

export async function createHouse(
  collection: CollectionType,
  house: HouseConfig,
) {
  try {
    const endpoint = getEndpoint(collection);
    if (!endpoint) throw new Error('API not configured');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: buildHeaders('application/json'),
      body: JSON.stringify(house),
    });
    if (!response.ok) throw new Error('Failed to create house');
    const data = (await response.json()) as HouseConfig;
    const houses = getAllHouses(collection);
    saveLocalHouses(collection, [
      ...houses,
      { ...data, is_deleted: false, history: data.history ?? [] },
    ]);
    return data;
  } catch {
    const houses = getAllHouses(collection);
    const newHouse = { ...house, is_deleted: false, history: house.history ?? [] };
    saveLocalHouses(collection, [...houses, newHouse]);
    return newHouse;
  }
}

export async function updateHouse(
  collection: CollectionType,
  id: string,
  updates: Partial<HouseConfig>,
) {
  try {
    const endpoint = getEndpoint(collection);
    if (!endpoint) throw new Error('API not configured');
    const response = await fetch(`${endpoint}/${id}`, {
      method: 'PUT',
      headers: buildHeaders('application/json'),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update house');
    const data = (await response.json()) as HouseConfig;
    const houses = getAllHouses(collection).map((h) =>
      h.id === data.id ? data : h,
    );
    saveLocalHouses(collection, houses);
    return data;
  } catch {
    const houses = getAllHouses(collection);
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
    saveLocalHouses(collection, updated);
    return updatedHouse as HouseConfig;
  }
}

export async function deleteHouse(collection: CollectionType, id: string) {
  try {
    const endpoint = getEndpoint(collection);
    if (!endpoint) throw new Error('API not configured');
    const response = await fetch(`${endpoint}/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete house');
    const houses = getAllHouses(collection).map((h) =>
      h.id === id ? { ...h, is_deleted: true } : h,
    );
    saveLocalHouses(collection, houses);
    return true;
  } catch {
    const houses = getAllHouses(collection).map((h) =>
      h.id === id ? { ...h, is_deleted: true } : h,
    );
    saveLocalHouses(collection, houses);
    return true;
  }
}

export {
  getAllHouses,
  getLocalHouses,
  saveLocalHouses,
  housesStorageKey,
};
