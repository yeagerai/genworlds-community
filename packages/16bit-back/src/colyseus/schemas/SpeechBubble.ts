import { Schema as ColyseusSchema, type as ColyseusType, MapSchema } from '@colyseus/schema';

import { SpeechBubbleSchema } from '@shared/colyseus/schemas';

import { SpeechMessage } from './SpeechMessage';

export class SpeechBubble extends ColyseusSchema implements SpeechBubbleSchema {
  public static LastMessagesMaxElements = 10;

  @ColyseusType(SpeechMessage)
  public message = new SpeechMessage();

  public lastMsgHashId = 0;

  @ColyseusType({ map: SpeechMessage })
  public lastMessages = new MapSchema<SpeechMessage>();

  // ---------------------------------------------------------------------------

  public update(text: string, date?: Date): void {
    this.lastMsgHashId += 1;
    const hash = this.lastMsgHashId % SpeechBubble.LastMessagesMaxElements;
    this.lastMessages.set(`${hash}`, this.message);

    this.message = new SpeechMessage(text, date);
  }
}
