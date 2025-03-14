/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomingHttpHeaders } from 'http';
import jwt from 'jsonwebtoken';

import { AuthServerResponse } from '@engage/remote-api';
import { UserService } from './user.service';

const SECRET_KEY = '123456789';
const expiresIn = '3h';

type TokenCache = Record<string, any>;

const ERRORS = {
  TOKEN_INVALID: 'Access Token is not valid',
  TOKEN_REVOKED: 'Error accessToken is revoked',
  INVALID_USER_PASSWORD: 'Invalid userName or password',
  AUTH_HEADER_MISSING: 'Bearer token not found in authorization header',
};

export type User = { userName: string };

/**
 * Authenticate incoming HTTP Requests
 */
export class Authenticator {
  tokenCache: TokenCache = {};

  constructor(private usersService: UserService) {}

  /**
   *
   */
  logout({ userName }) {
    delete this.tokenCache[userName];
  }

  /**
   * Login in known user and return access token
   */
  login({ userName, password }): [number, any] {
    const [allowed, message] = this.usersService.isAuthenticated(userName, password);
    if (!allowed) {
      return [401, { status: 401, message }];
    }

    const token = () => this.tokenCache[userName];
    if (!token()) {
      this.tokenCache[userName] = this.createToken({ userName, password });
    }

    const response: AuthServerResponse = {
      status: { code: 200 },
      payload: { accessToken: token(), userName },
    };

    return [200, response];
  }

  /**
   * Does the query param contain a valid 'token' param  or does the incoming
   * request headers contain a valid bearer token?
   */
  isAuthorized(request): [boolean, string | User] {
    const { headers, query } = request;
    let token = query['token'];
    if (!token && !this.hasBearerToken(headers)) {
      return [false, ERRORS.AUTH_HEADER_MISSING];
    }

    try {
      // !! for now we do NOT validate the token as this is
      // provided by the client and we trust it if it is present!

      token = token || headers.authorization.split(' ')[1];
      return !token ? [false, 'Missing AuthToken'] : [true, ''];

      // const status = this.verifyToken(token);
      // const verified = !(status instanceof Error);
      // const decoded = verified ? (jwtDecode<JwtPayload>(token) as User) : null;
      // return verified ? [true, decoded || ''] : [false, status.message];
    } catch (err) {
      return [false, JSON.stringify(err)];
    }
  }

  // **********************************************************************
  // ********************  Private Methods ********************************
  // **********************************************************************

  /**
   * Create a token from a payload
   */
  private createToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
  }

  /**
   * Verify the token
   */
  private verifyToken(token: string) {
    // const onDecoded = (err, decode) => {
    //   return decode !== undefined ? decode : err;
    // };

    // !! for now we do NOT validate the token as this is
    // return jwt.verify(token, SECRET_KEY, onDecoded);

    return !!token;
  }

  private hasBearerToken(headers: IncomingHttpHeaders): boolean {
    return headers.authorization?.split(' ')[0] === 'Bearer';
  }
}
