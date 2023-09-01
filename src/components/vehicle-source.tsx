import { useSubscription } from '@apollo/client';
import { Source, Layer } from 'react-map-gl';

import { subVehicles } from '~/graphql/queries';
import {
  useCurrentVehiclesActions,
  useGeoJSONVehicles,
  useHoveredVehicle,
  useSelectedVehicle,
} from '~/store/VehicleStore';

const osloBoundingBox = {
  minLat: 59.648293,
  minLon: 10.532085,
  maxLat: 59.983825,
  maxLon: 10.996665,
} as const;

const variables = {
  boundingBox: osloBoundingBox,
  bufferTime: 1_000,
  codespaceId: 'VYX',
} as const;

const paint = {
  'circle-color': '#ffff00',
  'circle-radius': 12,
  'circle-stroke-color': '#333333',
  'circle-stroke-width': 2,
};
const selectedPaint = {
  'circle-color': '#ff0000',
  'circle-radius': 12,
  'circle-stroke-color': '#666666',
  'circle-stroke-width': 2,
};
const hoveredPaint = {
  'circle-color': '#ffa500',
  'circle-radius': 12,
  'circle-stroke-color': '#666666',
  'circle-stroke-width': 2,
};

export function VehicleSource() {
  const selectedVehicle = useSelectedVehicle();
  const hoveredVehicle = useHoveredVehicle();
  const geoJSONVehicles = useGeoJSONVehicles()();

  const cvActions = useCurrentVehiclesActions();

  const _vehicleSub = useSubscription(subVehicles, {
    variables,
    onData(opts) {
      const vehicles = opts.data.data?.vehicles;
      if (!vehicles || vehicles === undefined || vehicles.length === 0) {
        //TODO: filter time here too?
        //if none are added for a long time, it will not filter old entries
        return;
      }
      cvActions.concat(vehicles);
    },
  });

  /**
   * to show selectedVehicle in vehicles-highlight layer
   * @link https://github.com/visgl/react-map-gl/blob/7.1-release/examples/filter/src/app.tsx
   */
  const selectedFilter = ['in', 'vehicleId', selectedVehicle?.vehicleId ?? ''];
  const hoveredFilter = ['in', 'vehicleId', hoveredVehicle?.vehicleId ?? ''];

  return (
    <Source id='vehicles' type='geojson' data={geoJSONVehicles}>
      <Layer
        id='vehicles'
        key='vehicles'
        interactive
        type='circle'
        paint={paint}
      />
      <Layer
        id='vehicles-highlight'
        key='vehicles-highlight'
        interactive
        filter={selectedFilter}
        type='circle'
        paint={selectedPaint}
      />
      <Layer
        id='vehicles-hover'
        key='vehicles-hover'
        interactive
        filter={hoveredFilter}
        type='circle'
        paint={hoveredPaint}
      />
    </Source>
  );
}
