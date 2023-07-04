import { GameCharacterBase } from './GameCharacterBase';

export class GameAiAgentLegacy extends GameCharacterBase {
  static readonly HEIGHT = 14;

  private floatingDialog!: Phaser.GameObjects.Rectangle;
  private dialogText!: Phaser.GameObjects.Text;
  private nameText!: Phaser.GameObjects.Text;

  init() {
    this.setImmovable()
      .setSize(16, GameAiAgentLegacy.HEIGHT)
      // .setDisplaySize(16, GameAiAgentLegacy.HEIGHT)
      .setOffset(0, 48 - GameAiAgentLegacy.HEIGHT)
      .setBounce(0)
      .setCollideWorldBounds(true)
      .setImmovable()
      .setDepth(9);

    this.animateGameAiAgent();

    this.floatingDialog = this.scene.add.rectangle(0, 0, 18, 16, 0xffffff);
    this.floatingDialog.setDepth(9000).setStrokeStyle(1, 0x000);

    this.dialogText = this.scene.add.text(0, 0, '...', {
      fontSize: 8,
      color: '0x000',
      fixedWidth: 50,
      fixedHeight: 16,
      padding: { top: 1, left: 2 },
    });
    this.dialogText.setDepth(9001);

    this.nameText = this.scene.add.text(0, 0, 'name', {
      fontSize: 8,
      fontFamily: '"Press Start 2P"',
      resolution: window.devicePixelRatio,
      color: '#000',
    });
    this.nameText.setDepth(9001).setText(this.name);

    this.adjustDialog();
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
    this.nameText.destroy();
    this.floatingDialog.destroy();
    this.dialogText.destroy();
    this.destroy();
  }

  private adjustDialog() {
    const floatingDialogPosition = {
      x: this.x + this.width / 2 - this.floatingDialog.width / 2,
      y: this.y - this.height,
    };
    this.floatingDialog.setPosition(
      floatingDialogPosition.x,
      floatingDialogPosition.y,
    );
    const coordinates = this.floatingDialog.getTopLeft();
    this.dialogText.setPosition(coordinates.x || 0, coordinates.y || 0);
    this.dialogText.setText('...');
    this.nameText.setPosition(
      this.x - this.nameText.width / 2,
      this.y - this.height + this.nameText.height / 2,
    );
  }
}
