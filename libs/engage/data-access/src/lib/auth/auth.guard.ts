import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthFacade } from './auth.facade';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private router: Router,
    private facade: AuthFacade
  ) {}

  canActivate() {
    const routeToLogin = (isAuthenticated: boolean) => {
      this.facade.redirectUrl = !isAuthenticated ? window.location.href : '';

      return isAuthenticated || this.router.parseUrl('/login');
    };
    return this.facade.isAuthenticated$.pipe(map(routeToLogin));
  }
}
