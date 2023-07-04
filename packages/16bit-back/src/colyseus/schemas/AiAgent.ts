import { Schema as ColyseusSchema, type as ColyseusType } from '@colyseus/schema';

import { AiAgentSchema } from '@shared/colyseus/schemas';

import { SpeechBubble } from './SpeechBubble';

export class AiAgent extends ColyseusSchema implements AiAgentSchema {
  @ColyseusType('string')
  public name: string;

  @ColyseusType(SpeechBubble)
  public bubble = new SpeechBubble();

  // ---------------------------------------------------------------------------

  public constructor(name: string) {
    super();
    this.name = name;
  }

  public speak(msg: string, date?: Date): void {
    this.bubble.update(msg, date);
  }
}
