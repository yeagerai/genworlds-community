export abstract class GameCharacterBase extends Phaser.Physics.Arcade.Sprite {
  public readonly id: string;
  protected textureName: string;

  constructor(
    id: string,
    name: string,
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    depth?: number,
  ) {
    super(scene, x, y, texture);
    this.id = id;
    this.name = name;
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.textureName = texture;

    this.init(depth);
  }

  abstract init(depth?: number): void;

  protected createAnimation({
    key,
    start,
    end,
    frameRate,
    repeat,
  }: {
    key: string;
    start: number;
    end?: number;
    frameRate?: number;
    repeat?: number;
  }) {
    this.anims.create({
      key,
      frames: this.anims.generateFrameNumbers(this.textureName, {
        start,
        end,
      }),
      frameRate: frameRate === undefined ? 4 : frameRate,
      repeat: repeat === undefined ? -1 : repeat,
    });
  }
}
