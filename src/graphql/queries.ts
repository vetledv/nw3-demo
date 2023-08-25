import { graphql } from "~/graphql/gen";

export const subVehicles = graphql(`
  subscription GetVehicles {
    vehicles {
      vehicleId
      lastUpdated
      location {
        latitude
        longitude
      }
    }
  }
`);
