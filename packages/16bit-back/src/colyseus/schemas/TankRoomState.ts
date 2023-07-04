import { Schema as ColyseusSchema, type as ColyseusType, MapSchema } from '@colyseus/schema';

import { TankRoomSchema } from '@shared/colyseus/schemas';

import { AiAgent } from './AiAgent';
import { Spectator } from './Spectator';

export class TankRoomState extends ColyseusSchema implements TankRoomSchema {
  @ColyseusType('string')
  public mapId: string;

  @ColyseusType({ map: AiAgent })
  public aiAgents = new MapSchema<AiAgent>();

  // ---------------------------------------------------------------------------

  public spectators = new Map<string, Spectator>();
}
