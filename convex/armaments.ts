import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Create a new armament
export const create = mutation({
  args: {
    type: v.string(),
    quantity: v.number(),
    status: v.string(),
    unitId: v.optional(v.id("units")),
    soldierId: v.optional(v.id("soldiers")),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("armaments", args);
    return await ctx.db.get(id);
  },
});

// Read all armaments
export const list = query({
  handler: async (ctx) => {
    const armaments = await ctx.db.query("armaments").collect();
    return armaments;
  },
});

// Read a single armament by ID
export const get = query({
  args: {
    id: v.id("armaments"),
  },
  handler: async (ctx, args) => {
    const armament = await ctx.db.get(args.id);
    return armament;
  },
});

// Update an armament
export const update = mutation({
  args: {
    id: v.id("armaments"),
    type: v.optional(v.string()),
    quantity: v.optional(v.number()),
    status: v.optional(v.string()),
    unitId: v.optional(v.id("units")),
    soldierId: v.optional(v.id("soldiers")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args);
    return await ctx.db.get(args.id);
  },
});

// Delete an armament
export const remove = mutation({
  args: {
    id: v.id("armaments"),
  },
  returns: v.object({
    success: v.boolean(),
    id: v.id("armaments"),
  }),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true, id: args.id };
  },
});

