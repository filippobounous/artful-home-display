import { RoomConfig } from '@/types/inventory';
import { API_URL, withAuthHeaders } from './common';
import { getAllHouses, saveLocalHouses } from './houses';

function buildHeaders(contentType?: string) {
  const headers: Record<string, string> = {};
  if (contentType) headers['Content-Type'] = contentType;
  return withAuthHeaders(headers);
}

export async function addRoom(houseId: string, room: RoomConfig) {
  try {
    const response = await fetch(`${API_URL}/houses/${houseId}/rooms`, {
      method: 'POST',
      headers: buildHeaders('application/json'),
      body: JSON.stringify(room),
    });
    if (!response.ok) throw new Error('Failed to add room');
    const data = await response.json();
    const houses = getAllHouses().map((h) =>
      h.id === houseId
        ? {
            ...h,
            rooms: [...h.rooms, { ...data, is_deleted: false, history: [] }],
          }
        : h,
    );
    saveLocalHouses(houses);
    return data;
  } catch {
    const houses = getAllHouses().map((h) =>
      h.id === houseId
        ? {
            ...h,
            rooms: [...h.rooms, { ...room, is_deleted: false, history: [] }],
          }
        : h,
    );
    saveLocalHouses(houses);
    return { ...room, is_deleted: false, history: [] };
  }
}

export async function updateRoom(
  houseId: string,
  roomId: string,
  updates: Partial<RoomConfig>,
) {
  try {
    const response = await fetch(
      `${API_URL}/houses/${houseId}/rooms/${roomId}`,
      {
        method: 'PUT',
        headers: buildHeaders('application/json'),
        body: JSON.stringify(updates),
      },
    );
    if (!response.ok) throw new Error('Failed to update room');
    const data = await response.json();
    const houses = getAllHouses().map((h) =>
      h.id === houseId
        ? { ...h, rooms: h.rooms.map((r) => (r.id === roomId ? data : r)) }
        : h,
    );
    saveLocalHouses(houses);
    return data;
  } catch {
    const houses = getAllHouses();
    let updatedRoom: RoomConfig | null = null;
    const updated = houses.map((h) => {
      if (h.id === houseId) {
        return {
          ...h,
          rooms: h.rooms.map((r) => {
            if (r.id === roomId) {
              const history = r.history ? [...r.history, { ...r }] : [{ ...r }];
              updatedRoom = { ...r, ...updates, history };
              return updatedRoom;
            }
            return r;
          }),
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
    const response = await fetch(
      `${API_URL}/houses/${houseId}/rooms/${roomId}`,
      {
        method: 'DELETE',
        headers: buildHeaders(),
      },
    );
    if (!response.ok) throw new Error('Failed to delete room');
    const houses = getAllHouses().map((h) =>
      h.id === houseId
        ? {
            ...h,
            rooms: h.rooms.map((r) =>
              r.id === roomId ? { ...r, is_deleted: true } : r,
            ),
          }
        : h,
    );
    saveLocalHouses(houses);
    return true;
  } catch {
    const houses = getAllHouses().map((h) =>
      h.id === houseId
        ? {
            ...h,
            rooms: h.rooms.map((r) =>
              r.id === roomId ? { ...r, is_deleted: true } : r,
            ),
          }
        : h,
    );
    saveLocalHouses(houses);
    return true;
  }
}
