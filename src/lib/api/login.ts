
import { API_URL } from './common';

export async function login(username: string, password: string): Promise<void> {
  // Check if these are demo credentials
  const demoUsername = import.meta.env.VITE_DEMO_EMAIL || import.meta.env.VITE_DEMO_USERNAME || 'demo';
  const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || 'password123';
  
  const isDemoLogin = (username === demoUsername && password === demoPassword);
  
  if (isDemoLogin) {
    // For demo login, just set a flag and enable test data mode
    localStorage.setItem('isDemoUser', 'true');
    localStorage.setItem('useTestData', 'true');
    return Promise.resolve();
  }

  // Regular API login flow
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
  
  // Clear demo user flag for regular login
  localStorage.removeItem('isDemoUser');
}

export async function logout(): Promise<void> {
  // Clear demo user flag
  localStorage.removeItem('isDemoUser');
  
  await fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function checkAuth(): Promise<boolean> {
  // Check if user is logged in as demo user
  if (localStorage.getItem('isDemoUser') === 'true') {
    return true;
  }
  
  const response = await fetch(`${API_URL}/auth/status`, {
    credentials: 'include',
  });
  return response.ok;
}
