import { Server, matchMaker } from '@colyseus/core';

import { TankRoom, TankRoomCreateOptions } from './rooms/TankRoom';

export async function initColyseusServer(gameServer: Server): Promise<void> {
  gameServer.define('tank', TankRoom);

  const roomOptions: TankRoomCreateOptions = {
    mapId: '1',
    maxClients: 100,
  };
  await matchMaker.createRoom('tank', roomOptions);
}
