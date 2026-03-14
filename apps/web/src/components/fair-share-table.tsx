import { Badge } from "@grouphang/ui/components/badge";
import { cn } from "@grouphang/ui/lib/utils";

export interface FairShareEntry {
	email: string;
	budget: number;
	share: number;
}

interface FairShareTableProps {
	entries: FairShareEntry[];
	affordable: boolean;
}

export function FairShareTable({ entries, affordable }: FairShareTableProps) {
	if (!affordable) {
		return (
			<p className="text-red-500 text-xs">
				Not enough combined budget to cover this listing.
			</p>
		);
	}

	return (
		<div className="space-y-1">
			{entries.map((entry) => {
				const usesFullBudget =
					Math.abs(entry.share - entry.budget) < 0.01 && entry.share > 0;
				return (
					<div
						key={entry.email}
						className="flex items-center justify-between text-xs"
					>
						<span className="truncate text-muted-foreground">
							{entry.email}
						</span>
						<div className="flex items-center gap-2">
							<span
								className={cn(
									"font-mono tabular-nums",
									usesFullBudget
										? "text-amber-600 dark:text-amber-400"
										: "text-foreground",
								)}
							>
								$
								{entry.share.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</span>
							{usesFullBudget && (
								<Badge variant="outline" className="h-4 px-1 text-[10px]">
									maxed
								</Badge>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
