"use client";

import { Badge } from "@grouphang/ui/components/badge";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@grouphang/ui/components/card";
import { cn } from "@grouphang/ui/lib/utils";
import { ChevronDown, ExternalLink, MapPin, MessageSquare, Trophy } from "lucide-react";
import { useState } from "react";
import { AccessibilityBadge } from "./accessibility-badge";
import { BudgetBar } from "./budget-bar";
import { type FairShareEntry, FairShareTable } from "./fair-share-table";

interface PricingOption {
	price: number;
	pooledBudget: number;
	affordable: boolean;
	fairShares: FairShareEntry[];
}

export interface AirbnbComment {
	email: string;
	text: string;
}

interface ResultCardProps {
	rank: number;
	name: string;
	imageUrl: string;
	location: string;
	url: string;
	accessibility: string;
	points: number;
	voterCount: number;
	twoNight: PricingOption;
	threeNight: PricingOption | null;
	comments: AirbnbComment[];
	currentEmail?: string;
}

function PricingSection({
	label,
	dates,
	price,
	voterCount,
	pooledBudget,
	affordable,
	fairShares,
	currentEmail,
}: {
	label: string;
	dates: string;
	price: number;
	voterCount: number;
	pooledBudget: number;
	affordable: boolean;
	fairShares: FairShareEntry[];
	currentEmail?: string;
}) {
	const pricePerPerson = voterCount > 0 ? price / voterCount : 0;
	return (
		<div className="space-y-3">
			<div className="flex items-baseline justify-between">
				<div>
					<span className="font-semibold text-sm">{label}</span>
					<span className="ml-1.5 text-muted-foreground text-xs">{dates}</span>
				</div>
				{!affordable && (
					<Badge variant="destructive" className="text-[10px]">
						Over Budget
					</Badge>
				)}
			</div>
			<div className="flex items-baseline gap-2">
				<span className="font-bold text-lg">${price.toLocaleString()}</span>
				<span className="text-muted-foreground text-xs">total</span>
				<span className="text-muted-foreground text-xs">&middot;</span>
				<span className="text-muted-foreground text-xs">
					~${Math.round(pricePerPerson)}/person
				</span>
			</div>
			<BudgetBar pooledBudget={pooledBudget} totalPrice={price} />
			<div>
				<h5 className="mb-1.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
					Fair Share
				</h5>
				<FairShareTable entries={fairShares} affordable={affordable} currentEmail={currentEmail} />
			</div>
		</div>
	);
}

export function ResultCard({
	rank,
	name,
	imageUrl,
	location,
	url,
	accessibility,
	points,
	voterCount,
	twoNight,
	threeNight,
	comments,
	currentEmail,
}: ResultCardProps) {
	const [commentsOpen, setCommentsOpen] = useState(false);
	const eitherAffordable =
		twoNight.affordable || (threeNight?.affordable ?? false);

	return (
		<Card
			className={cn("overflow-hidden", rank === 1 && "ring-2 ring-emerald-500")}
		>
			<div className="relative h-48 w-full sm:h-56">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img src={imageUrl} alt={name} className="h-full w-full object-cover" />
				<div className="absolute top-3 left-3 flex items-center gap-2">
					<div
						className={cn(
							"flex items-center gap-1 px-2 py-1 font-bold text-white text-xs",
							rank === 1
								? "bg-emerald-600"
								: rank === 2
									? "bg-emerald-700/80"
									: "bg-foreground/70",
						)}
					>
						{rank === 1 && <Trophy className="size-3" />}#{rank}
					</div>
					<Badge
						variant="secondary"
						className="bg-background/80 backdrop-blur-sm"
					>
						{points} pts
					</Badge>
				</div>
				{!eitherAffordable && (
					<div className="absolute top-3 right-3">
						<Badge variant="destructive">Over Budget</Badge>
					</div>
				)}
			</div>

			<CardHeader>
				<div className="flex items-start justify-between gap-2">
					<div className="min-w-0">
						<div className="flex items-center gap-2">
							<CardTitle className="text-base">{name}</CardTitle>
							<AccessibilityBadge grade={accessibility} size="md" />
						</div>
						<div className="mt-0.5 flex items-center gap-1 text-muted-foreground text-xs">
							<MapPin className="size-3" />
							{location}
						</div>
					</div>
					<a
						href={url}
						target="_blank"
						rel="noopener noreferrer"
						className="shrink-0 text-muted-foreground hover:text-foreground"
					>
						<ExternalLink className="size-4" />
					</a>
				</div>
			</CardHeader>

			<CardContent className="space-y-6">
				<div
					className={cn(
						"grid gap-6",
						threeNight && "sm:grid-cols-2 sm:divide-x",
					)}
				>
					<PricingSection
						label="2 Nights"
						dates="May 29–31"
						price={twoNight.price}
						voterCount={voterCount}
						pooledBudget={twoNight.pooledBudget}
						affordable={twoNight.affordable}
						fairShares={twoNight.fairShares}
					currentEmail={currentEmail}
	/>
					{threeNight ? (
						<div className="sm:pl-6">
							<PricingSection
								label="3 Nights"
								dates="May 28–31"
								price={threeNight.price}
								voterCount={voterCount}
								pooledBudget={threeNight.pooledBudget}
								affordable={threeNight.affordable}
								fairShares={threeNight.fairShares}
								currentEmail={currentEmail}
							/>
						</div>
					) : (
						<div className="flex items-center text-muted-foreground text-sm italic sm:pl-6">
							3-night option not available
						</div>
					)}
				</div>

				{comments.length > 0 && (
					<div className="border-t pt-4">
						<button
							type="button"
							onClick={() => setCommentsOpen((o) => !o)}
							className="flex w-full items-center justify-between text-left"
						>
							<span className="flex items-center gap-1.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
								<MessageSquare className="size-3.5" />
								Comments ({comments.length})
							</span>
							<ChevronDown
								className={cn(
									"size-4 text-muted-foreground transition-transform",
									commentsOpen && "rotate-180",
								)}
							/>
						</button>

						{commentsOpen && (
							<div className="mt-3 space-y-2">
								{comments.map((c) => (
									<div key={c.email} className="space-y-0.5">
										<p className="font-medium text-muted-foreground text-xs">
											{c.email}
										</p>
										<p className="text-sm">{c.text}</p>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
