import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { checkAuth as apiCheckAuth, logout as apiLogout } from '@/lib/api';
import type { AccessLevel } from '@/types/auth';
import { AuthContext, type AuthContextValue } from '@/context/AuthContext';

const ACCESS_LEVEL_KEY = 'accessLevel';

function readStoredAccessLevel(): AccessLevel {
  if (typeof window === 'undefined') {
    return 'view';
  }

  const stored = window.localStorage.getItem(ACCESS_LEVEL_KEY);
  return stored === 'write' ? 'write' : 'view';
}

function persistAccessLevel(level: AccessLevel) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(ACCESS_LEVEL_KEY, level);
}

function clearAccessLevel() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(ACCESS_LEVEL_KEY);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(() =>
    readStoredAccessLevel(),
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const completeLogin = useCallback((level: AccessLevel) => {
    persistAccessLevel(level);
    setAccessLevel(level);
    setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  const completeLogout = useCallback(() => {
    clearAccessLevel();
    setAccessLevel('view');
    setIsAuthenticated(false);
    setIsLoading(false);
  }, []);

  const refreshAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const authenticated = await apiCheckAuth();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setAccessLevel(readStoredAccessLevel());
      } else {
        clearAccessLevel();
        setAccessLevel('view');
      }
    } catch {
      clearAccessLevel();
      setAccessLevel('view');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      completeLogout();
    }
  }, [completeLogout]);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessLevel,
      canWrite: accessLevel === 'write',
      isAuthenticated,
      isLoading,
      completeLogin,
      refreshAuth,
      completeLogout,
      signOut,
    }),
    [
      accessLevel,
      completeLogin,
      completeLogout,
      isAuthenticated,
      isLoading,
      refreshAuth,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

