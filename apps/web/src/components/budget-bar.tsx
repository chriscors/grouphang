import { cn } from "@grouphang/ui/lib/utils";

interface BudgetBarProps {
	pooledBudget: number;
	totalPrice: number;
}

export function BudgetBar({ pooledBudget, totalPrice }: BudgetBarProps) {
	const percentage = Math.min((pooledBudget / totalPrice) * 100, 100);
	const affordable = pooledBudget >= totalPrice;
	const surplus = pooledBudget - totalPrice;

	return (
		<div className="space-y-1.5">
			<div className="flex items-center justify-between text-xs">
				<span className="text-muted-foreground">
					Pooled: ${pooledBudget.toLocaleString()}
				</span>
				<span className="font-medium">
					Cost: ${totalPrice.toLocaleString()}
				</span>
			</div>
			<div className="relative h-3 w-full overflow-hidden bg-muted">
				<div
					className={cn(
						"h-full transition-all duration-500",
						affordable
							? "bg-emerald-500 dark:bg-emerald-600"
							: "bg-red-500 dark:bg-red-600",
					)}
					style={{ width: `${percentage}%` }}
				/>
			</div>
			<div className="text-xs">
				{affordable ? (
					<span className="text-emerald-600 dark:text-emerald-400">
						Covered! ${surplus.toLocaleString()} to spare
					</span>
				) : (
					<span className="text-red-600 dark:text-red-400">
						${Math.abs(surplus).toLocaleString()} short
					</span>
				)}
			</div>
		</div>
	);
}
