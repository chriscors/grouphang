"use client";

import { Tent, Trees } from "lucide-react";

const TAGLINES = [
	"This trip is in-tents!",
	"Let's get this show on the trail!",
	"We're happy campers!",
	"Time to branch out!",
	"Wood you like to go on vacation?",
];

export function CampyHeader({ subtitle }: { subtitle?: string }) {
	const tagline = TAGLINES[Math.floor(Date.now() / 86400000) % TAGLINES.length];

	return (
		<div className="py-8 text-center">
			<div className="mb-2 flex items-center justify-center gap-2">
				<Trees className="size-8 text-emerald-600 dark:text-emerald-400" />
				<h1 className="font-bold text-3xl tracking-tight sm:text-4xl">
					Camp GroupHang
				</h1>
				<Tent className="size-8 text-emerald-600 dark:text-emerald-400" />
			</div>
			<p className="text-muted-foreground text-sm italic">{tagline}</p>
			<p className="mt-1 text-muted-foreground text-xs">
				May 28 &ndash; 31, 2026 &middot; Virginia
			</p>
			{subtitle && (
				<p className="mt-2 font-medium text-emerald-700 text-sm dark:text-emerald-300">
					{subtitle}
				</p>
			)}
		</div>
	);
}
