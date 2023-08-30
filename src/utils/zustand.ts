import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { notEmpty, olderThanMillis } from "~/components/vehicle-source";
import { MaybeVehicle } from "~/graphql/queries";

const ONE_MIN = 60 * 1000;

type SelectedVehicleSlice = {
  selectedVehicle: MaybeVehicle | undefined;
  select: (id: MaybeVehicle | undefined) => void;
};

type CurrentVehiclesSlice = {
  vehicles: Array<MaybeVehicle>;
  actions: {
    add: (vehicle: MaybeVehicle) => void;
    remove: (id: string | undefined) => void;
    replace: (vehicles: Array<MaybeVehicle | null>) => void;
  };
};

type BoundVehicleSlice = SelectedVehicleSlice & CurrentVehiclesSlice;

const createSelectedVehicleSlice: StateCreator<SelectedVehicleSlice> = (
  set
) => ({
  selectedVehicle: undefined,
  select: (vehicle) => set(() => ({ selectedVehicle: vehicle })),
});

const createCurrentVehiclesSlice: StateCreator<CurrentVehiclesSlice> = (
  set
) => ({
  vehicles: [],
  actions: {
    add: (vehicle) =>
      set((state) => ({
        vehicles: [
          ...state.vehicles.filter(
            (prev) => prev.vehicleId === vehicle.vehicleId
          ),
          vehicle,
        ],
      })),
    remove: (id) =>
      set((state) => ({
        vehicles: state.vehicles.filter((prev) => prev.vehicleId !== id),
      })),
    replace: (vehicles) =>
      set((state) => {
        const seenVehicles = new Set<string>();
        const dupeFiltered = vehicles.filter(notEmpty).filter((vehicle) => {
          if (!vehicle.vehicleId) {
            return false;
          }
          const dupe = seenVehicles.has(vehicle.vehicleId);
          seenVehicles.add(vehicle.vehicleId);
          return !dupe;
        });
        const prevFiltered = state.vehicles.filter((prevItem) => {
          const date = new Date(prevItem.lastUpdated);
          const olderThanTwoMin = olderThanMillis(date, ONE_MIN);
          if (olderThanTwoMin) {
            return false;
          }
          return !seenVehicles.has(prevItem.vehicleId!);
        });
        return { vehicles: prevFiltered.concat(dupeFiltered) };
      }),
  },
});

const useBoundStore = create<BoundVehicleSlice>()(
  devtools((...a) => ({
    ...createSelectedVehicleSlice(...a),
    ...createCurrentVehiclesSlice(...a),
  }))
);

export const useSelectedVehicleStore = () =>
  useBoundStore((s) => s.selectedVehicle);
export const useVehicleSelect = () => useBoundStore((s) => s.select);

export const useCurrVehiclesStore = () => useBoundStore((s) => s.vehicles);
export const useCurrVehiclesActions = () => useBoundStore((s) => s.actions);
