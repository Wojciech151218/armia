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
    try {
      if (!args.type || args.type.trim().length === 0) {
        throw new Error("Type is required");
      }
      if (args.quantity < 0) {
        throw new Error("Quantity must be non-negative");
      }
      if (!args.status || args.status.trim().length === 0) {
        throw new Error("Status is required");
      }

      if (args.unitId) {
        const unit = await ctx.db.get(args.unitId);
        if (!unit) {
          throw new Error("Unit not found");
        }
      }

      if (args.soldierId) {
        const soldier = await ctx.db.get(args.soldierId);
        if (!soldier) {
          throw new Error("Soldier not found");
        }
      }

      const armamentId = await ctx.db.insert("armaments", {
        type: args.type.trim(),
        quantity: args.quantity,
        status: args.status.trim(),
        unitId: args.unitId,
        soldierId: args.soldierId,
      });

      return armamentId;
    } catch (error) {
      throw new Error(`Failed to create armament: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read all armaments
export const list = query({
  handler: async (ctx) => {
    try {
      const armaments = await ctx.db.query("armaments").collect();
      return armaments;
    } catch (error) {
      throw new Error(`Failed to fetch armaments: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read a single armament by ID
export const get = query({
  args: {
    id: v.id("armaments"),
  },
  handler: async (ctx, args) => {
    try {
      const armament = await ctx.db.get(args.id);
      if (!armament) {
        throw new Error("Armament not found");
      }
      return armament;
    } catch (error) {
      throw new Error(`Failed to fetch armament: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
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
    try {
      const armament = await ctx.db.get(args.id);
      if (!armament) {
        throw new Error("Armament not found");
      }

      const updates: {
        type?: string;
        quantity?: number;
        status?: string;
        unitId?: Id<"units">;
        soldierId?: Id<"soldiers">;
      } = {};

      if (args.type !== undefined) {
        if (args.type.trim().length === 0) {
          throw new Error("Type cannot be empty");
        }
        updates.type = args.type.trim();
      }
      if (args.quantity !== undefined) {
        if (args.quantity < 0) {
          throw new Error("Quantity must be non-negative");
        }
        updates.quantity = args.quantity;
      }
      if (args.status !== undefined) {
        if (args.status.trim().length === 0) {
          throw new Error("Status cannot be empty");
        }
        updates.status = args.status.trim();
      }
      if (args.unitId !== undefined) {
        if (args.unitId) {
          const unit = await ctx.db.get(args.unitId);
          if (!unit) {
            throw new Error("Unit not found");
          }
        }
        updates.unitId = args.unitId;
      }
      if (args.soldierId !== undefined) {
        if (args.soldierId) {
          const soldier = await ctx.db.get(args.soldierId);
          if (!soldier) {
            throw new Error("Soldier not found");
          }
        }
        updates.soldierId = args.soldierId;
      }

      await ctx.db.patch(args.id, updates);
      return await ctx.db.get(args.id);
    } catch (error) {
      throw new Error(`Failed to update armament: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Delete an armament
export const remove = mutation({
  args: {
    id: v.id("armaments"),
  },
  handler: async (ctx, args) => {
    try {
      const armament = await ctx.db.get(args.id);
      if (!armament) {
        throw new Error("Armament not found");
      }

      await ctx.db.delete(args.id);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete armament: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

