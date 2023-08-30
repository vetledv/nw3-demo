import { useMemo } from "react";
import { useSubscription } from "@apollo/client";
import { Source, Layer } from "react-map-gl";
import type { Feature, FeatureCollection, Geometry } from "geojson";

import {
  type Vehicle,
  type MaybeVehicle,
  subVehicles,
} from "~/graphql/queries";
import {
  useCurrVehiclesActions,
  useCurrVehiclesStore,
  useSelectedVehicleStore,
} from "~/utils/zustand";

type VehicleProperties = Pick<Vehicle, "lastUpdated" | "vehicleId">;

type VehicleFeatCol = FeatureCollection<Geometry, VehicleProperties>;
type VehicleFeature = Feature<Geometry, VehicleProperties>;

/**
 * Generic type predicate fn to filter falsy values.
 *
 * Usage: `someArray.filter(notEmpty)`
 *
 * @link https://stackoverflow.com/a/46700791
 */
export function notEmpty<T>(value: T | null | undefined): value is T {
  if (value === null || value === undefined) {
    return false;
  }
  return true;
}

const osloBoundingBox = {
  minLat: 59.648293,
  minLon: 10.532085,
  maxLat: 59.983825,
  maxLon: 10.996665,
} as const;

const variables = {
  boundingBox: osloBoundingBox,
  bufferTime: 1_000,
  codespaceId: "VYX",
} as const;

const paint = {
  "circle-color": "#ffff00",
  "circle-radius": 12,
  "circle-stroke-color": "#333333",
  "circle-stroke-width": 2,
};
const selectedPaint = {
  "circle-color": "#ff0000",
  "circle-radius": 12,
  "circle-stroke-color": "#666666",
  "circle-stroke-width": 2,
};

const ONE_MIN = 60 * 1000;

/**
 * Checks if a date is older than specified interval `millis`
 * @param date the date to compare with now
 * @param millis amount of ms
 * @returns boolean
 */
export const olderThanMillis = (date: Date, millis: number) => {
  const msDiff = new Date().getTime() - date.getTime();
  return msDiff > millis;
};

export function VehicleSource() {
  const currVehicles = useCurrVehiclesStore();
  const cvActions = useCurrVehiclesActions();
  const selectedVehicle = useSelectedVehicleStore();

  const vehiclesSub = useSubscription(subVehicles, {
    variables,
    onData(opts) {
      const vehicles = opts.data.data?.vehicles
      if (!vehicles || vehicles.length === 0) {
        //TODO: filter time here too?
        //if none are added for a long time, it will not filter old entries
        return;
      }
      cvActions.replace(vehicles);
      console.log(currVehicles)
    },
  });

  const geojsonVehicles = useMemo(() => {
    const features = currVehicles.map((vehicle) => {
      return {
        type: "Feature",
        id: vehicle!.vehicleId!,
        geometry: {
          type: "Point",
          coordinates: [
            vehicle!.location!.longitude,
            vehicle!.location!.latitude,
          ],
        },
        properties: {
          //TODO: lastUpdated is typed as any
          lastUpdated: vehicle!.lastUpdated as string,
          vehicleId: vehicle!.vehicleId!,
        },
      };
    }) satisfies Array<VehicleFeature> | undefined;

    return {
      type: "FeatureCollection",
      features: features || [],
    };
  }, [currVehicles]) satisfies VehicleFeatCol;

  const filter = ["in", "vehicleId", selectedVehicle?.vehicleId ?? ""];

  return (
    <Source id="vehicles" type="geojson" data={geojsonVehicles}>
      <Layer id="vehicles" interactive type="circle" paint={paint} />
      <Layer
        id="vehicles-highlight"
        interactive
        filter={filter}
        type="circle"
        paint={selectedPaint}
      />
    </Source>
  );
}
