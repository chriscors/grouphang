import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByEmail = query({
	args: { email: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("responses")
			.withIndex("by_email", (q) => q.eq("email", args.email))
			.first();
	},
});

export const submit = mutation({
	args: {
		email: v.string(),
		budget: v.number(),
		rankings: v.array(v.id("airbnbs")),
		comments: v.optional(
			v.array(v.object({ airbnbId: v.id("airbnbs"), text: v.string() })),
		),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query("responses")
			.withIndex("by_email", (q) => q.eq("email", args.email))
			.first();

		if (existing) {
			await ctx.db.patch(existing._id, {
				budget: args.budget,
				rankings: args.rankings,
				comments: args.comments,
			});
			return existing._id;
		}

		return await ctx.db.insert("responses", {
			email: args.email,
			budget: args.budget,
			rankings: args.rankings,
			comments: args.comments,
		});
	},
});

export const list = query({
	handler: async (ctx) => {
		return await ctx.db.query("responses").collect();
	},
});
