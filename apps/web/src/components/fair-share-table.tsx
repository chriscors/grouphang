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
	currentEmail?: string;
}

export function FairShareTable({
	entries,
	affordable,
	currentEmail,
}: FairShareTableProps) {
	if (!affordable) {
		return (
			<p className="text-red-500 text-xs">
				Not enough combined budget to cover this listing.
			</p>
		);
	}

	const myEntry = currentEmail
		? entries.find((e) => e.email === currentEmail)
		: null;

	if (!myEntry) {
		return (
			<p className="text-muted-foreground text-xs italic">
				Submit your vote to see your share.
			</p>
		);
	}

	const usesFullBudget =
		Math.abs(myEntry.share - myEntry.budget) < 0.01 && myEntry.share > 0;

	return (
		<div className="space-y-1">
			<div className="flex items-center justify-between text-xs">
				<span className="truncate text-muted-foreground">Your share</span>
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
						{myEntry.share.toLocaleString(undefined, {
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
		</div>
	);
}
