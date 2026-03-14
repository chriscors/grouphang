"use client";

import { api } from "@grouphang/backend/convex/_generated/api";
import type { Id } from "@grouphang/backend/convex/_generated/dataModel";
import { calculateFairShares } from "@grouphang/backend/convex/lib/budgetMath";
import { calculateAggregateRankings } from "@grouphang/backend/convex/lib/rankingMath";
import { Badge } from "@grouphang/ui/components/badge";
import { useQuery } from "convex/react";
import { Loader2, Users } from "lucide-react";
import { useMemo } from "react";
import { CampyHeader } from "./campy-header";
import { type AirbnbComment, ResultCard } from "./result-card";

export function ResultsPage() {
	const airbnbs = useQuery(api.airbnbs.list);
	const responses = useQuery(api.responses.list);

	const results = useMemo(() => {
		if (!airbnbs || !responses || responses.length === 0) return null;

		const airbnbMap = new Map(airbnbs.map((a) => [a._id, a]));
		const budgets = responses.map((r) => r.budget);
		const pooledBudget = budgets.reduce((sum, b) => sum + b, 0);

		const rankings = calculateAggregateRankings(
			responses.map((r) => ({
				rankings: r.rankings.map((id) => id as string),
			})),
		);

		return rankings
			.map((ranking, index) => {
				const airbnb = airbnbMap.get(ranking.airbnbId as Id<"airbnbs">);
				if (!airbnb) return null;

				const two = calculateFairShares(budgets, airbnb.price2Night);

				const twoNight = {
					price: airbnb.price2Night,
					pooledBudget,
					affordable: two.affordable,
					fairShares: responses.map((r, i) => ({
						email: r.email,
						budget: r.budget,
						share: two.shares[i],
					})),
				};

				const threeNight =
					airbnb.price3Night != null
						? (() => {
								const three = calculateFairShares(
									budgets,
									airbnb.price3Night as number,
								);
								return {
									price: airbnb.price3Night as number,
									pooledBudget,
									affordable: three.affordable,
									fairShares: responses.map((r, i) => ({
										email: r.email,
										budget: r.budget,
										share: three.shares[i],
									})),
								};
							})()
						: null;

				// Gather per-person comments for this airbnb
				const comments: AirbnbComment[] = [];
				for (const r of responses) {
					if (!r.comments) continue;
					const match = r.comments.find((c) => c.airbnbId === airbnb._id);
					if (match?.text) {
						comments.push({ email: r.email, text: match.text });
					}
				}

				return {
					rank: index + 1,
					airbnb,
					points: ranking.points,
					twoNight,
					threeNight,
					comments,
				};
			})
			.filter(Boolean);
	}, [airbnbs, responses]);

	if (!airbnbs || !responses) {
		return (
			<div className="flex flex-col items-center justify-center py-20">
				<Loader2 className="size-6 animate-spin text-muted-foreground" />
				<p className="mt-2 text-muted-foreground text-xs">Loading results...</p>
			</div>
		);
	}

	if (responses.length === 0) {
		return (
			<div className="container mx-auto max-w-4xl px-4 pb-12">
				<CampyHeader subtitle="Results" />
				<div className="py-20 text-center">
					<p className="font-medium text-lg">No votes yet!</p>
					<p className="mt-1 text-muted-foreground text-sm">
						Share the link with your group to get started.
					</p>
				</div>
			</div>
		);
	}

	const pooledBudget = responses.reduce((sum, r) => sum + r.budget, 0);

	return (
		<div className="container mx-auto max-w-4xl px-4 pb-12">
			<CampyHeader subtitle="The People Have Spoken" />

			<div className="mb-8 flex flex-wrap items-center justify-center gap-3">
				<Badge variant="outline" className="gap-1 px-3 py-1">
					<Users className="size-3" />
					{responses.length} voter{responses.length !== 1 && "s"}
				</Badge>
				<Badge variant="outline" className="px-3 py-1">
					Pooled Budget: ${pooledBudget.toLocaleString()}
				</Badge>
			</div>

			{results && results.length > 0 ? (
				<div className="space-y-6">
					{results.map((result) => {
						if (!result) return null;
						return (
							<ResultCard
								key={result.airbnb._id}
								rank={result.rank}
								name={result.airbnb.name}
								imageUrl={result.airbnb.imageUrl}
								location={result.airbnb.location}
								url={result.airbnb.url}
								accessibility={result.airbnb.accessibility}
								points={result.points}
								voterCount={responses.length}
								twoNight={result.twoNight}
								threeNight={result.threeNight}
								comments={result.comments}
							/>
						);
					})}
				</div>
			) : (
				<div className="py-20 text-center">
					<p className="font-medium text-lg">No listings ranked yet</p>
					<p className="mt-1 text-muted-foreground text-sm">
						Votes are in, but nobody ranked any listings.
					</p>
				</div>
			)}
		</div>
	);
}
