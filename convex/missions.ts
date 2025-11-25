import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new mission
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    start: v.string(),
    end: v.optional(v.string()),
    status: v.string(),
    unitId: v.optional(v.id("units")),
    locationId: v.optional(v.id("locations")),
  },
  handler: async (ctx, args) => {
    try {
      if (!args.name || args.name.trim().length === 0) {
        throw new Error("Name is required");
      }
      if (!args.start || args.start.trim().length === 0) {
        throw new Error("Start date is required");
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

      if (args.locationId) {
        const location = await ctx.db.get(args.locationId);
        if (!location) {
          throw new Error("Location not found");
        }
      }

      const missionId = await ctx.db.insert("missions", {
        name: args.name.trim(),
        description: args.description?.trim(),
        start: args.start.trim(),
        end: args.end?.trim(),
        status: args.status.trim(),
        unitId: args.unitId,
        locationId: args.locationId,
      });

      return missionId;
    } catch (error) {
      throw new Error(`Failed to create mission: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read all missions
export const list = query({
  handler: async (ctx) => {
    try {
      const missions = await ctx.db.query("missions").collect();
      return missions;
    } catch (error) {
      throw new Error(`Failed to fetch missions: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read all missions with their location documents
export const listWithLocation = query({
  handler: async (ctx) => {
    try {
      const missions = await ctx.db.query("missions").collect();
      const locationIds = missions
        .map((mission) => mission.locationId)
        .filter((locationId): locationId is Id<"locations"> => Boolean(locationId));

      const uniqueLocationIds = [...new Set(locationIds)];
      const locationDocs = await Promise.all(uniqueLocationIds.map((locationId) => ctx.db.get(locationId)));
      const locationMap = new Map(uniqueLocationIds.map((locationId, index) => [locationId, locationDocs[index]]));

      return missions.map((mission) => ({
        ...mission,
        location: mission.locationId ? locationMap.get(mission.locationId) ?? null : null,
      }));
    } catch (error) {
      throw new Error(
        `Failed to fetch missions with locations: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
});

// Read a single mission by ID
export const get = query({
  args: {
    id: v.id("missions"),
  },
  handler: async (ctx, args) => {
    try {
      const mission = await ctx.db.get(args.id);
      if (!mission) {
        throw new Error("Mission not found");
      }
      return mission;
    } catch (error) {
      throw new Error(`Failed to fetch mission: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read a mission with its location populated
export const getWithLocation = query({
  args: {
    id: v.id("missions"),
  },
  handler: async (ctx, args) => {
    try {
      const mission = await ctx.db.get(args.id);
      if (!mission) {
        throw new Error("Mission not found");
      }

      const location = mission.locationId ? await ctx.db.get(mission.locationId) : null;

      return {
        ...mission,
        location,
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch mission with location: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
});

// Update a mission
export const update = mutation({
  args: {
    id: v.id("missions"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    start: v.optional(v.string()),
    end: v.optional(v.string()),
    status: v.optional(v.string()),
    unitId: v.optional(v.id("units")),
    locationId: v.optional(v.id("locations")),
  },
  handler: async (ctx, args) => {
    try {
      const mission = await ctx.db.get(args.id);
      if (!mission) {
        throw new Error("Mission not found");
      }

      const updates: {
        name?: string;
        description?: string;
        start?: string;
        end?: string;
        status?: string;
        unitId?: Id<"units">;
        locationId?: Id<"locations">;
      } = {};

      if (args.name !== undefined) {
        if (args.name.trim().length === 0) {
          throw new Error("Name cannot be empty");
        }
        updates.name = args.name.trim();
      }
      if (args.description !== undefined) {
        updates.description = args.description.trim() || undefined;
      }
      if (args.start !== undefined) {
        if (args.start.trim().length === 0) {
          throw new Error("Start date cannot be empty");
        }
        updates.start = args.start.trim();
      }
      if (args.end !== undefined) {
        updates.end = args.end.trim() || undefined;
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
      throw new Error(`Failed to update mission: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Delete a mission
export const remove = mutation({
  args: {
    id: v.id("missions"),
  },
  handler: async (ctx, args) => {
    try {
      const mission = await ctx.db.get(args.id);
      if (!mission) {
        throw new Error("Mission not found");
      }

      await ctx.db.delete(args.id);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete mission: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

