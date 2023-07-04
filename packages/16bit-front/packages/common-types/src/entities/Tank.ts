import { RoomId, TankId } from '@/valueObjects';
import { MAPS } from '@/enums';
import { Tilemap } from '@/interfaces';

export interface Tank {
  id: TankId;
  roomId: RoomId;
  tilemap: Tilemap;
  mapId: MAPS;
}
