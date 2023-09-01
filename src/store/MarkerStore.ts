import { create } from 'zustand';

type Coordinates = { longitude: number; latitude: number };

type MarkerStoreTypes = {
  event: Coordinates;
  markerEvents: (lngLat: Coordinates) => void;
};

const START_POSITION = {
  longitude: 10.747263,
  latitude: 59.926678,
} as Coordinates;

const useMarkerStore = create<MarkerStoreTypes>((set) => ({
  event: START_POSITION,
  markerEvents: (coordinates: Coordinates) =>
    set(() => ({ event: coordinates })),
}));

export const useMarkerEvents = () => useMarkerStore((s) => s.event);

export const useSetMarkerEvents = () => useMarkerStore((s) => s.markerEvents);
