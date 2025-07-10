import { API_URL, API_KEY } from "./common";

export interface RoomType {
  id: string;
  name: string;
}

function buildHeaders() {
  const headers: Record<string, string> = {};
  if (API_KEY) headers["X-API-Key"] = API_KEY;
  return headers;
}

export async function fetchRoomTypes(): Promise<RoomType[]> {
  try {
    const response = await fetch(`${API_URL}/roomtypes`, {
      headers: buildHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch room types");
    const data = await response.json();
    localStorage.setItem("roomTypes", JSON.stringify(data));
    return data as RoomType[];
  } catch {
    const stored = localStorage.getItem("roomTypes");
    if (stored) {
      try {
        return JSON.parse(stored) as RoomType[];
      } catch {
        // ignore parse errors
      }
    }
    return [];
  }
}
