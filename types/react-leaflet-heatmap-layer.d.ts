declare module 'react-leaflet-heatmap-layer' {
  import { LayerProps } from 'react-leaflet';

  export interface HeatmapLayerProps extends LayerProps {
    points: any[];
    longitudeExtractor: (point: any) => number;
    latitudeExtractor: (point: any) => number;
    intensityExtractor: (point: any) => number;
    radius?: number;
    blur?: number;
    max?: number;
    gradient?: Record<number, string>;
  }

  export default function HeatmapLayer(props: HeatmapLayerProps): JSX.Element;
}
