import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { location } from "./schema";

// Create a new vehicle
export const create = mutation({
  args: {
    type: v.string(),
    status: v.string(),
    unitId: v.optional(v.id("units")),
    ...location,
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("vehicles", args);
    return await ctx.db.get(id);
  },
});

// Read all vehicles
export const list = query({
  handler: async (ctx) => {
    const vehicles = await ctx.db.query("vehicles").collect();
    return vehicles;
  },
});

// Read a single vehicle by ID
export const get = query({
  args: {
    id: v.id("vehicles"),
  },
  handler: async (ctx, args) => {
    const vehicle = await ctx.db.get(args.id);
    return vehicle;
  },
});

// Update a vehicle
export const update = mutation({
  args: {
    id: v.id("vehicles"),
    type: v.optional(v.string()),
    status: v.optional(v.string()),
    unitId: v.optional(v.id("units")),
    ...location,
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args);
    return await ctx.db.get(args.id);
  },
});

// Delete a vehicle
export const remove = mutation({
  args: {
    id: v.id("vehicles"),
  },
  returns: v.object({
    success: v.boolean(),
    id: v.id("vehicles"),
  }),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true, id: args.id };
  },
});

