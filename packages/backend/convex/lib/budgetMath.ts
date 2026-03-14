export interface FairShareResult {
	shares: number[];
	affordable: boolean;
}

/**
 * Iterative fair-share algorithm.
 * Everyone starts with an equal split of the total price.
 * Anyone whose budget is less than the equal share pays their full budget;
 * the remainder is redistributed among the rest. Repeat until stable.
 */
export function calculateFairShares(
	budgets: number[],
	totalPrice: number,
): FairShareResult {
	const n = budgets.length;
	if (n === 0) return { shares: [], affordable: false };

	const totalBudget = budgets.reduce((sum, b) => sum + b, 0);
	if (totalBudget < totalPrice) {
		return { shares: budgets.map(() => 0), affordable: false };
	}

	const shares = new Array(n).fill(0);
	const settled = new Array(n).fill(false);
	let remainingCost = totalPrice;
	let remainingPeople = n;

	// Iterate until no new person gets capped
	while (remainingPeople > 0) {
		const equalShare = remainingCost / remainingPeople;
		let newlyCapped = false;

		for (let i = 0; i < n; i++) {
			if (settled[i]) continue;
			if (budgets[i] < equalShare) {
				shares[i] = budgets[i];
				settled[i] = true;
				remainingCost -= budgets[i];
				remainingPeople--;
				newlyCapped = true;
			}
		}

		if (!newlyCapped) {
			// Everyone remaining can afford the equal share
			for (let i = 0; i < n; i++) {
				if (!settled[i]) {
					shares[i] = equalShare;
				}
			}
			break;
		}
	}

	// Round to 2 decimal places
	return {
		shares: shares.map((s) => Math.round(s * 100) / 100),
		affordable: true,
	};
}
