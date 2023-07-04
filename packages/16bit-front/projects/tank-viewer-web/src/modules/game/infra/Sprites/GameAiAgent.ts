import { GameCharacterBase } from './GameCharacterBase';

export class GameAiAgent extends GameCharacterBase {
  static readonly HEIGHT = 16;

  init(depth?: number) {
    this.setImmovable()
      .setSize(16, GameAiAgent.HEIGHT)
      // .setDisplaySize(16, GameAiAgent.HEIGHT)
      .setOffset(0, 48 - GameAiAgent.HEIGHT)
      .setBounce(0)
      .setCollideWorldBounds(true)
      .setImmovable()
      .setDepth(depth !== undefined ? depth : 9);

    this.animateGameAiAgent();
  }

  animateGameAiAgent() {
    // sitting
    this.createAnimation({ key: 'walking_up', start: 1, end: 1 });
    this.createAnimation({ key: 'walking_right', start: 0, end: 0 });
    this.createAnimation({ key: 'walking_left', start: 2, end: 2 });
    this.createAnimation({ key: 'walking_down', start: 3, end: 3 });
    // sitting
    this.createAnimation({ key: 'sitting_right', start: 12, end: 12 });
    this.createAnimation({ key: 'sitting_left', start: 18, end: 18 });
    this.createAnimation({ key: 'sitting_down', start: 3, end: 3 });
    // speaking
    this.createAnimation({ key: 'speaking', start: 24, end: 27 });
    this.createAnimation({ key: 'speaking_right', start: 36, end: 39 });
    this.createAnimation({ key: 'speaking_left', start: 40, end: 43 });
  }

  removeAgent() {
    // this.nameText.destroy();
    // this.floatingDialog.destroy();
    // this.dialogText.destroy();
    this.destroy();
  }
}
