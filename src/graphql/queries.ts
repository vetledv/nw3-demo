import { graphql } from "~/graphql/gen";
import { GetVehiclesSubscription } from "~/graphql/gen/graphql";

type GetVehicleSub = NonNullable<GetVehiclesSubscription>;
export type MaybeVehicle = NonNullable<
  NonNullable<GetVehicleSub["vehicles"]>[number]
>;
export type Vehicle = {
  [K in keyof MaybeVehicle]-?: NonNullable<MaybeVehicle[K]>;
};

export const subVehicles = graphql(`
  subscription GetVehicles(
    $codespaceId: String
    $boundingBox: BoundingBox
    $bufferSize: Int
    $bufferTime: Int
  ) {
    vehicles(
      codespaceId: $codespaceId
      boundingBox: $boundingBox
      bufferSize: $bufferSize
      bufferTime: $bufferTime
    ) {
      vehicleId
      lastUpdated
      location {
        latitude
        longitude
      }
    }
  }
`);
