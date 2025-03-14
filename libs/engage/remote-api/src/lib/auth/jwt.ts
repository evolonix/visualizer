export interface Jwt {
  id: string;
  accessToken: string;
  refreshToken: string;
  expires: number;
}
