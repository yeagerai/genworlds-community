import { Client as ColyseusClient } from 'colyseus.js';

export class WsClient {
  public static new(): ColyseusClient {
    const wsClient = new ColyseusClient('ws://localhost:5000');
    return wsClient;
  }
}
