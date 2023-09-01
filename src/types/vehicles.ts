import type { GetVehiclesSubscription } from '~/graphql/gen/graphql';
import type { DeepNonNullable } from '~/types';

type GetVehicleSub = NonNullable<GetVehiclesSubscription>;
type MaybeVehicleOrNull = NonNullable<GetVehicleSub['vehicles']>[number];

export type MaybeVehicle = NonNullable<MaybeVehicleOrNull>;

export type Vehicle = DeepNonNullable<MaybeVehicle>;
