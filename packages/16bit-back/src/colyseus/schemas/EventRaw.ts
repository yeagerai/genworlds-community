import { Schema as ColyseusSchema, type as ColyseusType } from '@colyseus/schema';

export class EventRaw extends ColyseusSchema {
  @ColyseusType('number')
  public id: number;

  @ColyseusType('string')
  public type: string;

  @ColyseusType('number')
  public timestamp: number;

  @ColyseusType('string')
  public data: string;

  public constructor(id: number, type: string, date: Date, data: string) {
    super();
    this.id = id;
    this.type = type;
    this.timestamp = date.getTime();
    this.data = data;
  }
}
