export interface SocketOptions {
  path: string;
  reconnectionAttempts?: number;
}

export interface ServerConfig {
  url: string;
  authToken: string;
  config: SocketOptions;
}
