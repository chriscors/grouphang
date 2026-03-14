import { describe, expect, it } from "vitest";
import { calculateAggregateRankings } from "./rankingMath";

describe("calculateAggregateRankings", () => {
	it("returns empty for no responses", () => {
		expect(calculateAggregateRankings([])).toEqual([]);
	});

	it("single voter ranking 3 items", () => {
		const result = calculateAggregateRankings([{ rankings: ["a", "b", "c"] }]);
		expect(result).toEqual([
			{ airbnbId: "a", points: 3 },
			{ airbnbId: "b", points: 2 },
			{ airbnbId: "c", points: 1 },
		]);
	});

	it("multiple voters agreeing on #1", () => {
		const result = calculateAggregateRankings([
			{ rankings: ["a", "b"] },
			{ rankings: ["a", "c"] },
			{ rankings: ["a", "b"] },
		]);
		// a: 2+2+2 = 6, b: 1+0+1 = 2, c: 0+1+0 = 1
		expect(result[0]).toEqual({ airbnbId: "a", points: 6 });
	});

	it("handles disagreement", () => {
		const result = calculateAggregateRankings([
			{ rankings: ["a", "b", "c"] },
			{ rankings: ["c", "b", "a"] },
		]);
		// a: 3+1=4, b: 2+2=4, c: 1+3=4 — all tied
		expect(result.length).toBe(3);
		for (const r of result) {
			expect(r.points).toBe(4);
		}
	});

	it("only includes airbnbs with at least one vote", () => {
		const result = calculateAggregateRankings([{ rankings: ["a"] }]);
		const ids = result.map((r) => r.airbnbId);
		expect(ids).toContain("a");
		expect(ids).not.toContain("b");
	});

	it("voters rank different number of items", () => {
		const result = calculateAggregateRankings([
			{ rankings: ["a", "b", "c", "d", "e"] },
			{ rankings: ["b", "a"] },
		]);
		// a: 5 + 1 = 6, b: 4 + 2 = 6, c: 3, d: 2, e: 1
		expect(result[0].points).toBe(6);
		expect(result[1].points).toBe(6);
	});

	it("empty rankings are ignored", () => {
		const result = calculateAggregateRankings([
			{ rankings: [] },
			{ rankings: ["a"] },
		]);
		expect(result).toEqual([{ airbnbId: "a", points: 1 }]);
	});
});
