export enum MAPS {
  TEST_MAP = 'test-map',
  POKER = 'poker',
  TEST_POKER = 'test-poker',
  LABORATORY = 'laboratory',
  TEST_LABORATORY = 'test-laborator',
  LIBRARY = 'test',
  TEST_LIBRARY = 'test-library',
  RANDOM = 'random',
}

interface MapInfo {
  tilemap: string;
}

type MapValue = MapInfo | (() => MapInfo);

export const AVAILABLE_MAPS: Partial<{ [key in MAPS]: MapInfo | (() => MapInfo) }> = {
  [MAPS.TEST_MAP]: {
    tilemap: 'Mapa_Prova_Anna_02.json',
  },
  [MAPS.POKER]: {
    tilemap: 'poker.json',
  },
  [MAPS.TEST_POKER]: {
    tilemap: 'poker.json',
  },
  [MAPS.LABORATORY]: {
    tilemap: 'MAPA RESEARCH.json',
  },
  [MAPS.TEST_LABORATORY]: {
    tilemap: 'MAPA RESEARCH.json',
  },
  [MAPS.LIBRARY]: {
    tilemap: 'MAPA BIBLIOTECA.json',
  },
  [MAPS.TEST_LIBRARY]: {
    tilemap: 'MAPA BIBLIOTECA.json',
  },
};

const SELECTED_MAPS = [
  'MAPA BIBLIOTECA.json',
  'MAPA RESEARCH.json'
];

AVAILABLE_MAPS[MAPS.RANDOM] = function() {
  const randomFile = SELECTED_MAPS[Math.floor(Math.random() * SELECTED_MAPS.length)];
  return { tilemap: randomFile };
};