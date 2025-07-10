
import { API_URL } from './common';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  try {
    const form = new FormData();
    form.append('username', username);
    form.append('password', password);
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      body: form,
    });
    if (!response.ok) throw new Error('Invalid credentials');
    return response.json();
  } catch {
    // Fallback to offline authentication in development
    if (import.meta.env.DEV && username === "admin" && password === "password123") {
      return {
        access_token: "demo_token_" + Date.now(),
        token_type: "Bearer"
      };
    } else {
      throw new Error('Invalid credentials');
    }
  }
}
