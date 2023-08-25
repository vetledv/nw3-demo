/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Java ZonedDateTime as scalar. */
  DateTime: { input: any; output: any; }
};

/**
 * Entur realtime vehicles graphql schema
 * Aquired by going to: https://studio.apollographql.com/sandbox/schema/sdl
 * And set endpoint to: https://api.entur.io/realtime/v1/vehicles/graphql
 */
export type BoundingBox = {
  maxLat: Scalars['Float']['input'];
  maxLon: Scalars['Float']['input'];
  minLat: Scalars['Float']['input'];
  minLon: Scalars['Float']['input'];
};

export type Codespace = {
  __typename?: 'Codespace';
  codespaceId: Scalars['String']['output'];
};

export type Line = {
  __typename?: 'Line';
  lineName?: Maybe<Scalars['String']['output']>;
  lineRef?: Maybe<Scalars['String']['output']>;
  publicCode?: Maybe<Scalars['String']['output']>;
};

export type Location = {
  __typename?: 'Location';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export enum OccupancyEnumeration {
  FewSeatsAvailable = 'FEW_SEATS_AVAILABLE',
  Full = 'FULL',
  ManySeatsAvailable = 'MANY_SEATS_AVAILABLE',
  NotAcceptingPassengers = 'NOT_ACCEPTING_PASSENGERS',
  SeatsAvailable = 'SEATS_AVAILABLE',
  StandingAvailable = 'STANDING_AVAILABLE',
  Unknown = 'UNKNOWN'
}

export type Operator = {
  __typename?: 'Operator';
  operatorRef: Scalars['String']['output'];
};

export type PointsOnLink = {
  __typename?: 'PointsOnLink';
  length?: Maybe<Scalars['Float']['output']>;
  points?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  codespaces?: Maybe<Array<Maybe<Codespace>>>;
  lines?: Maybe<Array<Maybe<Line>>>;
  operators?: Maybe<Array<Maybe<Operator>>>;
  serviceJourney?: Maybe<ServiceJourney>;
  serviceJourneys?: Maybe<Array<Maybe<ServiceJourney>>>;
  vehicles?: Maybe<Array<Maybe<VehicleUpdate>>>;
};


export type QueryLinesArgs = {
  codespaceId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryOperatorsArgs = {
  codespaceId: Scalars['String']['input'];
};


export type QueryServiceJourneyArgs = {
  id: Scalars['String']['input'];
};


export type QueryServiceJourneysArgs = {
  lineRef: Scalars['String']['input'];
};


export type QueryVehiclesArgs = {
  boundingBox?: InputMaybe<BoundingBox>;
  codespaceId?: InputMaybe<Scalars['String']['input']>;
  lineName?: InputMaybe<Scalars['String']['input']>;
  lineRef?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<VehicleModeEnumeration>;
  monitored?: InputMaybe<Scalars['Boolean']['input']>;
  operatorRef?: InputMaybe<Scalars['String']['input']>;
  serviceJourneyId?: InputMaybe<Scalars['String']['input']>;
  vehicleId?: InputMaybe<Scalars['String']['input']>;
};

export type ServiceJourney = {
  __typename?: 'ServiceJourney';
  id: Scalars['String']['output'];
  /** @deprecated Experimental - should not be used with subscription */
  pointsOnLink?: Maybe<PointsOnLink>;
  /** @deprecated Use 'id' instead. */
  serviceJourneyId: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  /** @deprecated Use 'vehicles'. */
  vehicleUpdates?: Maybe<Array<Maybe<VehicleUpdate>>>;
  vehicles?: Maybe<Array<Maybe<VehicleUpdate>>>;
};


export type SubscriptionVehicleUpdatesArgs = {
  boundingBox?: InputMaybe<BoundingBox>;
  bufferSize?: InputMaybe<Scalars['Int']['input']>;
  bufferTime?: InputMaybe<Scalars['Int']['input']>;
  codespaceId?: InputMaybe<Scalars['String']['input']>;
  lineName?: InputMaybe<Scalars['String']['input']>;
  lineRef?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<VehicleModeEnumeration>;
  monitored?: InputMaybe<Scalars['Boolean']['input']>;
  operatorRef?: InputMaybe<Scalars['String']['input']>;
  serviceJourneyId?: InputMaybe<Scalars['String']['input']>;
  vehicleId?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionVehiclesArgs = {
  boundingBox?: InputMaybe<BoundingBox>;
  bufferSize?: InputMaybe<Scalars['Int']['input']>;
  bufferTime?: InputMaybe<Scalars['Int']['input']>;
  codespaceId?: InputMaybe<Scalars['String']['input']>;
  lineName?: InputMaybe<Scalars['String']['input']>;
  lineRef?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<VehicleModeEnumeration>;
  monitored?: InputMaybe<Scalars['Boolean']['input']>;
  operatorRef?: InputMaybe<Scalars['String']['input']>;
  serviceJourneyId?: InputMaybe<Scalars['String']['input']>;
  vehicleId?: InputMaybe<Scalars['String']['input']>;
};

export enum VehicleModeEnumeration {
  Air = 'AIR',
  Bus = 'BUS',
  Coach = 'COACH',
  Ferry = 'FERRY',
  Metro = 'METRO',
  Rail = 'RAIL',
  Tram = 'TRAM'
}

export enum VehicleStatusEnumeration {
  Assigned = 'ASSIGNED',
  AtOrigin = 'AT_ORIGIN',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  OffRoute = 'OFF_ROUTE'
}

export type VehicleUpdate = {
  __typename?: 'VehicleUpdate';
  bearing?: Maybe<Scalars['Float']['output']>;
  codespace?: Maybe<Codespace>;
  /** The current delay in seconds - negative delay means ahead of schedule */
  delay?: Maybe<Scalars['Float']['output']>;
  direction?: Maybe<Scalars['String']['output']>;
  expiration?: Maybe<Scalars['DateTime']['output']>;
  expirationEpochSecond?: Maybe<Scalars['Float']['output']>;
  /** @deprecated Use 'bearing''. */
  heading?: Maybe<Scalars['Float']['output']>;
  /** Whether the vehicle is affected by traffic jams or other circumstances which may lead to further delays. If `null`, current status is unknown. */
  inCongestion?: Maybe<Scalars['Boolean']['output']>;
  lastUpdated?: Maybe<Scalars['DateTime']['output']>;
  lastUpdatedEpochSecond?: Maybe<Scalars['Float']['output']>;
  line?: Maybe<Line>;
  location?: Maybe<Location>;
  mode?: Maybe<VehicleModeEnumeration>;
  monitored?: Maybe<Scalars['Boolean']['output']>;
  occupancy?: Maybe<OccupancyEnumeration>;
  operator?: Maybe<Operator>;
  serviceJourney?: Maybe<ServiceJourney>;
  speed?: Maybe<Scalars['Float']['output']>;
  vehicleId?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use 'vehicleId'. */
  vehicleRef?: Maybe<Scalars['String']['output']>;
  /** Reported status of the vehicle */
  vehicleStatus?: Maybe<VehicleStatusEnumeration>;
};

export type GetVehiclesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type GetVehiclesSubscription = { __typename?: 'Subscription', vehicles?: Array<{ __typename?: 'VehicleUpdate', vehicleId?: string | null, lastUpdated?: any | null, location?: { __typename?: 'Location', latitude: number, longitude: number } | null } | null> | null };


export const GetVehiclesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"GetVehicles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vehicles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vehicleId"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdated"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]}}]}}]} as unknown as DocumentNode<GetVehiclesSubscription, GetVehiclesSubscriptionVariables>;