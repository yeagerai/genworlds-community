import { AiAgent, LayerData, Tilemap } from '@yeager/common-types';
import {
  adamRun16x24,
  ameliaRun16x23,
  bobRun16x23,
  alexRun16x23,
  // collision,
} from '@/assets';

import { AbstractAgentsScene } from './AbstractAgentsScene';
import { GameAiAgent } from '@/modules/game/infra/Sprites/GameAiAgent';

export class MainScene extends AbstractAgentsScene {
  private agents!: GameAiAgent[];
  private map!: Phaser.Tilemaps.Tilemap;

  constructor(tilemap: Tilemap) {
    super(tilemap);

    this.agents = [];
  }

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
      .spritesheet('adam_run', adamRun16x24, {
        frameWidth: 16,
        frameHeight: 24,
      })
      .spritesheet('amelia_run', ameliaRun16x23, {
        frameWidth: 16,
        frameHeight: 23,
      })
      .spritesheet('bob_run', bobRun16x23, {
        frameWidth: 16,
        frameHeight: 23,
      })
      .spritesheet('alex_run', alexRun16x23, {
        frameWidth: 16,
        frameHeight: 23,
      });
  }

  create() {
    // create the Tilemap
    this.map = this.make.tilemap({ key: 'tilemap' });

    const { tilesets: mapTilesets, layers } = this.tilemap;
    const tilesets: Phaser.Tilemaps.Tileset[] = [];

    mapTilesets.forEach((ts) => {
      const tileset = this.map.addTilesetImage(
        ts.name,
        ts.name,
        ts.tilewidth,
        ts.tileheight,
      );

      if (tileset === null) return;

      tilesets.push(tileset);
    });
    this.addLayersToMap(tilesets, layers);

    // add the tileset image we are using
    // this.map.addTilesetImage('Collision', 'collision', 16, 16);
    // const tileset = this.map.addTilesetImage('Yeager', 'baseTileset');

    // if (tileset === null) return;

    // const { layers } = this.tilemap;

    // this.addLayersToMap(tileset, layers);

    // const foregroundObjectsLayer = this.map.getLayer('Foreground Objects');

    // if (foregroundObjectsLayer) {
    //   foregroundObjectsLayer.tilemapLayer.setDepth(1);
    // }
  }

  updateAgents(agents: AiAgent[]) {
    // For each player on the Scene
    this.agents.forEach((p) => {
      const pIndex = agents.findIndex((ag) => ag.name === p.name);
      // // update position
      // if (pIndex >= 0) {
      //   p.updatePosition(
      //     agents[pIndex].x,
      //     agents[pIndex].y,
      //     agents[pIndex].action,
      //   );
      // } else {
      //   // remove since it no longer exists
      //   p.removePlayer();
      // }

      if (pIndex === -1) {
        p.removeAgent();
      }
    });

    // for each new player, create it
    const newAgents = agents.filter((ag) => {
      const found = this.agents.find((p) => p.name === ag.name);

      return !found;
    });

    this.addAgents(newAgents);
  }

  private addAgents(ps: AiAgent[]) {
    ps.forEach((aiA, index) => {
      let spriteName = '';

      switch (index % 4) {
        case 0:
          spriteName = 'adam_run';
          break;
        case 1:
          spriteName = 'amelia_run';
          break;
        case 2:
          spriteName = 'bob_run';
          break;
        case 3:
          spriteName = 'alex_run';
          break;
        default:
          spriteName = '';
          break;
      }

      const ag = new GameAiAgent(
        aiA.name,
        aiA.name,
        this,
        // aiA.x, // this.sys.game.canvas.width / 2 - 230 + index * 30,
        // aiA.y, // this.sys.game.canvas.height / 2 + 10,
        this.sys.game.canvas.width / 2 - 15 + index * 32,
        this.sys.game.canvas.height / 2 - 20,
        spriteName,
      );
      this.agents.push(ag);
    });
  }

  private addLayersToMap(
    tilesets: Phaser.Tilemaps.Tileset[],
    layers: LayerData[],
    prefix?: string,
  ) {
    layers.forEach((l) => {
      if (!l.visible) return;

      if ('layers' in l) {
        const { layers: layerLayers } = l;
        const newPrefix = prefix ? `${prefix}${l.name}/` : `${l.name}/`;
        this.addLayersToMap(tilesets, layerLayers, newPrefix);
      } else {
        const fullName = prefix ? `${prefix}${l.name}` : l.name;
        this.map.createLayer(fullName, tilesets);
      }
    });
  }
}
