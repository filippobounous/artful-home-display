import { createContext } from 'react';
import type { AccessLevel } from '@/types/auth';

export interface AuthContextValue {
  accessLevel: AccessLevel;
  canWrite: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  completeLogin: (level: AccessLevel) => void;
  refreshAuth: () => Promise<void>;
  completeLogout: () => void;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
