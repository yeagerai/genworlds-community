import { MAPS, Tilemap } from '@yeager/common-types';
import { PokerScene } from './PokerScene';
import { RandomScene } from './RandomScene';
import { MainScene } from './MainScene';
import { AbstractAgentsScene } from './AbstractAgentsScene';
import { TestPokerScene } from './TestPokerScene';

export function getSceneFromMap(
  map: MAPS,
  tilemap: Tilemap,
): AbstractAgentsScene {
  let scene: AbstractAgentsScene = new PokerScene(tilemap);

  if (map === MAPS.POKER) {
    scene = new PokerScene(tilemap);
  } else if (map === MAPS.TEST_MAP) {
    scene = new MainScene(tilemap);
  } else if (map === MAPS.TEST_POKER) {
    scene = new TestPokerScene(tilemap);
  } else if (map === MAPS.TEST_LABORATORY) {
    scene = new TestPokerScene(tilemap);
  } else if (map === MAPS.TEST_LIBRARY) {
    scene = new TestPokerScene(tilemap);
  }else if (map === MAPS.RANDOM) {
    scene = new RandomScene(tilemap);
  }

  return scene;
}
