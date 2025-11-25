import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { location } from "./schema";

// Create a new mission
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    start: v.string(),
    end: v.optional(v.string()),
    status: v.string(),
    unitId: v.optional(v.id("units")),
    ...location,
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("missions", args);
    return await ctx.db.get(id);
  },
});

// Read all missions
export const list = query({
  handler: async (ctx) => {
    const missions = await ctx.db.query("missions").collect();
    return missions;
  },
});

// Read a single mission by ID
export const get = query({
  args: {
    id: v.id("missions"),
  },
  handler: async (ctx, args) => {
    const mission = await ctx.db.get(args.id);
    return mission;
  },
});

// Update a mission
export const update = mutation({
  args: {
    id: v.id("missions"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    start: v.optional(v.string()),
    end: v.optional(v.string()),
    status: v.optional(v.string()),
    unitId: v.optional(v.id("units")),
    ...location,
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args);
    return await ctx.db.get(args.id);
  },
});

// Delete a mission
export const remove = mutation({
  args: {
    id: v.id("missions"),
  },
  returns: v.object({
    success: v.boolean(),
    id: v.id("missions"),
  }),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true, id: args.id };
  },
});

