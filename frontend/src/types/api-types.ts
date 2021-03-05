/**
 * ⚠️ These type definitions are generated automatically by graphql-codegen.
 * The generation is configurated in codegen.yaml. Visit the docs for more information:
 * https://graphql-code-generator.com/docs/getting-started/index
 */

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};


export type Group = {
  __typename?: 'Group';
  id: Scalars['Int'];
  name: Scalars['String'];
  groupType: GroupType;
};

export type GroupInput = {
  name: Scalars['String'];
  groupType: GroupType;
};

export type Query = {
  __typename?: 'Query';
  listGroups: Array<Group>;
  listShipments: Array<Shipment>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addGroup: Group;
  addShipment: Shipment;
};


export type MutationAddGroupArgs = {
  input: GroupInput;
};


export type MutationAddShipmentArgs = {
  input: ShipmentInput;
};

export type ShipmentInput = {
  shippingRoute: ShippingRoute;
  labelYear: Scalars['Int'];
  labelMonth: Scalars['Int'];
  sendingHubId: Scalars['Int'];
  receivingHubId: Scalars['Int'];
  status: ShipmentStatus;
};

export enum ShippingRoute {
  Uk = 'UK'
}

export enum ShipmentStatus {
  Announced = 'ANNOUNCED',
  Open = 'OPEN',
  Staging = 'STAGING',
  InProgress = 'IN_PROGRESS',
  Complete = 'COMPLETE',
  Abandoned = 'ABANDONED'
}

export type Shipment = {
  __typename?: 'Shipment';
  id: Scalars['Int'];
  shippingRoute: ShippingRoute;
  labelYear: Scalars['Int'];
  labelMonth: Scalars['Int'];
  offerSubmissionDeadline?: Maybe<Scalars['Date']>;
  status: ShipmentStatus;
  sendingHubId: Scalars['Int'];
  sendingHub: Group;
  receivingHubId: Scalars['Int'];
  receivingHub: Group;
  statusChangeTime: Scalars['Date'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
};

export enum GroupType {
  DaHub = 'DA_HUB',
  ReceivingGroup = 'RECEIVING_GROUP',
  SendingGroup = 'SENDING_GROUP'
}