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
    try {
      if (args.missionId) {
        const mission = await ctx.db.get(args.missionId);
        if (!mission) {
          throw new Error("Mission not found");
        }
      }

      const eventId = await ctx.db.insert("events", {
        type: args.type?.trim(),
        description: args.description?.trim(),
        time: args.time?.trim(),
        missionId: args.missionId,
      });

      return eventId;
    } catch (error) {
      throw new Error(`Failed to create event: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read all events
export const list = query({
  handler: async (ctx) => {
    try {
      const events = await ctx.db.query("events").collect();
      return events;
    } catch (error) {
      throw new Error(`Failed to fetch events: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read a single event by ID
export const get = query({
  args: {
    id: v.id("events"),
  },
  handler: async (ctx, args) => {
    try {
      const event = await ctx.db.get(args.id);
      if (!event) {
        throw new Error("Event not found");
      }
      return event;
    } catch (error) {
      throw new Error(`Failed to fetch event: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
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
    try {
      const event = await ctx.db.get(args.id);
      if (!event) {
        throw new Error("Event not found");
      }

      const updates: {
        type?: string;
        description?: string;
        time?: string;
        missionId?: Id<"missions">;
      } = {};

      if (args.type !== undefined) {
        updates.type = args.type.trim() || undefined;
      }
      if (args.description !== undefined) {
        updates.description = args.description.trim() || undefined;
      }
      if (args.time !== undefined) {
        updates.time = args.time.trim() || undefined;
      }
      if (args.missionId !== undefined) {
        if (args.missionId) {
          const mission = await ctx.db.get(args.missionId);
          if (!mission) {
            throw new Error("Mission not found");
          }
        }
        updates.missionId = args.missionId;
      }

      await ctx.db.patch(args.id, updates);
      return await ctx.db.get(args.id);
    } catch (error) {
      throw new Error(`Failed to update event: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Delete an event
export const remove = mutation({
  args: {
    id: v.id("events"),
  },
  handler: async (ctx, args) => {
    try {
      const event = await ctx.db.get(args.id);
      if (!event) {
        throw new Error("Event not found");
      }

      await ctx.db.delete(args.id);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete event: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

