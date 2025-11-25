import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new location
export const create = mutation({
  args: {
    latitude: v.number(),
    longitude: v.number(),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      if (!args.latitude || !args.longitude) {
        throw new Error("Latitude and longitude are required");
      }

      const locationId = await ctx.db.insert("locations", {
        latitude: args.latitude,
        longitude: args.longitude,
        name: args.name?.trim(),
        type: args.type?.trim(),
      });

      return locationId;
    } catch (error) {
      throw new Error(`Failed to create location: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read all locations
export const list = query({
  handler: async (ctx) => {
    try {
      const locations = await ctx.db.query("locations").collect();
      return locations;
    } catch (error) {
      throw new Error(`Failed to fetch locations: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read a single location by ID
export const get = query({
  args: {
    id: v.id("locations"),
  },
  handler: async (ctx, args) => {
    try {
      const location = await ctx.db.get(args.id);
      if (!location) {
        throw new Error("Location not found");
      }
      return location;
    } catch (error) {
      throw new Error(`Failed to fetch location: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Update a location
export const update = mutation({
  args: {
    id: v.id("locations"),
    coordinates: v.optional(v.string()),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const location = await ctx.db.get(args.id);
      if (!location) {
        throw new Error("Location not found");
      }

      const updates: {
        coordinates?: string;
        name?: string;
        type?: string;
      } = {};

      if (args.coordinates !== undefined) {
        if (args.coordinates.trim().length === 0) {
          throw new Error("Coordinates cannot be empty");
        }
        updates.coordinates = args.coordinates.trim();
      }
      if (args.name !== undefined) {
        updates.name = args.name.trim() || undefined;
      }
      if (args.type !== undefined) {
        updates.type = args.type.trim() || undefined;
      }

      await ctx.db.patch(args.id, updates);
      return await ctx.db.get(args.id);
    } catch (error) {
      throw new Error(`Failed to update location: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Delete a location
export const remove = mutation({
  args: {
    id: v.id("locations"),
  },
  handler: async (ctx, args) => {
    try {
      const location = await ctx.db.get(args.id);
      if (!location) {
        throw new Error("Location not found");
      }

      await ctx.db.delete(args.id);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete location: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

