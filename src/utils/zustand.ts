import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { filterDuplicates, olderThanMillis } from "~/utils";
import type { Vehicle, MaybeVehicle } from "~/types/vehicles";

type VehicleProperties = Pick<Vehicle, "lastUpdated" | "vehicleId">;
type VehicleFeatCol = FeatureCollection<Geometry, VehicleProperties>;
type VehicleFeature = Feature<Geometry, VehicleProperties>;

type SelectedVehicleSlice = {
  selectedVehicle: MaybeVehicle | undefined;
  hoveredVehicle: MaybeVehicle | undefined;
  setSelected: (vehicle: MaybeVehicle | undefined) => void;
  setHovered: (vehicle: MaybeVehicle | undefined) => void;
};

type CurrentVehiclesSlice = {
  currentVehicles: Array<MaybeVehicle>;
  getGeoJSONVehicles: () => VehicleFeatCol;
  actions: {
    add: (vehicle: MaybeVehicle) => void;
    remove: (id: string | undefined) => void;
    concat: (vehicles: Array<MaybeVehicle | null | undefined>) => void;
  };
};

type BoundVehicleSlice = SelectedVehicleSlice & CurrentVehiclesSlice;

const ONE_MIN = 60 * 1000;

function vehicleToGeoJSONFeature(vehicle: MaybeVehicle): VehicleFeature {
  if (!vehicle.location || !vehicle.vehicleId || !vehicle.lastUpdated) {
    throw new Error("Vehicle had undefined properties");
  }
  return {
    type: "Feature",
    id: vehicle.vehicleId,
    geometry: {
      type: "Point",
      coordinates: [vehicle.location.longitude, vehicle.location.latitude],
    },
    properties: {
      //TODO: lastUpdated is typed as any
      lastUpdated: vehicle.lastUpdated,
      vehicleId: vehicle.vehicleId,
    },
  } satisfies VehicleFeature;
}

const createSelectedVehicleSlice: StateCreator<SelectedVehicleSlice> = (
  set
) => ({
  selectedVehicle: undefined,
  hoveredVehicle: undefined,
  setSelected: (vehicle) => set(() => ({ selectedVehicle: vehicle })),
  setHovered: (vehicle) => set(() => ({ hoveredVehicle: vehicle })),
});

const createCurrentVehiclesSlice: StateCreator<CurrentVehiclesSlice> = (
  set,
  get
) => ({
  currentVehicles: [],
  getGeoJSONVehicles: () => {
    const currState = get();
    const features = currState.currentVehicles.map((vehicle) =>
      vehicleToGeoJSONFeature(vehicle)
    );
    return {
      type: "FeatureCollection",
      features: features,
    };
  },
  actions: {
    add: (vehicle) =>
      set((state) => ({
        currentVehicles: [
          ...state.currentVehicles.filter(
            (prev) => prev.vehicleId === vehicle.vehicleId
          ),
          vehicle,
        ],
      })),
    remove: (id) =>
      set((state) => ({
        currentVehicles: state.currentVehicles.filter(
          (prev) => prev.vehicleId !== id
        ),
      })),
    concat: (vehicles) =>
      set((state) => {
        const [newFiltered, seenIds] = filterDuplicates(vehicles, "vehicleId");
        const prevFiltered = state.currentVehicles.filter((prev) => {
          const date = new Date(prev.lastUpdated);
          const olderThanTwoMin = olderThanMillis(date, ONE_MIN);
          if (olderThanTwoMin) {
            return false;
          }
          return !seenIds.has(prev.vehicleId!);
        });
        return { currentVehicles: prevFiltered.concat(newFiltered) };
      }),
  },
});

const useBoundStore = create<BoundVehicleSlice>()(
  devtools((...a) => ({
    ...createSelectedVehicleSlice(...a),
    ...createCurrentVehiclesSlice(...a),
    ...createCurrentVehiclesSlice(...a),
  }))
);

//createSelectedVehicleSlice

export const useSelectedVehicle = () => useBoundStore((s) => s.selectedVehicle);

export const useSetSelectedVehicle = () => useBoundStore((s) => s.setSelected);

export const useHoveredVehicle = () => useBoundStore((s) => s.hoveredVehicle);

export const useSetHoveredVehicle = () => useBoundStore((s) => s.setHovered);

//createCurrentVehiclesSlice

export const useCurrentVehicles = () => useBoundStore((s) => s.currentVehicles);

export const useGeoJSONVehicles = () =>
  useBoundStore((s) => s.getGeoJSONVehicles);

export const useCurrentVehiclesActions = () => useBoundStore((s) => s.actions);
