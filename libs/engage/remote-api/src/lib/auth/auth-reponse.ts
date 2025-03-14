import { StatusReponse } from '../_responses';

export interface LoginResponse {
  userName: string;
  accessToken: string;
  refreshToken?: string;
  expires?: number;
}

export interface AuthServerResponse {
  status: StatusReponse;
  payload: LoginResponse;
}
