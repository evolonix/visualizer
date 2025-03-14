import { ReactiveStore, updateRequestStatus } from '@degreed/rsm';

import { AuthState, initState } from './auth.models';

/**
 * Store to track authentication and auth verfication progress
 */
export class AuthStore extends ReactiveStore<AuthState, { id: string }> {
  constructor() {
    super('auth', initState);
  }

  updateAuthentication(userName: string, authToken: string): void {
    const isAuthenticated = !!authToken;
    const updateState = (state: AuthState) => ({ ...state, userName, authToken, isAuthenticated });

    this._store.update(updateState, updateRequestStatus('success'));
  }
}
