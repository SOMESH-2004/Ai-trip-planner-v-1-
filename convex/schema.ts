import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
  }).index("by_email", ["email"]),
  trips: defineTable({
    userEmail: v.string(),
    tripData: v.any(), // Flexible for the AI generated JSON
    createdAt: v.number(),
  }).index("by_user", ["userEmail"]),
});
