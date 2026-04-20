import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveTrip = mutation({
  args: {
    userEmail: v.string(),
    tripData: v.any(),
  },
  handler: async (ctx, args) => {
    const tripId = await ctx.db.insert("trips", {
      userEmail: args.userEmail,
      tripData: args.tripData,
      createdAt: Date.now(),
    });
    return tripId;
  },
});

export const getUserTrips = query({
  args: { userEmail: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("trips")
      .withIndex("by_user", (q) => q.eq("userEmail", args.userEmail))
      .order("desc")
      .collect();
  },
});
