/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, catchError, throwError } from 'rxjs';

import { AUTHENTICATION_REQUIRED } from '@degreed/core-angular';
import { AuthFacade } from './auth.facade';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private facade: AuthFacade,
    private router: Router
  ) {}

  /**
   * Auth interceptor for both outgoing requests and incoming responses
   * - Outgoing: inject an accessToken for protected REST Urls
   * - Incoming: report Auth error and navigate to '/login'
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const requiresToken = this.isProtectedUrl(req);
    const navigateToLogin = this.onAuthError.bind(this, req);

    if (requiresToken) {
      const response$ = next.handle(this.injectBearerToken(req));
      // TODO: navigate to error page or handle error in view in some way
      return response$.pipe(catchError(navigateToLogin));
    }

    return next.handle(req);
  }

  /**
   * Does the outgoing HTTP request require a BearToken?
   * NOTE: this requires HTTPContext to be added to each protected REST calls!
   */
  private isProtectedUrl(req: HttpRequest<any>) {
    return !!req.context.get(AUTHENTICATION_REQUIRED);
  }

  /**
   * Add a 'authorization' Bearer token to the request headers
   */
  private injectBearerToken(req: HttpRequest<any>): HttpRequest<any> {
    const isLoggedIn = !!this.facade.authToken;
    const update = {
      setHeaders: {
        authorization: `Bearer ${this.facade.authToken}`,
      },
    };

    return isLoggedIn ? req.clone(update) : req;
  }

  /**
   * For protected route HTTP Requests, report auth errors
   * and auto-navigate to 'login'
   *
   */
  private onAuthError(req: HttpRequest<any>, event: HttpErrorResponse) {
    // const navigateToLogin = () => {
    //   this.router.navigateByUrl('/login');
    // };
    // const reportError = () => of(event.error);

    // return this.facade.logout().pipe(tap(navigateToLogin), switchMap(reportError));

    console.log(`${req.url} failed with: ${JSON.stringify(event.error)}`);
    return throwError(() => event.error);
  }
}
