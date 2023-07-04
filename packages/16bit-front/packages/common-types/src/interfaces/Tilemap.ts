import { LayerData } from './LayerData';
import { Tileset } from './Tileset';

export interface Tilemap {
  height: number;
  layers: LayerData[];
  tileheight: number;
  tilewidth: number;
  width: number;
  tilesets: Tileset[];
}
