import { YeagerEvent } from '../event';
import { YeagerHandler } from '../YeagerHandler';

export interface AgentSpeaksIntoMicrophoneEvent extends YeagerEvent {
  event_type: 'agent_speaks_into_microphone';
  message: string;
}

export class AgentSpeaksIntoMicrophone extends YeagerHandler {
  // public static create(agentId: string, msg: string): AgentSpeaksIntoMicrophoneEvent {
  //   return {
  //     event_type: 'agent_speaks_into_microphone',
  //     description: 'Agent speaks into microphone.',
  //     created_at: new Date(),
  //     sender_id: agentId,
  //     message: msg,
  //   };
  // }

  public override async execute(msgObj: YeagerEvent): Promise<void> {
    const aiAgent = this.getAiAgentFromMsg(msgObj);
    const pMsgObj = msgObj as AgentSpeaksIntoMicrophoneEvent;
    const date = new Date(pMsgObj.created_at);
    aiAgent.speak(pMsgObj.message, date);
  }
}
