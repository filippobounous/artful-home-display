
const apiEnvUrl =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';

export const API_CONFIGURED = Boolean(apiEnvUrl);

export const API_URL = apiEnvUrl || 'http://localhost:8000';
export const API_KEY = import.meta.env.VITE_API_KEY;
export const API_HEALTH_PATH =
  import.meta.env.VITE_API_HEALTH_PATH || '/health';

export function withAuthHeaders(
  base: Record<string, string> = {},
): Record<string, string> {
  const headers = { ...base };
  if (API_KEY) {
    headers['X-API-Key'] = API_KEY;
  }
  return headers;
}
