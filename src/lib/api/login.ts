
import { API_URL } from './common';
import type { AccessLevel, LoginResult } from '@/types/auth';

const ACCESS_LEVEL_KEY = 'accessLevel';

const HARD_CODED_USERS: Record<
  string,
  { password: string; accessLevel: AccessLevel; demoMode?: boolean }
> = {
  viewer: { password: 'password123', accessLevel: 'view', demoMode: true },
  editor: { password: 'password123', accessLevel: 'write', demoMode: true },
};

function applyDemoFlags() {
  localStorage.setItem('isDemoUser', 'true');
  localStorage.setItem('useTestData', 'true');
}

function applyAccessLevel(level: AccessLevel) {
  localStorage.setItem(ACCESS_LEVEL_KEY, level);
}

function clearDemoFlags() {
  localStorage.removeItem('isDemoUser');
}

export async function login(
  username: string,
  password: string,
): Promise<LoginResult> {
  // Check if these are demo credentials
  const demoUsername =
    import.meta.env.VITE_DEMO_EMAIL ||
    import.meta.env.VITE_DEMO_USERNAME ||
    'demo';
  const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || 'password123';

  const isDemoLogin = username === demoUsername && password === demoPassword;

  if (isDemoLogin) {
    applyDemoFlags();
    applyAccessLevel('write');
    return Promise.resolve({ accessLevel: 'write' });
  }

  const hardCodedUser = HARD_CODED_USERS[username];
  if (hardCodedUser && hardCodedUser.password === password) {
    if (hardCodedUser.demoMode) {
      applyDemoFlags();
    } else {
      clearDemoFlags();
    }
    applyAccessLevel(hardCodedUser.accessLevel);
    return Promise.resolve({ accessLevel: hardCodedUser.accessLevel });
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

  clearDemoFlags();
  applyAccessLevel('write');
  localStorage.removeItem('useTestData');

  return { accessLevel: 'write' };
}

export async function logout(): Promise<void> {
  clearDemoFlags();
  localStorage.removeItem('useTestData');
  localStorage.removeItem(ACCESS_LEVEL_KEY);

  await fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function checkAuth(): Promise<boolean> {
  if (localStorage.getItem(ACCESS_LEVEL_KEY)) {
    return true;
  }

  if (localStorage.getItem('isDemoUser') === 'true') {
    return true;
  }

  const response = await fetch(`${API_URL}/auth/status`, {
    credentials: 'include',
  });

  if (response.ok && !localStorage.getItem(ACCESS_LEVEL_KEY)) {
    applyAccessLevel('write');
  }

  return response.ok;
}
