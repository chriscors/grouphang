import { Card, CardContent } from "@grouphang/ui/components/card";
import { cn } from "@grouphang/ui/lib/utils";
import { ExternalLink, GripVertical, MapPin } from "lucide-react";
import { AccessibilityBadge } from "./accessibility-badge";

interface AirbnbCardProps {
	name: string;
	imageUrl: string;
	price2Night: number;
	price3Night: number | null;
	location: string;
	url: string;
	accessibility: string;
	voterCount?: number;
	rank?: number;
	showDragHandle?: boolean;
	compact?: boolean;
}

export function AirbnbCard({
	name,
	imageUrl,
	price2Night,
	price3Night,
	location,
	url,
	accessibility,
	voterCount,
	rank,
	showDragHandle,
	compact,
}: AirbnbCardProps) {
	const n = voterCount && voterCount > 0 ? voterCount : null;

	return (
		<Card
			className={cn(
				"relative overflow-hidden transition-shadow hover:shadow-md",
				compact && "flex-row items-center",
			)}
		>
			{rank != null && (
				<div className="absolute top-2 left-2 z-10 flex size-7 items-center justify-center bg-emerald-600 font-bold text-white text-xs">
					#{rank}
				</div>
			)}
			<div
				className={cn(
					"relative",
					compact ? "h-20 w-24 shrink-0" : "h-40 w-full",
				)}
			>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img src={imageUrl} alt={name} className="h-full w-full object-cover" />
			</div>
			<CardContent className={cn("flex-1", compact && "py-2")}>
				<div className="flex items-start gap-2">
					{showDragHandle && (
						<GripVertical className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
					)}
					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-1.5">
							<h3 className="truncate font-medium text-sm">{name}</h3>
							<AccessibilityBadge grade={accessibility} />
						</div>
						<div className="mt-0.5 flex items-center gap-1 text-muted-foreground text-xs">
							<MapPin className="size-3" />
							{location}
						</div>
						<div className="mt-1.5 flex items-center justify-between gap-2">
							<div className="flex flex-col gap-0.5 text-xs">
								<span>
									<span className="font-semibold">
										${price2Night.toLocaleString()}
									</span>
									<span className="text-muted-foreground"> 2 nts</span>
									{n && (
										<span className="text-muted-foreground">
											{" "}
											· ~${Math.round(price2Night / n)}/pp
										</span>
									)}
								</span>
								{price3Night != null ? (
									<span>
										<span className="font-semibold">
											${price3Night.toLocaleString()}
										</span>
										<span className="text-muted-foreground"> 3 nts</span>
										{n && (
											<span className="text-muted-foreground">
												{" "}
												· ~${Math.round(price3Night / n)}/pp
											</span>
										)}
									</span>
								) : (
									<span className="text-muted-foreground italic">
										3 nts N/A
									</span>
								)}
							</div>
							<a
								href={url}
								target="_blank"
								rel="noopener noreferrer"
								className="shrink-0 text-muted-foreground hover:text-foreground"
								onClick={(e) => e.stopPropagation()}
							>
								<ExternalLink className="size-3.5" />
							</a>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
