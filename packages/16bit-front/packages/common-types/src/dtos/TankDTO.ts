import { RoomId, TankId } from '@/valueObjects';
import { MAPS } from '@/enums';

export interface TankDTO {
  id: TankId;
  roomId: RoomId;
  mapId: MAPS;
}
