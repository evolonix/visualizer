import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor } from '@angular/common/http';

import { Observable } from 'rxjs';

/**
 * The Degreed APIs require a CSRF token to be sent in the header of every request.
 *
 * XSRF is a security mechanism that prevents cross-site request forgery attacks.
 */
@Injectable()
export class XsrfInterceptor implements HttpInterceptor {
  constructor(private tokenExtractor: HttpXsrfTokenExtractor) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cookieheaderName = 'X-XSRF-TOKEN';
    const csrfToken = this.tokenExtractor.getToken() as string;
    if (csrfToken !== null && !req.headers.has(cookieheaderName)) {
      req = req.clone({ headers: req.headers.set(cookieheaderName, csrfToken) });
    }
    return next.handle(req);
  }
}
