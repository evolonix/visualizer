import { ElfStoreState } from '@degreed/rsm';
import { offlineCache } from './auth.cache';

export interface AuthState extends ElfStoreState {
  userName: string;
  isAuthenticated: boolean;
  authToken: string;
}

export const initState = (): Partial<AuthState> => {
  const [userName, authToken, isAuthenticated] = offlineCache.loadAuthentication();
  return { userName, authToken, isAuthenticated };
};
