import { AiAgent } from '@yeager/common-types';
import { CustomGameConfig } from './CustomGameConfig';
import { AbstractAgentsScene } from './Scenes/AbstractAgentsScene';

export class Game extends Phaser.Game {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(gameConfig: CustomGameConfig) {
    super(gameConfig);
  }

  updateAgents(agents: AiAgent[]) {
    const { scene: sceneManager } = this;

    const scene = sceneManager.getScene('main-scene') as AbstractAgentsScene;

    scene.updateAgents(agents);
  }
}
