import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthServerResponse } from '@engage/remote-api';
import { Observable } from 'rxjs';

import { BOOTSTRAP_SETTINGS, BootstrapSettings } from '@degreed/core-angular';

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

// TODO: Remove login service later as this is only a temporary measure until there's a proper auth micro-service (and this service will be removed)
@Injectable()
export class AuthDataService {
  constructor(
    @Inject(BOOTSTRAP_SETTINGS) private apiSettings: BootstrapSettings,
    private httpClient: HttpClient
  ) {}

  login(userName: string, password: string): Observable<AuthServerResponse> {
    const url = `${this.apiSettings.rootUrl}/auth/token`;
    const request$ = this.httpClient.post<AuthServerResponse>(url, { userName, password }, HTTP_OPTIONS);

    return request$;
  }

  logout(userName: string): Observable<boolean> {
    const url = `${this.apiSettings.rootUrl}/auth/logout`;
    const request$ = this.httpClient.post<boolean>(url, { userName }, HTTP_OPTIONS);

    return request$;
  }
}
