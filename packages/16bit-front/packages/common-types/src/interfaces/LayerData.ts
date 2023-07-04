export type LayerData = {
  id: number;
  name: string;
  opacity: number;
  visible: boolean;
  x: number;
  y: number;
  type: string;
} & (
  | { data: number[]; height: number; width: number }
  | { layers: LayerData[] }
);
