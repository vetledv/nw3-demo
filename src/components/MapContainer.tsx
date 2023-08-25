import Map, { Marker, type MarkerDragEvent, type LngLat } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { vehicles } from "./vehicles";
import { memo, useCallback, useState } from "react";

// const parkLayer: CircleLayer = {
//   id: "landuse_park",
//   type: "circle",
//   paint: {
//     "circle-radius": 100,
//     "circle-color": "#00ffff",
//     "circle-opacity": 0.4,
//   },
// };

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaGVucmlrLWJyYXRoZW4iLCJhIjoiY2xsbm5wcnQxMDI1bDNkbzQxaTFnNDA2OSJ9.IjsrKGbU65mmJI-Ba-Ztug";
const OSLO_BOUNDS = { longitude: 10.747263, latitude: 59.926678 };

type LoggedEvent =
  | { onDrag: LngLat }
  | { onDragEnd: LngLat }
  | { onDragStart: LngLat };

function MapContainer() {
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

  console.info(events);

  return (
    <div className="h-screen">
      <Map
        {...viewState}
        mapboxAccessToken={MAPBOX_TOKEN}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        minZoom={11}
        attributionControl={false}
      >
        {vehicles.map((vehicle, key) => {
          return (
            <Marker
              key={key}
              longitude={vehicle.location.longitude}
              latitude={vehicle.location.latitude}
              color="red"
            />
          );
        })}
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

export default memo(MapContainer)