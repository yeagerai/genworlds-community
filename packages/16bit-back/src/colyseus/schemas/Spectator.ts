import { Schema as ColyseusSchema, type as ColyseusType } from '@colyseus/schema';

export class Spectator extends ColyseusSchema {
  @ColyseusType('string')
  public sessionId: string;

  public constructor(sessionId: string) {
    super();
    this.sessionId = sessionId;
  }
}
