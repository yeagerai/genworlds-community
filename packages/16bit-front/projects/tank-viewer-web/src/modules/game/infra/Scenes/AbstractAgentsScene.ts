import { AiAgent, Tilemap } from '@yeager/common-types';

export abstract class AbstractAgentsScene extends Phaser.Scene {
  constructor(protected tilemap: Tilemap) {
    super({ key: 'main-scene' });
  }

  abstract updateAgents(agents: AiAgent[]): void;
}
