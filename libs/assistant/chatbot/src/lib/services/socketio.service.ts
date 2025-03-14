import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { io, Socket } from 'socket.io-client';
import { ServerConfig, SocketOptions } from '../model/server';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  private socket!: Socket;
  private SESSION_ID = '';
  private scope = '';
  private url = '';
  private authToken = '';
  private socketConfig!: SocketOptions;

  constructor(private utils: UtilitiesService) {
    this.SESSION_ID = this.utils.getRandomUID();
  }

  setConfig(serverConfig: ServerConfig) {
    if (this.url) return;
    const { url, config, authToken } = serverConfig;
    this.url = url;
    this.socketConfig = config;
    this.authToken = authToken;
  }

  init(serverConfig: ServerConfig) {
    this.setConfig(serverConfig);
    if (this.isConnected()) {
      this.disconnect();
    }
    this.connect();
  }

  connect() {
    const url = this.url + '?session_id=' + this.SESSION_ID;
    this.socket = io(url, {
      ...this.socketConfig,
      extraHeaders: { Authorization: `Bearer ${this.authToken ?? ''}` },
    });
  }

  onMessage(): Observable<string> {
    return new Observable<string>((observer) => {
      this.socket.on('query', (message: string) => {
        observer.next(message);
      });
    });
  }

  getPayload(query: string, correlation_id: string, audio: any = null) {
    return {
      session_id: this.SESSION_ID,
      correlation_id,
      scope: this.scope,
      audio,
      query,
    };
  }

  setScope(scope: string) {
    this.scope = scope;
  }

  sendMessage(query: string, correlation_id: string, audio: any = null) {
    this.socket.emit('query', this.getPayload(query, correlation_id, audio));
  }

  resetConnection() {
    this.SESSION_ID = this.utils.getRandomUID();
    this.scope = '';
    this.disconnect();
    this.connect();
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getSessionId(): string {
    return this.SESSION_ID;
  }

  disconnect() {
    this.socket.disconnect();
  }
}
