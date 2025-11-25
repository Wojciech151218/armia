import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new delivery
export const create = mutation({
  args: {
    type: v.string(),
    quantity: v.number(),
    status: v.string(),
    senderLocationId: v.optional(v.id("locations")),
    receiverLocationId: v.optional(v.id("locations")),
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

      if (args.senderLocationId) {
        const location = await ctx.db.get(args.senderLocationId);
        if (!location) {
          throw new Error("Sender location not found");
        }
      }

      if (args.receiverLocationId) {
        const location = await ctx.db.get(args.receiverLocationId);
        if (!location) {
          throw new Error("Receiver location not found");
        }
      }

      const deliveryId = await ctx.db.insert("deliveries", {
        type: args.type.trim(),
        quantity: args.quantity,
        status: args.status.trim(),
        senderLocationId: args.senderLocationId,
        receiverLocationId: args.receiverLocationId,
      });

      return deliveryId;
    } catch (error) {
      throw new Error(`Failed to create delivery: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read all deliveries
export const list = query({
  handler: async (ctx) => {
    try {
      const deliveries = await ctx.db.query("deliveries").collect();
      return deliveries;
    } catch (error) {
      throw new Error(`Failed to fetch deliveries: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read all deliveries with their sender and receiver location documents
export const listWithLocation = query({
  handler: async (ctx) => {
    try {
      const deliveries = await ctx.db.query("deliveries").collect();

      const locationIds = [
        ...deliveries
          .map((delivery) => delivery.senderLocationId)
          .filter((locationId): locationId is Id<"locations"> => Boolean(locationId)),
        ...deliveries
          .map((delivery) => delivery.receiverLocationId)
          .filter((locationId): locationId is Id<"locations"> => Boolean(locationId)),
      ];

      const uniqueLocationIds = [...new Set(locationIds)];
      const locationDocs = await Promise.all(uniqueLocationIds.map((locationId) => ctx.db.get(locationId)));
      const locationMap = new Map(uniqueLocationIds.map((locationId, index) => [locationId, locationDocs[index]]));

      return deliveries.map((delivery) => ({
        ...delivery,
        senderLocation: delivery.senderLocationId ? locationMap.get(delivery.senderLocationId) ?? null : null,
        receiverLocation: delivery.receiverLocationId ? locationMap.get(delivery.receiverLocationId) ?? null : null,
      }));
    } catch (error) {
      throw new Error(
        `Failed to fetch deliveries with locations: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
});

// Read a single delivery by ID
export const get = query({
  args: {
    id: v.id("deliveries"),
  },
  handler: async (ctx, args) => {
    try {
      const delivery = await ctx.db.get(args.id);
      if (!delivery) {
        throw new Error("Delivery not found");
      }
      return delivery;
    } catch (error) {
      throw new Error(`Failed to fetch delivery: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Read a delivery including its sender and receiver locations
export const getWithLocation = query({
  args: {
    id: v.id("deliveries"),
  },
  handler: async (ctx, args) => {
    try {
      const delivery = await ctx.db.get(args.id);
      if (!delivery) {
        throw new Error("Delivery not found");
      }

      const senderLocation = delivery.senderLocationId ? await ctx.db.get(delivery.senderLocationId) : null;
      const receiverLocation = delivery.receiverLocationId ? await ctx.db.get(delivery.receiverLocationId) : null;

      return {
        ...delivery,
        senderLocation,
        receiverLocation,
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch delivery with locations: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
});

// Update a delivery
export const update = mutation({
  args: {
    id: v.id("deliveries"),
    type: v.optional(v.string()),
    quantity: v.optional(v.number()),
    status: v.optional(v.string()),
    senderLocationId: v.optional(v.id("locations")),
    receiverLocationId: v.optional(v.id("locations")),
  },
  handler: async (ctx, args) => {
    try {
      const delivery = await ctx.db.get(args.id);
      if (!delivery) {
        throw new Error("Delivery not found");
      }

      const updates: {
        type?: string;
        quantity?: number;
        status?: string;
        senderLocationId?: Id<"locations">;
        receiverLocationId?: Id<"locations">;
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
      if (args.senderLocationId !== undefined) {
        if (args.senderLocationId) {
          const location = await ctx.db.get(args.senderLocationId);
          if (!location) {
            throw new Error("Sender location not found");
          }
        }
        updates.senderLocationId = args.senderLocationId;
      }
      if (args.receiverLocationId !== undefined) {
        if (args.receiverLocationId) {
          const location = await ctx.db.get(args.receiverLocationId);
          if (!location) {
            throw new Error("Receiver location not found");
          }
        }
        updates.receiverLocationId = args.receiverLocationId;
      }

      await ctx.db.patch(args.id, updates);
      return await ctx.db.get(args.id);
    } catch (error) {
      throw new Error(`Failed to update delivery: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Delete a delivery
export const remove = mutation({
  args: {
    id: v.id("deliveries"),
  },
  handler: async (ctx, args) => {
    try {
      const delivery = await ctx.db.get(args.id);
      if (!delivery) {
        throw new Error("Delivery not found");
      }

      await ctx.db.delete(args.id);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete delivery: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

