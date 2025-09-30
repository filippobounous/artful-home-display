export type AccessLevel = 'view' | 'write';

export interface LoginResult {
  accessLevel: AccessLevel;
}
