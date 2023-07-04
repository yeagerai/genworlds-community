import * as Colyseus from 'colyseus.js';
import { MAPS, Tank, TankId, Tilemap } from '@yeager/common-types';
import { loadTilemap } from '@yeager/tank-maps';
import { getConfig } from '@/config';

const TANK_MOCK_BASE: Tank = {
  id: '',
  roomId: '',
  mapId: MAPS.POKER,
  tilemap: {} as Tilemap,
};

export class TankService {
  private client!: Colyseus.Client;
  private readonly tanks: Map<TankId, Tank> = new Map<TankId, Tank>([
    ['1', { ...TANK_MOCK_BASE, id: '1', mapId: MAPS.POKER }],
    ['2', { ...TANK_MOCK_BASE, id: '2', mapId: MAPS.LABORATORY }],
    ['3', { ...TANK_MOCK_BASE, id: '3', mapId: MAPS.LIBRARY }],
    ['2001', { ...TANK_MOCK_BASE, id: '2001', mapId: MAPS.TEST_POKER }],
    ['2002', { ...TANK_MOCK_BASE, id: '2002', mapId: MAPS.TEST_LABORATORY }],
    ['2003', { ...TANK_MOCK_BASE, id: '2003', mapId: MAPS.TEST_LIBRARY }],
  ]);

  private getClient(): Colyseus.Client {
    if (this.client === undefined) {
      const appConfig = getConfig();
      this.client = new Colyseus.Client(appConfig.websocket);
    }

    return this.client;
  }

  async getTank(tankId: TankId): Promise<Tank> {
    const client = this.getClient();

    let rooms: Colyseus.RoomAvailable<{
      roomdId: string;
    }>[] = [];

    try {
      rooms = await client.getAvailableRooms<{ roomdId: string }>();
    } catch (error) {
      // nothing to do here
    }

    let tank: Tank | undefined = this.tanks.get(tankId);

    if (tank === undefined) {
      tank = { ...TANK_MOCK_BASE, id: tankId };
    }

    tank.tilemap = loadTilemap(tank.mapId);
    tank.roomId = rooms.length ? rooms[0].roomId : '';

    return tank;
  }

  async joinRoomById<T>(roomId: string): Promise<Colyseus.Room<T>> {
    const client = this.getClient();
    const room = await client.joinById<T>(roomId);

    return room;
  }
}

const tankServiceInstance = new TankService();
export default tankServiceInstance;
