import WebSocket from 'ws';

import { config } from '@app/config';
import { logger } from '@app/infra/logger';
import { TankRoomState } from '@app/colyseus/schemas/TankRoomState';

import { YeagerEvent } from './event';
import { AgentMoveToPosition } from './handlers/AgentMoveToPosition';
import { AgentSpeaksIntoMicrophone } from './handlers/AgentSpeaksIntoMicrophone';
import { YeagerHandler } from './YeagerHandler';

export class WsHandler {
  private roomState: TankRoomState;

  private wsClient: WebSocket;

  public constructor(roomState: TankRoomState) {
    this.roomState = roomState;

    const { host, port, path } = config.yeager.world.websocket;
    const wsUrl = `${host}:${port}/${path}`;

    this.wsClient = new WebSocket(wsUrl, {
      perMessageDeflate: false,
    });

    this.wsClient.on('error', (error) => {
      logger.error(error.stack);
    });

    this.wsClient.on('open', () => {
      logger.info('WebSocket connection established');
    });
  }

  public async start(): Promise<void> {
    this.wsClient.on('message', async (data) => {
      const msgStr = data.toString();
      await this.interpret(msgStr);
    });
  }

  public async stop(): Promise<void> {
    this.wsClient.terminate();
  }

  private async interpret(message: string): Promise<void> {
    const msgObj = JSON.parse(message) as YeagerEvent;
    const eventType = msgObj.event_type;

    let handler: YeagerHandler | undefined;

    logger.debug(`event received: ${eventType}`);
    switch (eventType) {
      case 'agent_move_to_position':
        handler = new AgentMoveToPosition(this.roomState);
        break;

      case 'agent_speaks_into_microphone':
        handler = new AgentSpeaksIntoMicrophone(this.roomState);
        break;

      default:
        logger.debug('> handler not yet implemented');
        break;
    }

    if (handler) {
      handler.execute(msgObj);
    }
  }
}
