export interface SpeechMessageSchema {
  text: string;
  timestamp: number;
}

export interface SpeechBubbleSchema {
  message: SpeechMessageSchema;
  lastMessages: Map<string, SpeechMessageSchema>;
}

export interface AiAgentSchema {
  name: string;
  bubble: SpeechBubbleSchema;
}

export interface TankRoomSchema {
  mapId: string;
  aiAgents: Map<string, AiAgentSchema>;
}
