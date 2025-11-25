import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { location } from "./schema";

// Create a new delivery
export const create = mutation({
  args: {
    type: v.string(),
    quantity: v.number(),
    status: v.string(),
    senderLocation: v.object(location),
    receiverLocation: v.object(location),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("deliveries", args);
    return await ctx.db.get(id);
  },
});

// Read all deliveries
export const list = query({
  handler: async (ctx) => {
    const deliveries = await ctx.db.query("deliveries").collect();
    return deliveries;
  },
});

// Read a single delivery by ID
export const get = query({
  args: {
    id: v.id("deliveries"),
  },
  handler: async (ctx, args) => {
    const delivery = await ctx.db.get(args.id);
    return delivery;
  },
});

// Update a delivery
export const update = mutation({
  args: {
    id: v.id("deliveries"),
    type: v.optional(v.string()),
    quantity: v.optional(v.number()),
    status: v.optional(v.string()),
    senderLocation: v.optional(v.object(location)),
    receiverLocation: v.optional(v.object(location)),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args);
    return await ctx.db.get(args.id);
  },
});

// Delete a delivery
export const remove = mutation({
  args: {
    id: v.id("deliveries"),
  },
  returns: v.object({
    success: v.boolean(),
    id: v.id("deliveries"),
  }),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true, id: args.id };
  },
});

