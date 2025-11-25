import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { location } from "./schema";

// Create a new enemy
export const create = mutation({
  args: {
    type: v.optional(v.string()),
    estimatedStrength: v.optional(v.number()),
    threatLevel: v.optional(v.string()),
    ...location,
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("enemies", args);
    return await ctx.db.get(id);
  },
});

// Read all enemies
export const list = query({
  handler: async (ctx) => {
    const enemies = await ctx.db.query("enemies").collect();
    return enemies;
  },
});

// Read a single enemy by ID
export const get = query({
  args: {
    id: v.id("enemies"),
  },
  handler: async (ctx, args) => {
    const enemy = await ctx.db.get(args.id);
    return enemy;
  },
});

// Update an enemy
export const update = mutation({
  args: {
    id: v.id("enemies"),
    type: v.optional(v.string()),
    estimatedStrength: v.optional(v.number()),
    threatLevel: v.optional(v.string()),
    ...location,
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args);
    return await ctx.db.get(args.id);
  },
});

// Delete an enemy
export const remove = mutation({
  args: {
    id: v.id("enemies"),
  },
  returns: v.object({
    success: v.boolean(),
    id: v.id("enemies"),
  }),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true, id: args.id };
  },
});

