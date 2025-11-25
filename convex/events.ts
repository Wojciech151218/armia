import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new event
export const create = mutation({
  args: {
    type: v.optional(v.string()),
    description: v.optional(v.string()),
    time: v.optional(v.string()),
    missionId: v.optional(v.id("missions")),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("events", args);
    return await ctx.db.get(id);
  },
});

// Read all events
export const list = query({
  handler: async (ctx) => {
    const events = await ctx.db.query("events").collect();
    return events;
  },
});

// Read a single event by ID
export const get = query({
  args: {
    id: v.id("events"),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.id);
    return event;
  },
});

// Update an event
export const update = mutation({
  args: {
    id: v.id("events"),
    type: v.optional(v.string()),
    description: v.optional(v.string()),
    time: v.optional(v.string()),
    missionId: v.optional(v.id("missions")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args);
    return await ctx.db.get(args.id);
  },
});

// Delete an event
export const remove = mutation({
  args: {
    id: v.id("events"),
  },
  returns: v.object({
    success: v.boolean(),
    id: v.id("events"),
  }),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true, id: args.id };
  },
});

