import { AiAgent } from './AiAgent';

export interface TankRoomState {
  mapId: string;
  aiAgents: Map<string, AiAgent>;
}
