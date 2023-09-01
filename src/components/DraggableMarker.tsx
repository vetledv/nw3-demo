import { Marker, type MarkerDragEvent } from 'react-map-gl';
import { useCallback } from 'react';
import { useMarkerEvents, useSetMarkerEvents } from '~/store/MarkerStore';

export default function DraggableMarker() {
  const marker = useMarkerEvents();
  const setMarker = useSetMarkerEvents();

  const onMarkerDragEnd = useCallback((event: MarkerDragEvent) => {
    setMarker({ longitude: event.lngLat.lng, latitude: event.lngLat.lat });
  }, []);

  return (
    <Marker
      longitude={marker.longitude}
      latitude={marker.latitude}
      draggable
      onDragEnd={onMarkerDragEnd}
    />
  );
}
