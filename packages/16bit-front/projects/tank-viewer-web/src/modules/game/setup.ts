import { MAPS, Tilemap } from '@yeager/common-types';
import { CustomGameConfig, Game, getSceneFromMap } from './infra';
import { getConfig } from '@/config';

interface SetupProps {
  tilemap: Tilemap;
  mapId: MAPS;
  container?: string;
}

export function setup(props: SetupProps) {
  const { tilemap, mapId, container } = props;
  const appConfig = getConfig();

  let [width, height, tilewidth, tileheight] = [40, 20, 16, 16];

  if (typeof tilemap !== 'string') {
    ({ width, height, tilewidth, tileheight } = tilemap);
  }

  const gameConfig: CustomGameConfig = {
    type: Phaser.AUTO,
    scale: {
      // autoCenter: Phaser.Scale.CENTER_BOTH,
      mode: Phaser.Scale.FIT,
      parent: container || 'map-container', // ID of the DOM element to add the canvas to
      width: width * tilewidth,
      height: height * tileheight,
    },
    render: {
      pixelArt: true,
      antialias: true,
      roundPixels: true,
    },
    autoRound: true,
    scene: [getSceneFromMap(mapId, tilemap)],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 }, // Top down game, so no gravity
        debug: appConfig.isDevelopment,
      },
    },
  };

  const game = new Game(gameConfig);
  return game;
}
