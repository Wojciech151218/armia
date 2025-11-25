import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new soldier
export const create = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    rank: v.optional(v.string()),
    unitId: v.optional(v.id("units")),
    locationId: v.optional(v.id("locations")),
  },
  handler: async (ctx, args) => {
    try {
      // Validate input
      if (!args.firstName || args.firstName.trim().length === 0) {
        throw new Error("First name is required");
      }
      if (!args.lastName || args.lastName.trim().length === 0) {
        throw new Error("Last name is required");
      }

      // Validate unit exists if provided
      if (args.unitId) {
        const unit = await ctx.db.get(args.unitId);
        if (!unit) {
          throw new Error("Unit not found");
        }
      }

      // Validate location exists if provided
      if (args.locationId) {
        const location = await ctx.db.get(args.locationId);
        if (!location) {
          throw new Error("Location not found");
        }
      }

      const soldierId = await ctx.db.insert("soldiers", {
        firstName: args.firstName.trim(),
        lastName: args.lastName.trim(),
        rank: args.rank?.trim(),
        unitId: args.unitId,
        locationId: args.locationId,
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
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    rank: v.optional(v.string()),
    unitId: v.optional(v.id("units")),
    locationId: v.optional(v.id("locations")),
  },
  handler: async (ctx, args) => {
    try {
      const soldier = await ctx.db.get(args.id);
      if (!soldier) {
        throw new Error("Soldier not found");
      }

      const updates: {
        firstName?: string;
        lastName?: string;
        rank?: string;
        unitId?: Id<"units">;
        locationId?: Id<"locations">;
      } = {};

      if (args.firstName !== undefined) {
        if (args.firstName.trim().length === 0) {
          throw new Error("First name cannot be empty");
        }
        updates.firstName = args.firstName.trim();
      }
      if (args.lastName !== undefined) {
        if (args.lastName.trim().length === 0) {
          throw new Error("Last name cannot be empty");
        }
        updates.lastName = args.lastName.trim();
      }
      if (args.rank !== undefined) {
        updates.rank = args.rank.trim() || undefined;
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
      if (args.locationId !== undefined) {
        if (args.locationId) {
          const location = await ctx.db.get(args.locationId);
          if (!location) {
            throw new Error("Location not found");
          }
        }
        updates.locationId = args.locationId;
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

