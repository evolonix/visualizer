import { Inject, Injectable } from '@angular/core';
import { select } from '@ngneat/elf';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { BOOTSTRAP_SETTINGS, BootstrapSettings } from '@degreed/core-angular';
import { readFirst } from '@degreed/rsm';
import { AuthServerResponse } from '@engage/remote-api';

import { offlineCache } from './auth.cache';
import { AuthDataService } from './auth.data-service';
import { AuthState } from './auth.models';
import { AuthStore } from './auth.store';

@Injectable()
export class AuthFacade {
  private _redirectUrl = '';
  /**
   * When AuthGuard redirects to login, the current 'location.href'
   * will be cached and then RESTORED after login
   */
  set redirectUrl(value: string) {
    const root = window?.location.origin || '';
    const containsRoot = !!root && value.indexOf(root) === 0;

    this._redirectUrl = containsRoot ? value.slice(root.length) : value;
  }
  get redirectUrl(): string {
    return this._redirectUrl;
  }

  state$ = this.store.state$;
  status$ = this.store.status$;
  authToken$ = this.state$.pipe(select((state) => state.authToken));
  isAuthenticated$ = this.state$.pipe(select((state) => state.isAuthenticated));

  /**
   * Access to Bearer Token
   * Note: this is set in the facade during login or refresh activity
   */
  get authToken(): string {
    return readFirst<string>(this.authToken$);
  }
  constructor(
    private api: AuthDataService,
    private store: AuthStore,
    @Inject(BOOTSTRAP_SETTINGS) private apiSettings: BootstrapSettings
  ) {
    this.store.updateAuthentication('', this.apiSettings.authToken);
  }

  /**
   * Login user with server, save name+token to offline cache
   */
  login(username: string, password: string): Observable<boolean> {
    const clearToken = (e: Error) => {
      this.store.updateAuthentication(username, '');
      offlineCache.removeAuthentication();
      console.warn(`login failed: ${e.message}`);

      return of(false);
    };
    const saveToken = (response: AuthServerResponse) => {
      offlineCache.saveAuthentication(response.payload);

      const { userName: name, accessToken } = response.payload;
      this.store.updateAuthentication(name, accessToken);
    };

    return this.api.login(username, password).pipe(
      this.store.trackLoadStatus(),
      tap(saveToken),
      map(() => true),
      catchError(clearToken)
    );
  }

  /**
   * Logout user: notify server, clear offline catch
   */
  logout(): Observable<boolean> {
    const userName = this.store.useQuery((s: AuthState) => s.userName);
    const clearToken = (value: boolean) => {
      this.store.updateAuthentication(userName, '');
      offlineCache.removeAuthentication();
      return value;
    };

    // Logout from server and ALWAYS
    // clear client-side auth token

    return this.api.logout(userName).pipe(
      catchError(() => of(false)),
      map(clearToken)
    );
  }
}
