import { AVAILABLE_MAPS, MAPS, Tilemap } from '@yeager/common-types';

export function loadTilemap(map: MAPS): Tilemap {
  let mapInfo = AVAILABLE_MAPS[map];

  if (!mapInfo) {
    mapInfo = { tilemap: 'MAPA BIBLIOTECA.json' };
  }
  // If it's a function, execute it to get MapInfo
  if (typeof mapInfo === 'function') {
    mapInfo = mapInfo();
  }
  // Now, mapInfo is guaranteed to be MapInfo, not a function
  const tilemap: Tilemap =
    // eslint-disable-next-line import/no-dynamic-require, global-require
    require(`./maps/${mapInfo.tilemap}`) as Tilemap;

  return tilemap;
}
