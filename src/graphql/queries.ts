import { graphql } from "~/graphql/gen";

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
