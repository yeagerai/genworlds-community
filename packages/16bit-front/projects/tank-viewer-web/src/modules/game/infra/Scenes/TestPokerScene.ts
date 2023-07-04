import { AiAgent, Tilemap } from '@yeager/common-types';
import {
  JasonCalacanis,
  // collision,
} from '@/assets';

import { AbstractAgentsScene } from './AbstractAgentsScene';
import { GameAiAgent } from '@/modules/game/infra/Sprites/GameAiAgent';
import { getConfig } from '@/config';

export class TestPokerScene extends AbstractAgentsScene {
  private readonly MOVE_AMOUNT = 110;

  private map!: Phaser.Tilemaps.Tilemap;
  // private agent!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private agent!: GameAiAgent;
  private worldLayers: Phaser.Tilemaps.TilemapLayer[];

  spawnPoints: Phaser.Types.Tilemaps.TiledObject[];
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(tilemap: Tilemap) {
    super(tilemap);

    this.worldLayers = [];
    this.spawnPoints = [];
  }

  // # Overrides funcions ######################################################

  preload() {
    const { tilesets } = this.tilemap;

    tilesets.forEach((ts) => {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const tileset = require(`@/assets/tilesets/${ts.image}`);
      this.load.image(ts.name, tileset);
    });

    // load images, tileMaps and Sprites
    this.load
      .tilemapTiledJSON('tilemap', this.tilemap)
      .spritesheet('JasonCalacanis', JasonCalacanis, {
        frameWidth: 16,
        frameHeight: 48,
        startFrame: 0,
      });
  }

  create() {
    // create the Tilemap
    this.map = this.make.tilemap({ key: 'tilemap' });

    // Load all tilesets
    this.loadTilesets();

    // Create Layers
    this.addLayersToMap();

    // Create Layers
    this.collectSpawnPoints();

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    // Create player
    const spawnPoint = this.spawnPoints[0];

    this.agent = new GameAiAgent(
      'jason',
      'jason',
      this,
      spawnPoint.x ? spawnPoint.x : 0,
      spawnPoint.y ? spawnPoint.y - 16 : 0,
      'JasonCalacanis',
    );

    // this.agent = this.physics.add.sprite(
    //   spawnPoint.x ? spawnPoint.x : 0,
    //   spawnPoint.y ? spawnPoint.y - 16 : 0,
    //   'JasonCalacanis',
    // );
    this.physics.add.collider(this.agent, this.worldLayers);
  }

  update() {
    this.agent.setVelocity(0);
    this.agent.stop();

    if (this.cursors.right.isDown) {
      this.agent.play('walking_right');
      this.agent.setVelocityX(this.MOVE_AMOUNT);
    }
    if (this.cursors.left.isDown) {
      this.agent.play('walking_left');
      this.agent.setVelocityX(-this.MOVE_AMOUNT);
    }
    if (this.cursors.up.isDown) {
      this.agent.play('walking_up');
      this.agent.setVelocityY(-this.MOVE_AMOUNT);
    }
    if (this.cursors.down.isDown) {
      this.agent.play('walking_down');
      this.agent.setVelocityY(this.MOVE_AMOUNT);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    if (this.agent.body) {
      this.agent.body.velocity.normalize().scale(this.MOVE_AMOUNT);
    }
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  updateAgents(agents: AiAgent[]) {}

  private loadTilesets() {
    const { tilesets: mapTilesets } = this.map;
    const tilesets: Phaser.Tilemaps.Tileset[] = [];

    mapTilesets.forEach((ts) => {
      const tileset = this.map.addTilesetImage(
        ts.name,
        ts.name,
        ts.tileWidth,
        ts.tileHeight,
      );

      if (tileset === null) return;

      tilesets.push(tileset);
    });
  }

  private collectSpawnPoints() {
    // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
    // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
    this.spawnPoints =
      this.map.filterObjects('Objects', (obj) =>
        obj.name.toLowerCase().includes('spawnpoint'),
      ) || [];
  }

  private addLayersToMap() {
    const appConfig = getConfig();
    const layerNames = this.map.getTileLayerNames();
    const layers: Phaser.Tilemaps.TilemapLayer[] = [];
    const { tilesets } = this.map;

    // Create Layers (getTileLayerNames is returning layers of type tilelayer)
    layerNames.forEach((layerName) => {
      const layer = this.map.getLayer(layerName);

      if (layer && layer.visible) {
        const newLayer = this.map.createLayer(layerName, tilesets);

        if (newLayer) {
          layers.push(newLayer);
        }
      }
    });

    // Create Layers (getTileLayerNames is returning layers of type tilelayer)
    const worldLayers = layers.filter((layer) =>
      layer.layer.name.includes('World'),
    );
    worldLayers.forEach((layer) => {
      if (layer && layer.visible) {
        layer.setCollisionByExclusion([-1], true);

        if (appConfig.isDevelopment) {
          const debugGraphics = this.add.graphics().setAlpha(0.65);
          layer.renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
          });
        }
      }
    });
    this.worldLayers = worldLayers;

    const aboveLayers = layers.filter((layer) =>
      layer.layer.name.includes('Above Player'),
    );

    aboveLayers.forEach((layer) => {
      if (layer && layer.visible) {
        // By default, everything gets depth sorted on the screen in the order we created things. Here, we
        // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
        // Higher depths will sit on top of lower depth objects.
        layer.setDepth(10);
      }
    });
  }
}
