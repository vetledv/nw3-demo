import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

type SelectedVehicleSlice = {
  selectedId: string | undefined;
  select: (id: string | undefined) => void;
};

type BoundVehicleSlice = SelectedVehicleSlice;

const createSelectedVehicleSlice: StateCreator<SelectedVehicleSlice> = (
  set
) => ({
  selectedId: undefined,
  select: (id) => set(() => ({ selectedId: id })),
});

const useBoundStore = create<BoundVehicleSlice>()(
  devtools((...a) => ({
    ...createSelectedVehicleSlice(...a),
  }))
);

export const useSelectedVehicleStore = () => useBoundStore((s) => s.selectedId);
export const useVehicleSelect = () => useBoundStore((s) => s.select);
