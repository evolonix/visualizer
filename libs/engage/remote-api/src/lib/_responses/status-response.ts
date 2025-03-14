export interface StatusReponse {
  code: number;
  message?: string;
  exception?: Record<string, never>;
}
