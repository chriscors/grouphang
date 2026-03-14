/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as airbnbs from "../airbnbs.js";
import type * as healthCheck from "../healthCheck.js";
import type * as lib_budgetMath from "../lib/budgetMath.js";
import type * as lib_rankingMath from "../lib/rankingMath.js";
import type * as responses from "../responses.js";
import type * as seed from "../seed.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  airbnbs: typeof airbnbs;
  healthCheck: typeof healthCheck;
  "lib/budgetMath": typeof lib_budgetMath;
  "lib/rankingMath": typeof lib_rankingMath;
  responses: typeof responses;
  seed: typeof seed;
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
