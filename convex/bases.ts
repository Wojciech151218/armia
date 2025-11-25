import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new base
export const create = mutation({
  args: {
    name: v.string(),
    capacity: v.optional(v.number()),
    locationId: v.optional(v.id("locations")),
  },
  handler: async (ctx, args) => {
    try {
      if (!args.name || args.name.trim().length === 0) {
        throw new Error("Name is required");
      }

      if (args.locationId) {
        const location = await ctx.db.get(args.locationId);
        if (!location) {
          throw new Error("Location not found");
        }
      }

      const baseId = await ctx.db.insert("bases", {
        name: args.name.trim(),
        capacity: args.capacity,
        locationId: args.locationId,
      });

      return baseId;
    } catch (error) {
      throw new Error(`Failed to create base: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read all bases
export const list = query({
  handler: async (ctx) => {
    try {
      const bases = await ctx.db.query("bases").collect();
      return bases;
    } catch (error) {
      throw new Error(`Failed to fetch bases: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read all bases with their location documents
export const listWithLocation = query({
  handler: async (ctx) => {
    try {
      const bases = await ctx.db.query("bases").collect();
      const locationIds = bases
        .map((base) => base.locationId)
        .filter((locationId): locationId is Id<"locations"> => Boolean(locationId));

      const uniqueLocationIds = [...new Set(locationIds)];
      const locationDocs = await Promise.all(uniqueLocationIds.map((locationId) => ctx.db.get(locationId)));
      const locationMap = new Map(uniqueLocationIds.map((locationId, index) => [locationId, locationDocs[index]]));

      return bases.map((base) => ({
        ...base,
        location: base.locationId ? locationMap.get(base.locationId) ?? null : null,
      }));
    } catch (error) {
      throw new Error(
        `Failed to fetch bases with locations: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
});

// Read a single base by ID
export const get = query({
  args: {
    id: v.id("bases"),
  },
  handler: async (ctx, args) => {
    try {
      const base = await ctx.db.get(args.id);
      if (!base) {
        throw new Error("Base not found");
      }
      return base;
    } catch (error) {
      throw new Error(`Failed to fetch base: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read a single base including its location details
export const getWithLocation = query({
  args: {
    id: v.id("bases"),
  },
  handler: async (ctx, args) => {
    try {
      const base = await ctx.db.get(args.id);
      if (!base) {
        throw new Error("Base not found");
      }

      const location = base.locationId ? await ctx.db.get(base.locationId) : null;

      return {
        ...base,
        location,
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch base with location: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
});

// Update a base
export const update = mutation({
  args: {
    id: v.id("bases"),
    name: v.optional(v.string()),
    capacity: v.optional(v.number()),
    locationId: v.optional(v.id("locations")),
  },
  handler: async (ctx, args) => {
    try {
      const base = await ctx.db.get(args.id);
      if (!base) {
        throw new Error("Base not found");
      }

      const updates: {
        name?: string;
        capacity?: number;
        locationId?: Id<"locations">;
      } = {};

      if (args.name !== undefined) {
        if (args.name.trim().length === 0) {
          throw new Error("Name cannot be empty");
        }
        updates.name = args.name.trim();
      }
      if (args.capacity !== undefined) {
        updates.capacity = args.capacity;
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
      throw new Error(`Failed to update base: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Delete a base
export const remove = mutation({
  args: {
    id: v.id("bases"),
  },
  handler: async (ctx, args) => {
    try {
      const base = await ctx.db.get(args.id);
      if (!base) {
        throw new Error("Base not found");
      }

      await ctx.db.delete(args.id);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete base: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

