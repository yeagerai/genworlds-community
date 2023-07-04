import { TankRoomState } from '@app/colyseus/schemas/TankRoomState';
import { AiAgent } from '@app/colyseus/schemas/AiAgent';

import { YeagerEvent } from './event';

export abstract class YeagerHandler {
  public constructor(protected roomState: TankRoomState) {}

  protected getAiAgentFromMsg(msgObj: YeagerEvent): AiAgent {
    let aiAgent = this.roomState.aiAgents.get(msgObj.sender_id);
    if (!aiAgent) {
      aiAgent = new AiAgent(msgObj.sender_id);
      this.roomState.aiAgents.set(msgObj.sender_id, aiAgent);
    }
    return aiAgent;
  }

  public abstract execute(msgObj: YeagerEvent): Promise<void>;
}
