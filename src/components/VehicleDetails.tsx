import type { MaybeVehicle } from "~/types/vehicles";
import { useHoveredVehicle, useSelectedVehicle } from "~/utils/zustand";

export default function VehicleDetails() {
  const value: MaybeVehicle | undefined = useSelectedVehicle();
  const { vehicleId, location } = { ...value };

  return (
    <>
      <div>{vehicleId}</div>
      <div>{location?.latitude}</div>
      <div>{location?.longitude}</div>
    </>
  );
}

export function VehicleCard({
  vehicle,
}: {
  vehicle: MaybeVehicle | undefined;
}) {
  const { vehicleId, location } = { ...vehicle };
  return (
    <div className="p-2 space-y-2 rounded-md bg-slate-600">
      <p>{vehicleId}</p>
      <p>{location?.latitude}</p>
      <p>{location?.longitude}</p>
    </div>
  );
}

export function VehicleDetailWrapper() {
  const hoveredVehicle = useHoveredVehicle();
  const selectedVehicle = useSelectedVehicle();
  return (
    <div className="space-y-4">
      {selectedVehicle && (
        <div className="space-y-2">
          <p>Selected</p>
          <VehicleCard vehicle={selectedVehicle} />
        </div>
      )}
      {hoveredVehicle && (
        <div className="space-y-2">
          <p>Hovered</p>
          <VehicleCard vehicle={hoveredVehicle} />
        </div>
      )}
    </div>
  );
}