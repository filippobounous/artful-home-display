import { API_URL } from './common';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const form = new FormData();
  form.append('username', username);
  form.append('password', password);

  let response: Response;
  try {
    response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      body: form,
    });
  } catch {
    // If the API can't be reached, allow the demo credentials
    if (username === 'admin' && password === 'password123') {
      return {
        access_token: 'demo_token_' + Date.now(),
        token_type: 'Bearer',
      };
    }
    throw new Error('Unable to reach authentication server');
  }

  if (!response.ok) {
    // Fallback to offline authentication in development or when explicitly enabled
    const allowDemo = import.meta.env.VITE_ALLOW_DEMO_LOGIN === 'true';
    if (
      (import.meta.env.DEV || allowDemo) &&
      username === 'admin' &&
      password === 'password123'
    ) {
      return {
        access_token: 'demo_token_' + Date.now(),
        token_type: 'Bearer',
      };
    }
    throw new Error('Invalid credentials');
  }

  return response.json();
}
