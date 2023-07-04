import { AVAILABLE_MAPS, MAPS, Tilemap } from '@yeager/common-types';

export function loadTilemap(map: MAPS): Tilemap {
  const tilemap: Tilemap =
    // eslint-disable-next-line import/no-dynamic-require, global-require
    require(`./maps/${AVAILABLE_MAPS[map].tilemap}`) as Tilemap;

  return tilemap;
}
