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
    try {
      if (!args.name || args.name.trim().length === 0) {
        throw new Error("Name is required");
      }
      if (!args.status || args.status.trim().length === 0) {
        throw new Error("Status is required");
      }

      if (args.commanderId) {
        const commander = await ctx.db.get(args.commanderId);
        if (!commander) {
          throw new Error("Commander (soldier) not found");
        }
      }

      if (args.baseId) {
        const base = await ctx.db.get(args.baseId);
        if (!base) {
          throw new Error("Base not found");
        }
      }

      const unitId = await ctx.db.insert("units", {
        name: args.name.trim(),
        size: args.size,
        status: args.status.trim(),
        commanderId: args.commanderId,
        baseId: args.baseId,
      });

      return unitId;
    } catch (error) {
      throw new Error(`Failed to create unit: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read all units
export const list = query({
  handler: async (ctx) => {
    try {
      const units = await ctx.db.query("units").collect();
      return units;
    } catch (error) {
      throw new Error(`Failed to fetch units: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read a single unit by ID
export const get = query({
  args: {
    id: v.id("units"),
  },
  handler: async (ctx, args) => {
    try {
      const unit = await ctx.db.get(args.id);
      if (!unit) {
        throw new Error("Unit not found");
      }
      return unit;
    } catch (error) {
      throw new Error(`Failed to fetch unit: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
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
    try {
      const unit = await ctx.db.get(args.id);
      if (!unit) {
        throw new Error("Unit not found");
      }

      const updates: {
        name?: string;
        size?: number;
        status?: string;
        commanderId?: Id<"soldiers">;
        baseId?: Id<"bases">;
      } = {};

      if (args.name !== undefined) {
        if (args.name.trim().length === 0) {
          throw new Error("Name cannot be empty");
        }
        updates.name = args.name.trim();
      }
      if (args.size !== undefined) {
        updates.size = args.size;
      }
      if (args.status !== undefined) {
        if (args.status.trim().length === 0) {
          throw new Error("Status cannot be empty");
        }
        updates.status = args.status.trim();
      }
      if (args.commanderId !== undefined) {
        if (args.commanderId) {
          const commander = await ctx.db.get(args.commanderId);
          if (!commander) {
            throw new Error("Commander (soldier) not found");
          }
        }
        updates.commanderId = args.commanderId;
      }
      if (args.baseId !== undefined) {
        if (args.baseId) {
          const base = await ctx.db.get(args.baseId);
          if (!base) {
            throw new Error("Base not found");
          }
        }
        updates.baseId = args.baseId;
      }

      await ctx.db.patch(args.id, updates);
      return await ctx.db.get(args.id);
    } catch (error) {
      throw new Error(`Failed to update unit: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Delete a unit
export const remove = mutation({
  args: {
    id: v.id("units"),
  },
  handler: async (ctx, args) => {
    try {
      const unit = await ctx.db.get(args.id);
      if (!unit) {
        throw new Error("Unit not found");
      }

      await ctx.db.delete(args.id);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete unit: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

