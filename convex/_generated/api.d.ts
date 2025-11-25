/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as armaments from "../armaments.js";
import type * as bases from "../bases.js";
import type * as deliveries from "../deliveries.js";
import type * as enemies from "../enemies.js";
import type * as events from "../events.js";
import type * as locations from "../locations.js";
import type * as missions from "../missions.js";
import type * as soldiers from "../soldiers.js";
import type * as units from "../units.js";
import type * as vehicles from "../vehicles.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  armaments: typeof armaments;
  bases: typeof bases;
  deliveries: typeof deliveries;
  enemies: typeof enemies;
  events: typeof events;
  locations: typeof locations;
  missions: typeof missions;
  soldiers: typeof soldiers;
  units: typeof units;
  vehicles: typeof vehicles;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
