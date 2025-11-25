import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new enemy
export const create = mutation({
  args: {
    type: v.optional(v.string()),
    estimatedStrength: v.optional(v.number()),
    threatLevel: v.optional(v.string()),
    locationId: v.optional(v.id("locations")),
  },
  handler: async (ctx, args) => {
    try {
      if (args.locationId) {
        const location = await ctx.db.get(args.locationId);
        if (!location) {
          throw new Error("Location not found");
        }
      }

      const enemyId = await ctx.db.insert("enemies", {
        type: args.type?.trim(),
        estimatedStrength: args.estimatedStrength,
        threatLevel: args.threatLevel?.trim(),
        locationId: args.locationId,
      });

      return enemyId;
    } catch (error) {
      throw new Error(`Failed to create enemy: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read all enemies
export const list = query({
  handler: async (ctx) => {
    try {
      const enemies = await ctx.db.query("enemies").collect();
      return enemies;
    } catch (error) {
      throw new Error(`Failed to fetch enemies: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read all enemies with their location documents
export const listWithLocation = query({
  handler: async (ctx) => {
    try {
      const enemies = await ctx.db.query("enemies").collect();
      const locationIds = enemies
        .map((enemy) => enemy.locationId)
        .filter((locationId): locationId is Id<"locations"> => Boolean(locationId));

      const uniqueLocationIds = [...new Set(locationIds)];
      const locationDocs = await Promise.all(uniqueLocationIds.map((locationId) => ctx.db.get(locationId)));
      const locationMap = new Map(uniqueLocationIds.map((locationId, index) => [locationId, locationDocs[index]]));

      return enemies.map((enemy) => ({
        ...enemy,
        location: enemy.locationId ? locationMap.get(enemy.locationId) ?? null : null,
      }));
    } catch (error) {
      throw new Error(
        `Failed to fetch enemies with locations: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
});

// Read a single enemy by ID
export const get = query({
  args: {
    id: v.id("enemies"),
  },
  handler: async (ctx, args) => {
    try {
      const enemy = await ctx.db.get(args.id);
      if (!enemy) {
        throw new Error("Enemy not found");
      }
      return enemy;
    } catch (error) {
      throw new Error(`Failed to fetch enemy: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read an enemy with its location populated
export const getWithLocation = query({
  args: {
    id: v.id("enemies"),
  },
  handler: async (ctx, args) => {
    try {
      const enemy = await ctx.db.get(args.id);
      if (!enemy) {
        throw new Error("Enemy not found");
      }

      const location = enemy.locationId ? await ctx.db.get(enemy.locationId) : null;

      return {
        ...enemy,
        location,
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch enemy with location: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
});

// Update an enemy
export const update = mutation({
  args: {
    id: v.id("enemies"),
    type: v.optional(v.string()),
    estimatedStrength: v.optional(v.number()),
    threatLevel: v.optional(v.string()),
    locationId: v.optional(v.id("locations")),
  },
  handler: async (ctx, args) => {
    try {
      const enemy = await ctx.db.get(args.id);
      if (!enemy) {
        throw new Error("Enemy not found");
      }

      const updates: {
        type?: string;
        estimatedStrength?: number;
        threatLevel?: string;
        locationId?: Id<"locations">;
      } = {};

      if (args.type !== undefined) {
        updates.type = args.type.trim() || undefined;
      }
      if (args.estimatedStrength !== undefined) {
        updates.estimatedStrength = args.estimatedStrength;
      }
      if (args.threatLevel !== undefined) {
        updates.threatLevel = args.threatLevel.trim() || undefined;
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
      throw new Error(`Failed to update enemy: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Delete an enemy
export const remove = mutation({
  args: {
    id: v.id("enemies"),
  },
  handler: async (ctx, args) => {
    try {
      const enemy = await ctx.db.get(args.id);
      if (!enemy) {
        throw new Error("Enemy not found");
      }

      await ctx.db.delete(args.id);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete enemy: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

