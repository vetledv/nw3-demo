import Map, {
  Marker,
  type MarkerDragEvent,
  type LngLat,
  type MapRef,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useRef, useState } from "react";
import { useSelectedVehicleStore, useVehicleSelect } from "~/utils/zustand";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaGVucmlrLWJyYXRoZW4iLCJhIjoiY2xsbm5wcnQxMDI1bDNkbzQxaTFnNDA2OSJ9.IjsrKGbU65mmJI-Ba-Ztug";
const OSLO_BOUNDS = { longitude: 10.747263, latitude: 59.926678 };

type LoggedEvent = Record<"string", LngLat>;

export default function MapContainer({ children }: React.PropsWithChildren) {
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

  const selectedId = useSelectedVehicleStore();
  const selectVehicle = useVehicleSelect();

  return (
    <div className="h-screen">
      <Map
        {...viewState}
        ref={mapRef}
        reuseMaps
        interactiveLayerIds={["vehicles"]}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        minZoom={11}
        attributionControl={false}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={(event) => {
          if (event.features === undefined || event.features.length === 0) {
            return;
          }
          const features = event.features;
          console.log(event.features);
          const alreadySelected =
            selectedId === features[0].properties?.vehicleId;

          selectVehicle(
            alreadySelected ? undefined : features[0].properties?.vehicleId
          ); //TODO: type features
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
