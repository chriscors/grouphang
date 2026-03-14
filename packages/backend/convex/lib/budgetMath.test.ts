import { describe, expect, it } from "vitest";
import { calculateFairShares } from "./budgetMath";

describe("calculateFairShares", () => {
	it("returns empty for no budgets", () => {
		const result = calculateFairShares([], 1000);
		expect(result).toEqual({ shares: [], affordable: false });
	});

	it("marks unaffordable when total budgets < price", () => {
		const result = calculateFairShares([50, 50, 50], 200);
		expect(result.affordable).toBe(false);
		expect(result.shares).toEqual([0, 0, 0]);
	});

	it("splits equally when all budgets are sufficient", () => {
		const result = calculateFairShares([100, 100, 100, 100], 300);
		expect(result.affordable).toBe(true);
		expect(result.shares).toEqual([75, 75, 75, 75]);
	});

	it("caps one person at their budget and redistributes", () => {
		// 4 people, price $300, one person only has $30
		// Equal share would be $75, but person 4 can only pay $30
		// Remaining $270 split among 3 = $90 each
		const result = calculateFairShares([200, 150, 100, 30], 300);
		expect(result.affordable).toBe(true);
		expect(result.shares).toEqual([90, 90, 90, 30]);
	});

	it("caps multiple people and redistributes iteratively", () => {
		// 4 people, price $200
		// Equal share = $50, persons 2,3,4 all have $20 < $50
		// They each pay $20, remaining $140 to person 1
		const result = calculateFairShares([200, 20, 20, 20], 200);
		expect(result.affordable).toBe(true);
		expect(result.shares).toEqual([140, 20, 20, 20]);
	});

	it("handles exact affordability", () => {
		const result = calculateFairShares([50, 50, 50, 50], 200);
		expect(result.affordable).toBe(true);
		expect(result.shares).toEqual([50, 50, 50, 50]);
	});

	it("handles single person who can afford", () => {
		const result = calculateFairShares([500], 300);
		expect(result.affordable).toBe(true);
		expect(result.shares).toEqual([300]);
	});

	it("handles single person who cannot afford", () => {
		const result = calculateFairShares([100], 300);
		expect(result.affordable).toBe(false);
	});

	it("handles zero budget person", () => {
		const result = calculateFairShares([200, 200, 0], 300);
		expect(result.affordable).toBe(true);
		expect(result.shares).toEqual([150, 150, 0]);
	});

	it("handles cascading caps", () => {
		// Price $100, budgets [200, 15, 10, 5]
		// Round 1: equal share = $25, persons 3 and 4 capped at 10 and 5
		// Round 2: remaining $85 / 2 = $42.50, person 2 capped at $15
		// Round 3: remaining $70 / 1 = $70, person 1 pays $70
		const result = calculateFairShares([200, 15, 10, 5], 100);
		expect(result.affordable).toBe(true);
		expect(result.shares).toEqual([70, 15, 10, 5]);
	});
});
