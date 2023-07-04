import { Schema as ColyseusSchema, type as ColyseusType } from '@colyseus/schema';

export class Item extends ColyseusSchema {
  @ColyseusType('string')
  public name: string;

  public constructor(name: string) {
    super();
    this.name = name;
  }
}
