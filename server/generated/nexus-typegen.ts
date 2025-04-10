/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { core, connectionPluginCore } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * The `Date` custom scalar type represents dates (sent over in integer form)
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "Date";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * The `Date` custom scalar type represents dates (sent over in integer form)
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "Date";
    /**
     * Adds a Relay-style connection to the type, with numerous options for configuration
     *
     * @see https://nexusjs.org/docs/plugins/connection
     */
    connectionField<FieldName extends string>(
      fieldName: FieldName,
      config: connectionPluginCore.ConnectionFieldConfig<TypeName, FieldName>
    ): void
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
  ReplyType: "ALL" | "LINKS" | "REPLIES"
  VoteType: "NO" | "UP"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  Date: any
}

export interface NexusGenObjects {
  Mutation: {};
  PageInfo: { // root type
    endCursor?: string | null; // String
    hasNextPage: boolean; // Boolean!
    hasPreviousPage: boolean; // Boolean!
    startCursor?: string | null; // String
  }
  Query: {};
  Reply: { // root type
    content?: string | null; // String
    createdAt: NexusGenScalars['Date']; // Date!
    hasVoted: boolean; // Boolean!
    id: string; // ID!
    isLink: boolean; // Boolean!
    title?: string | null; // String
  }
  ReplyConnection: { // root type
    edges?: Array<NexusGenRootTypes['ReplyEdge'] | null> | null; // [ReplyEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
  ReplyEdge: { // root type
    cursor: string; // String!
    node?: NexusGenRootTypes['Reply'] | null; // Reply
  }
  User: { // root type
    about?: string | null; // String
    createdAt: NexusGenScalars['Date']; // Date!
    id: string; // ID!
    name: string; // String!
  }
}

export interface NexusGenInterfaces {
  Node: NexusGenRootTypes['Reply'] | NexusGenRootTypes['User'];
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenInterfaces & NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Mutation: { // field return type
    delete: boolean; // Boolean!
    post: NexusGenRootTypes['Reply']; // Reply!
    reply: NexusGenRootTypes['Reply']; // Reply!
    vote: boolean; // Boolean!
  }
  PageInfo: { // field return type
    endCursor: string | null; // String
    hasNextPage: boolean; // Boolean!
    hasPreviousPage: boolean; // Boolean!
    startCursor: string | null; // String
  }
  Query: { // field return type
    feed: NexusGenRootTypes['ReplyConnection'] | null; // ReplyConnection
    profile: NexusGenRootTypes['User']; // User!
    replies: Array<NexusGenRootTypes['Reply'] | null>; // [Reply]!
    reply: NexusGenRootTypes['Reply']; // Reply!
  }
  Reply: { // field return type
    author: NexusGenRootTypes['User']; // User!
    content: string | null; // String
    createdAt: NexusGenScalars['Date']; // Date!
    hasVoted: boolean; // Boolean!
    id: string; // ID!
    isLink: boolean; // Boolean!
    parent: NexusGenRootTypes['Reply'] | null; // Reply
    root: NexusGenRootTypes['Reply'] | null; // Reply
    title: string | null; // String
    voteCount: number; // Int!
  }
  ReplyConnection: { // field return type
    edges: Array<NexusGenRootTypes['ReplyEdge'] | null> | null; // [ReplyEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
  ReplyEdge: { // field return type
    cursor: string; // String!
    node: NexusGenRootTypes['Reply'] | null; // Reply
  }
  User: { // field return type
    about: string | null; // String
    createdAt: NexusGenScalars['Date']; // Date!
    id: string; // ID!
    name: string; // String!
    replies: NexusGenRootTypes['ReplyConnection'] | null; // ReplyConnection
  }
  Node: { // field return type
    id: string; // ID!
  }
}

export interface NexusGenFieldTypeNames {
  Mutation: { // field return type name
    delete: 'Boolean'
    post: 'Reply'
    reply: 'Reply'
    vote: 'Boolean'
  }
  PageInfo: { // field return type name
    endCursor: 'String'
    hasNextPage: 'Boolean'
    hasPreviousPage: 'Boolean'
    startCursor: 'String'
  }
  Query: { // field return type name
    feed: 'ReplyConnection'
    profile: 'User'
    replies: 'Reply'
    reply: 'Reply'
  }
  Reply: { // field return type name
    author: 'User'
    content: 'String'
    createdAt: 'Date'
    hasVoted: 'Boolean'
    id: 'ID'
    isLink: 'Boolean'
    parent: 'Reply'
    root: 'Reply'
    title: 'String'
    voteCount: 'Int'
  }
  ReplyConnection: { // field return type name
    edges: 'ReplyEdge'
    pageInfo: 'PageInfo'
  }
  ReplyEdge: { // field return type name
    cursor: 'String'
    node: 'Reply'
  }
  User: { // field return type name
    about: 'String'
    createdAt: 'Date'
    id: 'ID'
    name: 'String'
    replies: 'ReplyConnection'
  }
  Node: { // field return type name
    id: 'ID'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    delete: { // args
      replyId: string; // ID!
    }
    post: { // args
      content?: string | null; // String
      title: string; // String!
    }
    reply: { // args
      content: string; // String!
      parentId: string; // ID!
    }
    vote: { // args
      replyId: string; // ID!
      type: NexusGenEnums['VoteType']; // VoteType!
    }
  }
  Query: {
    feed: { // args
      after?: string | null; // String
      first: number; // Int!
    }
    profile: { // args
      id?: string | null; // ID
      name?: string | null; // String
    }
    replies: { // args
      rootId: string; // ID!
    }
    reply: { // args
      id: string; // ID!
    }
  }
  User: {
    replies: { // args
      after?: string | null; // String
      before?: string | null; // String
      first?: number | null; // Int
      last?: number | null; // Int
      type: NexusGenEnums['ReplyType']; // ReplyType!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
  Node: "Reply" | "User"
}

export interface NexusGenTypeInterfaces {
  Reply: "Node"
  User: "Node"
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = keyof NexusGenInterfaces;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = "Node";

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}