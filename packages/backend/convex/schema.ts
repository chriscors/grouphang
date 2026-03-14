import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	airbnbs: defineTable({
		name: v.string(),
		url: v.string(),
		imageUrl: v.string(),
		price2Night: v.number(),
		price3Night: v.union(v.number(), v.null()),
		location: v.string(),
		accessibility: v.string(), // A-F rating, "?" if unknown
	}),
	responses: defineTable({
		email: v.string(),
		budget: v.number(),
		rankings: v.array(v.id("airbnbs")),
		comments: v.optional(
			v.array(v.object({ airbnbId: v.id("airbnbs"), text: v.string() })),
		),
	}).index("by_email", ["email"]),
});
