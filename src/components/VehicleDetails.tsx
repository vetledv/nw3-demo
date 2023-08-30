import { MaybeVehicle } from "~/graphql/queries";
import { useSelectedVehicleStore } from "~/utils/zustand";

export default function VehicleDetails() {
  const value: MaybeVehicle | undefined = useSelectedVehicleStore();
  const { vehicleId, location } = { ...value };

  console.log(value);

  return (
    <>
      <div>{vehicleId}</div>
      <div>{location?.latitude}</div>
      <div>{location?.longitude}</div>
    </>
  );
}
