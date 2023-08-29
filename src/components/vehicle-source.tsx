import { useMemo, useState } from "react";
import { useSubscription } from "@apollo/client";
import { Source, Layer } from "react-map-gl";
import type { Feature, FeatureCollection, Geometry } from "geojson";

import {
  type Vehicle,
  type MaybeVehicle,
  subVehicles,
} from "~/graphql/queries";
import { useSelectedVehicleStore } from "~/utils/zustand";

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
function notEmpty<T>(value: T | null | undefined): value is T {
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
const olderThanMillis = (date: Date, millis: number) => {
  const msDiff = new Date().getTime() - date.getTime();
  return msDiff > millis;
};

export function VehicleSource() {
  const [vehicles, setVehicles] = useState<Array<MaybeVehicle>>([]);
  const selectedId = useSelectedVehicleStore();

  const vehiclesSub = useSubscription(subVehicles, {
    variables,
    onData(opts) {
      const { data } = opts.data;
      if (!data?.vehicles || data.vehicles.length === 0) {
        //TODO: filter time here too?
        //if none are added for a long time, it will not filter old entries
        return;
      }
      //TODO: spaghetti
      const seenVehicles = new Set<string>();
      const dupeFiltered = data.vehicles.filter(notEmpty).filter((vehicle) => {
        if (!vehicle.vehicleId) {
          return false;
        }
        const dupe = seenVehicles.has(vehicle.vehicleId);
        seenVehicles.add(vehicle.vehicleId);
        return !dupe;
      });
      setVehicles((prevArr) => {
        const prevFiltered = prevArr.filter((prevItem) => {
          const date = new Date(prevItem.lastUpdated);
          const olderThanTwoMin = olderThanMillis(date, ONE_MIN);
          if (olderThanTwoMin) {
            return false;
          }
          return !seenVehicles.has(prevItem.vehicleId!);
        });
        return prevFiltered.concat(dupeFiltered);
      });
    },
  });

  const geojsonVehicles = useMemo(() => {
    const features = vehicles.map((vehicle) => {
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
  }, [vehiclesSub.data]) satisfies VehicleFeatCol;

  const selected = selectedId ?? "";
  const filter = useMemo(() => ["in", "vehicleId", selected], [selected]);

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
