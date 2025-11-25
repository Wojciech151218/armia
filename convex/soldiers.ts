import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { location } from "./schema";

// Create a new soldier
export const create = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    rank: v.optional(v.string()),
    unitId: v.optional(v.id("units")),
    ...location,
  },
  
  handler: async (ctx, args) => {
    const id =  await ctx.db.insert("soldiers", args);
    return await ctx.db.get(id);
  },
});

// Read all soldiers
export const list = query({
  handler: async (ctx) => {
    const soldiers = await ctx.db.query("soldiers").collect();
    return soldiers;
  },
});

// Read a single soldier by ID
export const get = query({
  args: {
    id: v.id("soldiers"),
  },
  handler: async (ctx, args) => {
    const soldier = await ctx.db.get(args.id);
    return soldier;
  },
});

// Update a soldier
export const update = mutation({
  args: {
    id: v.id("soldiers"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    rank: v.optional(v.string()),
    unitId: v.optional(v.id("units")),
    ...location
  },
  handler: async (ctx, args) => {
    
    await ctx.db.patch(args.id, args);
    return await ctx.db.get(args.id);
    
  },
});

// Delete a soldier
export const remove = mutation({
  args: {
    id: v.id("soldiers"),
  },
  returns: v.object({
    success: v.boolean(),
    id: v.id("soldiers"),
  }),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true , id: args.id};
  },
});

