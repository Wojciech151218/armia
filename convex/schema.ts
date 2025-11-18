import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  soldiers: defineTable({
    name: v.string(),
    rank: v.string(),
    unit: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("reserve")),
  }),
});

