import { API_URL } from './common';

export async function login(username: string, password: string): Promise<void> {
  const form = new FormData();
  form.append('username', username);
  form.append('password', password);

  let response: Response;
  try {
    response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      body: form,
      credentials: 'include',
    });
  } catch {
    throw new Error('Unable to reach authentication server');
  }

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }
}

export async function logout(): Promise<void> {
  await fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function checkAuth(): Promise<boolean> {
  const response = await fetch(`${API_URL}/auth/status`, {
    credentials: 'include',
  });
  return response.ok;
}
