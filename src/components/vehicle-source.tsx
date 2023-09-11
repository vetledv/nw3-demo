import { useSubscription } from '@apollo/client';
import { useEffect } from 'react';
import { Source, Layer } from 'react-map-gl';
import { useServerSubscription } from '~/App';

import { subVehicles } from '~/graphql/queries';
import { useMarkerEvents } from '~/store/MarkerStore';
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

const defaultCirclePaint = {
  'circle-color': '#ffff00',
  'circle-radius': 12,
  'circle-stroke-color': '#333333',
  'circle-stroke-width': 2,
};

const selectedPaint = {
  ...defaultCirclePaint,
  'circle-color': '#ff0000',
};
const hoveredPaint = {
  ...defaultCirclePaint,
  'circle-color': '#ffa500',
};
const hoveredSelectedPaint = {
  ...defaultCirclePaint,
  'circle-color': '#ffc0cb',
};

function VehicleLayers() {
  const selectedVehicle = useSelectedVehicle();
  const hoveredVehicle = useHoveredVehicle();

  //https://github.com/visgl/react-map-gl/blob/7.1-release/examples/filter/src/app.tsx
  const selectedFilter = ['==', 'vehicleId', selectedVehicle?.vehicleId ?? ''];
  const hoveredFilter = ['==', 'vehicleId', hoveredVehicle?.vehicleId ?? ''];
  const hoverAndSelect =
    selectedVehicle?.vehicleId === hoveredVehicle?.vehicleId;
  const hoverSelectFilter = [
    '==',
    'vehicleId',
    hoverAndSelect ? hoveredVehicle?.vehicleId ?? '' : '',
  ];

  //remove from the default layer if any of the other layers are active
  const defaultFilter = [
    'all',
    ['!=', 'vehicleId', selectedVehicle?.vehicleId ?? ''],
    ['!=', 'vehicleId', hoveredVehicle?.vehicleId ?? ''],
  ];

  return (
    <>
      <Layer
        source='vehicles'
        id='vehicles'
        key='vehicles'
        interactive
        type='circle'
        paint={defaultCirclePaint}
        filter={defaultFilter}
      />
      <Layer
        source='vehicles'
        id='vehicle-selected'
        key='vehicle-selected'
        interactive
        type='circle'
        filter={selectedFilter}
        paint={selectedPaint}
      />
      <Layer
        source='vehicles'
        id='vehicles-hover'
        key='vehicles-hover'
        interactive
        type='circle'
        filter={hoveredFilter}
        paint={hoveredPaint}
      />
      <Layer
        source='vehicles'
        id='vehicle-hovered-selected'
        key='vehicle-hovered-selected'
        interactive
        type='circle'
        filter={hoverSelectFilter}
        paint={hoveredSelectedPaint}
      />
    </>
  );
}

export function TestWsPush() {
  const [ws, connected] = useServerSubscription();
  const selectedVehicle = useSelectedVehicle();
  const marker = useMarkerEvents();
  useEffect(() => {
    const interval = setInterval(() => {
      if (connected) {
        if (!selectedVehicle) return;
        ws.current?.send(
          JSON.stringify({ marker: marker, selected: selectedVehicle }),
        );
      }
    }, variables.bufferTime);
    return () => clearInterval(interval);
  }, [connected, selectedVehicle, marker]);

  return null;
}

export function VehicleSource() {
  const data = useGeoJSONVehicles()();
  const cvActions = useCurrentVehiclesActions();

  const _vehicleSub = useSubscription(subVehicles, {
    variables,
    onData(opts) {
      const vehicles = opts.data.data?.vehicles;
      if (!vehicles || vehicles === undefined) {
        //TODO: filter time here too?
        //if none are added for a long time, it will not filter old entries
        return;
      }
      cvActions.filterAndConcat(vehicles);
    },
  });
  return (
    <>
      <TestWsPush />
      <Source id='vehicles' type='geojson' data={data}>
        <VehicleLayers />
      </Source>
    </>
  );
}
