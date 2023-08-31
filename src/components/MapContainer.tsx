import Map, {
  Marker,
  type MarkerDragEvent,
  type LngLat,
  type MapRef,
  type MapLayerMouseEvent,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useRef, useState } from "react";
import {
  useCurrentVehicles,
  useHoveredVehicle,
  useSelectedVehicle,
  useSetHoveredVehicle,
  useSetSelectedVehicle,
} from "~/utils/zustand";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaGVucmlrLWJyYXRoZW4iLCJhIjoiY2xsbm5wcnQxMDI1bDNkbzQxaTFnNDA2OSJ9.IjsrKGbU65mmJI-Ba-Ztug";
const OSLO_BOUNDS = { longitude: 10.747263, latitude: 59.926678 };

type LoggedEvent = Record<"string", LngLat>;

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
  const [marker, setMarker] = useState({
    ...OSLO_BOUNDS,
  });
  const [events, logEvents] = useState<LoggedEvent[]>([]);

  const onMarkerDragStart = useCallback((event: MarkerDragEvent) => {
    logEvents((_events) => ({ ..._events, onDragStart: event.lngLat }));
  }, []);

  const onMarkerDrag = useCallback((event: MarkerDragEvent) => {
    logEvents((_events) => ({ ..._events, onDrag: event.lngLat }));

    setMarker({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
    });
  }, []);

  const onMarkerDragEnd = useCallback((event: MarkerDragEvent) => {
    logEvents((_events) => ({ ..._events, onDragEnd: event.lngLat }));
  }, []);

  const onClickMap = useCallback(
    (evt: MapLayerMouseEvent) => {
      const features = evt.features;
      if (features === undefined || features.length === 0) {
        return;
      }
      console.log("MAPCLICK", features);
      const feature = features[0];
      const isSelected = feature.properties?.vehicleId === selectedId;
      const vehicleToSelect = currVehicles.find(
        (x) => x.vehicleId === feature.properties?.vehicleId
      );
      if (vehicleToSelect === undefined) {
        return;
      }
      setSelectedVehicle(isSelected ? undefined : vehicleToSelect);
    },
    [currVehicles]
  );

  return (
    <div className="h-screen">
      <Map
        {...viewState}
        ref={mapRef}
        reuseMaps
        interactiveLayerIds={["vehicles", "vehicles-highlight"]}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        minZoom={11}
        attributionControl={false}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={onClickMap}
        onMouseMove={(evt) => {
          const feature = evt.features?.[0];
          if (feature === undefined) {
            if (hoveredVehicle !== undefined) {
              selectHoveredVehicle(undefined);
            }
            return;
          }
          const vehicleToSelect = currVehicles.find(
            (x) => x.vehicleId === feature.properties?.vehicleId
          );
          if (vehicleToSelect === hoveredVehicle) {
            return;
          }
          selectHoveredVehicle(vehicleToSelect);
        }}
      >
        {children}
        <Marker
          longitude={marker.longitude}
          latitude={marker.latitude}
          draggable
          onDragStart={onMarkerDragStart}
          onDrag={onMarkerDrag}
          onDragEnd={onMarkerDragEnd}
        />
        {/* <Source
            type="geojson"
            data={{
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    coordinates: [marker.longitude, marker.latitude],
                    type: "Point",
                  },
                },
              ],
            }}
          >
            <Layer {...parkLayer} />
          </Source> */}
      </Map>
    </div>
  );
}
