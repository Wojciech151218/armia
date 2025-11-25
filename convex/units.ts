import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new unit
export const create = mutation({
  args: {
    name: v.string(),
    size: v.optional(v.number()),
    status: v.string(),
    commanderId: v.optional(v.id("soldiers")),
    baseId: v.optional(v.id("bases")),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("units", args);
    return await ctx.db.get(id);
  },
});

// Read all units
export const list = query({
  handler: async (ctx) => {
    const units = await ctx.db.query("units").collect();
    return units;
  },
});

// Read a single unit by ID
export const get = query({
  args: {
    id: v.id("units"),
  },
  handler: async (ctx, args) => {
    const unit = await ctx.db.get(args.id);
    return unit;
  },
});

// Update a unit
export const update = mutation({
  args: {
    id: v.id("units"),
    name: v.optional(v.string()),
    size: v.optional(v.number()),
    status: v.optional(v.string()),
    commanderId: v.optional(v.id("soldiers")),
    baseId: v.optional(v.id("bases")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args);
    return await ctx.db.get(args.id);
  },
});

// Delete a unit
export const remove = mutation({
  args: {
    id: v.id("units"),
  },
  returns: v.object({
    success: v.boolean(),
    id: v.id("units"),
  }),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true, id: args.id };
  },
});

