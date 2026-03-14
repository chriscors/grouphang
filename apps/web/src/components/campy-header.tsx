"use client";

import { Flame, Mountain, Trees } from "lucide-react";


export function CampyHeader({ subtitle }: { subtitle?: string }) {

	return (
		<div className="relative overflow-hidden py-10 text-center">
			{/* Decorative tree row */}
			<div className="mb-5 flex items-end justify-center gap-1">
				<Trees className="size-6 text-emerald-700/60" />
				<Trees className="size-8 text-emerald-600/70" />
				<Trees className="size-10 text-emerald-500/80" />
				<span className="mx-3 text-5xl leading-none">⛺</span>
				<Trees className="size-10 scale-x-[-1] text-emerald-500/80" />
				<Trees className="size-8 scale-x-[-1] text-emerald-600/70" />
				<Trees className="size-6 scale-x-[-1] text-emerald-700/60" />
			</div>

			{/* Main title */}
			<h1 className="font-bold font-display text-5xl text-emerald-50 tracking-wide drop-shadow-lg sm:text-6xl break-words">
				camp emmalemmaembahannudougakatachrisatones
			</h1>

			{/* Trip details */}
			<div className="mt-3 flex items-center justify-center gap-3 text-emerald-400/80 text-sm">
				<Mountain className="size-3.5" />
				<span>May 28 – 31, 2026</span>
				<span className="text-emerald-700">·</span>
				<span>Virginia</span>
				<Flame className="size-3.5 text-amber-400" />
			</div>

			{/* Subtitle banner */}
			{subtitle && (
				<div className="mt-5">
					<span className="inline-block border-2 border-amber-500/60 bg-amber-500/20 px-6 py-1.5 font-display font-semibold text-amber-300 text-sm uppercase tracking-widest">
						{subtitle}
					</span>
				</div>
			)}
		</div>
	);
}
