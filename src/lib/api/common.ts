
export const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:8000';
export const API_KEY = import.meta.env.VITE_API_KEY;
export const API_HEALTH_PATH =
  import.meta.env.VITE_API_HEALTH_PATH || '/health';

export function withAuthHeaders(
  base: Record<string, string> = {},
): Record<string, string> {
  const headers = { ...base };
  if (API_KEY) {
    headers.Authorization = `Bearer ${API_KEY}`;
  }
  return headers;
}
