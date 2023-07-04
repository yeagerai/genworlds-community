import { logger } from '@app/infra/logger';

import { YeagerEvent } from '../event';
import { YeagerHandler } from '../YeagerHandler';

export interface AgentMoveToPositionEvent extends YeagerEvent {
  event_type: 'agent_move_to_position';
  new_position: {
    x: number,
    y: number,
  };
}

export class AgentMoveToPosition extends YeagerHandler {
  // public static create(agentId: string, x: number, y: number): AgentMoveToPositionEvent {
  //   return {
  //     event_type: 'agent_move_to_position',
  //     description: 'Move an agent to a position.',
  //     created_at: new Date(),
  //     sender_id: agentId,
  //     new_position: { x, y },
  //   };
  // }

  public override async execute(msgObj: YeagerEvent): Promise<void> {
    const aiAgent = this.getAiAgentFromMsg(msgObj);
    const pMsgObj = msgObj as AgentMoveToPositionEvent;
    logger.debug(`${aiAgent.name} :: ${pMsgObj.event_type}`);
  }
}
