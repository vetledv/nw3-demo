import Map, { type MapRef, type MapLayerMouseEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useRef, useState } from 'react';
import {
  useCurrentVehicles,
  useHoveredVehicle,
  useSelectedVehicle,
  useSetHoveredVehicle,
  useSetSelectedVehicle,
} from '~/store/VehicleStore';
import DraggableMarker from '~/components/DraggableMarker';

const MAPBOX_TOKEN =
  'pk.eyJ1IjoiaGVucmlrLWJyYXRoZW4iLCJhIjoiY2xsbm5wcnQxMDI1bDNkbzQxaTFnNDA2OSJ9.IjsrKGbU65mmJI-Ba-Ztug';

const OSLO_BOUNDS = { longitude: 10.747263, latitude: 59.926678 };

const interactiveLayerIds = [
  'vehicles',
  'vehicle-selected',
  'vehicles-hover',
  'vehicle-hovered-selected',
];

export default function MapContainer({ children }: React.PropsWithChildren) {
  const selectedId = useSelectedVehicle();
  const currVehicles = useCurrentVehicles();
  const hoveredVehicle = useHoveredVehicle();

  const setSelectedVehicle = useSetSelectedVehicle();
  const selectHoveredVehicle = useSetHoveredVehicle();

  const mapRef = useRef<MapRef>(null);

  const [viewState, setViewState] = useState({
    ...OSLO_BOUNDS,
    zoom: 13,
  });

  const onClickMap = useCallback(
    (evt: MapLayerMouseEvent) => {
      const features = evt.features;
      if (features === undefined || features.length === 0) {
        return;
      }
      console.log('MAPCLICK', features);
      const feature = features[0];
      const isSelected = feature.properties?.vehicleId === selectedId;
      const vehicleToSelect = currVehicles.find(
        (x) => x.vehicleId === feature.properties?.vehicleId,
      );
      if (vehicleToSelect === undefined) {
        return;
      }
      setSelectedVehicle(isSelected ? undefined : vehicleToSelect);
      // if (vehicleToSelect.location) {
      //   evt.target.flyTo({
      //     curve:11,
      //     center: {
      //       lat: vehicleToSelect.location.latitude,
      //       lng: vehicleToSelect.location.longitude,
      //     },
      //   });
      // }
    },
    [currVehicles],
  );

  return (
    <div className='h-screen'>
      <Map
        {...viewState}
        ref={mapRef}
        reuseMaps
        interactiveLayerIds={interactiveLayerIds}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle='mapbox://styles/mapbox/streets-v9'
        minZoom={11}
        attributionControl={false}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={onClickMap}
        onLoad={(e) => {
          e.target.loadImage('/siren.png', (error, image) => {
            if (error || !image) {
              console.log(error, image);
              return;
            }
            console.log(image);
            e.target.addImage('siren', image);
          });
        }}
        onMouseMove={(evt) => {
          const feature = evt.features?.[0];
          if (feature === undefined) {
            if (hoveredVehicle !== undefined) {
              selectHoveredVehicle(undefined);
            }
            return;
          }
          const vehicleToSelect = currVehicles.find(
            (x) => x.vehicleId === feature.properties?.vehicleId,
          );
          if (vehicleToSelect === hoveredVehicle) {
            return;
          }
          selectHoveredVehicle(vehicleToSelect);
        }}>
        {children}
        <DraggableMarker />
      </Map>
    </div>
  );
}
