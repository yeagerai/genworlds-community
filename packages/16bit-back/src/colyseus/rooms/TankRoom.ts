// import http from 'http';
import { Client, Room } from '@colyseus/core';

import { WsHandler } from '@app/api/ws/WsHandler';

import { TankRoomState } from '../schemas/TankRoomState';
import { Spectator } from '../schemas/Spectator';

export interface TankRoomCreateOptions {
  maxClients: number;
  // ---
  mapId: string;
}

export class TankRoom extends Room<TankRoomState> {
  private wsHandler: WsHandler;

  public override onCreate(options: TankRoomCreateOptions): void {
    this.autoDispose = false;
    this.maxClients = options.maxClients;

    const roomState = new TankRoomState();
    roomState.mapId = options.mapId;
    this.setState(roomState);

    this.wsHandler = new WsHandler(roomState);
    this.wsHandler.start();
  }

  // Authorize client based on provided options before WebSocket handshake is complete
  // public override onAuth(client: Client, options: any, request: http.IncomingMessage): void {}

  // When client successfully join the room
  public override onJoin(client: Client): void {
    this.state.spectators.set(client.sessionId, new Spectator(client.sessionId));
    // console.log(JSON.stringify(client));
  }

  // When a client leaves the room
  public override onLeave(client: Client): void {
    if (this.state.spectators.has(client.sessionId)) {
      this.state.spectators.delete(client.sessionId);
    }
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  public override onDispose(): void {
    this.wsHandler.stop();
  }
}
