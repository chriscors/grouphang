export interface RankedAirbnb {
	airbnbId: string;
	points: number;
}

/**
 * Borda count: if someone ranks N items, #1 gets N points, #2 gets N-1, ..., #N gets 1.
 * Only includes airbnbs with at least 1 point. Sorted descending by points.
 */
export function calculateAggregateRankings(
	responses: { rankings: string[] }[],
): RankedAirbnb[] {
	const pointMap = new Map<string, number>();

	for (const response of responses) {
		const n = response.rankings.length;
		for (let i = 0; i < n; i++) {
			const airbnbId = response.rankings[i];
			const points = n - i;
			pointMap.set(airbnbId, (pointMap.get(airbnbId) ?? 0) + points);
		}
	}

	return Array.from(pointMap.entries())
		.map(([airbnbId, points]) => ({ airbnbId, points }))
		.sort((a, b) => b.points - a.points);
}
