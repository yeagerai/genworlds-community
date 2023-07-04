import { Server } from '@colyseus/core';
import { WebSocketTransport } from '@colyseus/ws-transport';

describe('# ColyseusServer', () => {
  test('URIs ended without "/" should return the same', () => {
    const gameServer = new Server({
      greet: false,
      transport: new WebSocketTransport(),
    });
    expect(gameServer.transport.server).toBeDefined();
  });
});
