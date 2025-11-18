import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new soldier
export const create = mutation({
  args: {
    name: v.string(),
    rank: v.string(),
    unit: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("reserve")),
  },
  handler: async (ctx, args) => {
    try {
      // Validate input
      if (!args.name || args.name.trim().length === 0) {
        throw new Error("Name is required");
      }
      if (!args.rank || args.rank.trim().length === 0) {
        throw new Error("Rank is required");
      }
      if (!args.unit || args.unit.trim().length === 0) {
        throw new Error("Unit is required");
      }

      const soldierId = await ctx.db.insert("soldiers", {
        name: args.name.trim(),
        rank: args.rank.trim(),
        unit: args.unit.trim(),
        status: args.status,
      });

      return soldierId;
    } catch (error) {
      throw new Error(`Failed to create soldier: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read all soldiers
export const list = query({
  handler: async (ctx) => {
    try {
      const soldiers = await ctx.db.query("soldiers").collect();
      return soldiers;
    } catch (error) {
      throw new Error(`Failed to fetch soldiers: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read a single soldier by ID
export const get = query({
  args: {
    id: v.id("soldiers"),
  },
  handler: async (ctx, args) => {
    try {
      const soldier = await ctx.db.get(args.id);
      if (!soldier) {
        throw new Error("Soldier not found");
      }
      return soldier;
    } catch (error) {
      throw new Error(`Failed to fetch soldier: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Update a soldier
export const update = mutation({
  args: {
    id: v.id("soldiers"),
    name: v.optional(v.string()),
    rank: v.optional(v.string()),
    unit: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"), v.literal("reserve"))),
  },
  handler: async (ctx, args) => {
    try {
      const soldier = await ctx.db.get(args.id);
      if (!soldier) {
        throw new Error("Soldier not found");
      }

      const updates: {
        name?: string;
        rank?: string;
        unit?: string;
        status?: "active" | "inactive" | "reserve";
      } = {};

      if (args.name !== undefined) {
        if (args.name.trim().length === 0) {
          throw new Error("Name cannot be empty");
        }
        updates.name = args.name.trim();
      }
      if (args.rank !== undefined) {
        if (args.rank.trim().length === 0) {
          throw new Error("Rank cannot be empty");
        }
        updates.rank = args.rank.trim();
      }
      if (args.unit !== undefined) {
        if (args.unit.trim().length === 0) {
          throw new Error("Unit cannot be empty");
        }
        updates.unit = args.unit.trim();
      }
      if (args.status !== undefined) {
        updates.status = args.status;
      }

      await ctx.db.patch(args.id, updates);
      return await ctx.db.get(args.id);
    } catch (error) {
      throw new Error(`Failed to update soldier: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Delete a soldier
export const remove = mutation({
  args: {
    id: v.id("soldiers"),
  },
  handler: async (ctx, args) => {
    try {
      const soldier = await ctx.db.get(args.id);
      if (!soldier) {
        throw new Error("Soldier not found");
      }

      await ctx.db.delete(args.id);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete soldier: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

