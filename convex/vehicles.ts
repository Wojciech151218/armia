import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new vehicle
export const create = mutation({
  args: {
    type: v.string(),
    status: v.string(),
    unitId: v.optional(v.id("units")),
    locationId: v.optional(v.id("locations")),
  },
  handler: async (ctx, args) => {
    try {
      if (!args.type || args.type.trim().length === 0) {
        throw new Error("Type is required");
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

      const vehicleId = await ctx.db.insert("vehicles", {
        type: args.type.trim(),
        status: args.status.trim(),
        unitId: args.unitId,
        locationId: args.locationId,
      });

      return vehicleId;
    } catch (error) {
      throw new Error(`Failed to create vehicle: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read all vehicles
export const list = query({
  handler: async (ctx) => {
    try {
      const vehicles = await ctx.db.query("vehicles").collect();
      return vehicles;
    } catch (error) {
      throw new Error(`Failed to fetch vehicles: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read all vehicles with their location documents
export const listWithLocation = query({
  handler: async (ctx) => {
    try {
      const vehicles = await ctx.db.query("vehicles").collect();
      const locationIds = vehicles
        .map((vehicle) => vehicle.locationId)
        .filter((locationId): locationId is Id<"locations"> => Boolean(locationId));

      const uniqueLocationIds = [...new Set(locationIds)];
      const locationDocs = await Promise.all(uniqueLocationIds.map((locationId) => ctx.db.get(locationId)));
      const locationMap = new Map(uniqueLocationIds.map((locationId, index) => [locationId, locationDocs[index]]));

      return vehicles.map((vehicle) => ({
        ...vehicle,
        location: vehicle.locationId ? locationMap.get(vehicle.locationId) ?? null : null,
      }));
    } catch (error) {
      throw new Error(
        `Failed to fetch vehicles with locations: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
});

// Read a single vehicle by ID
export const get = query({
  args: {
    id: v.id("vehicles"),
  },
  handler: async (ctx, args) => {
    try {
      const vehicle = await ctx.db.get(args.id);
      if (!vehicle) {
        throw new Error("Vehicle not found");
      }
      return vehicle;
    } catch (error) {
      throw new Error(`Failed to fetch vehicle: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read a single vehicle including its location details
export const getWithLocation = query({
  args: {
    id: v.id("vehicles"),
  },
  handler: async (ctx, args) => {
    try {
      const vehicle = await ctx.db.get(args.id);
      if (!vehicle) {
        throw new Error("Vehicle not found");
      }

      const location = vehicle.locationId ? await ctx.db.get(vehicle.locationId) : null;

      return {
        ...vehicle,
        location,
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch vehicle with location: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
});

// Update a vehicle
export const update = mutation({
  args: {
    id: v.id("vehicles"),
    type: v.optional(v.string()),
    status: v.optional(v.string()),
    unitId: v.optional(v.id("units")),
    locationId: v.optional(v.id("locations")),
  },
  handler: async (ctx, args) => {
    try {
      const vehicle = await ctx.db.get(args.id);
      if (!vehicle) {
        throw new Error("Vehicle not found");
      }

      const updates: {
        type?: string;
        status?: string;
        unitId?: Id<"units">;
        locationId?: Id<"locations">;
      } = {};

      if (args.type !== undefined) {
        if (args.type.trim().length === 0) {
          throw new Error("Type cannot be empty");
        }
        updates.type = args.type.trim();
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
      throw new Error(`Failed to update vehicle: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Delete a vehicle
export const remove = mutation({
  args: {
    id: v.id("vehicles"),
  },
  handler: async (ctx, args) => {
    try {
      const vehicle = await ctx.db.get(args.id);
      if (!vehicle) {
        throw new Error("Vehicle not found");
      }

      await ctx.db.delete(args.id);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete vehicle: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

