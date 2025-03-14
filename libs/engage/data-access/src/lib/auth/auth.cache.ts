import { LoginResponse } from '@engage/remote-api';

enum StorageKeys {
  userName = 'userName',
  accessToken = 'accessToken',
  refreshToken = 'refreshToken',
  expires = 'expires',
}

export const offlineCache = {
  /**
   *
   */
  isAuthenticated: (): boolean => {
    const content = localStorage.getItem(StorageKeys.accessToken);
    return !!content;
  },

  /**
   *
   */
  loadAuthentication: (): [string, string, boolean] => {
    const userName = localStorage.getItem(StorageKeys.userName) || '';
    const token = localStorage.getItem(StorageKeys.accessToken) || '';

    return [userName, token, offlineCache.isAuthenticated()];
  },

  /**
   *
   */
  saveAuthentication: ({ userName, accessToken, expires = -1, refreshToken = '' }: LoginResponse): void => {
    localStorage.setItem(StorageKeys.accessToken, accessToken || '');
    localStorage.setItem(StorageKeys.userName, userName);

    localStorage.setItem(StorageKeys.expires, expires.toString());
    localStorage.setItem(StorageKeys.refreshToken, refreshToken);
  },

  /**
   *
   */
  removeAuthentication: (): void => {
    localStorage.removeItem(StorageKeys.accessToken);
    localStorage.removeItem(StorageKeys.expires);
    localStorage.removeItem(StorageKeys.refreshToken);
  },
};
