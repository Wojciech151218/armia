import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { location } from "./schema";

// Create a new base
export const create = mutation({
  args: {
    name: v.string(),
    capacity: v.optional(v.number()),
    ...location,
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("bases", args);
    return await ctx.db.get(id);
  },
});

// Read all bases
export const list = query({
  handler: async (ctx) => {
    const bases = await ctx.db.query("bases").collect();
    return bases;
  },
});

// Read a single base by ID
export const get = query({
  args: {
    id: v.id("bases"),
  },
  handler: async (ctx, args) => {
    const base = await ctx.db.get(args.id);
    return base;
  },
});

// Update a base
export const update = mutation({
  args: {
    id: v.id("bases"),
    name: v.optional(v.string()),
    capacity: v.optional(v.number()),
    ...location,
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args);
    return await ctx.db.get(args.id);
  },
});

// Delete a base
export const remove = mutation({
  args: {
    id: v.id("bases"),
  },
  returns: v.object({
    success: v.boolean(),
    id: v.id("bases"),
  }),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true, id: args.id };
  },
});

