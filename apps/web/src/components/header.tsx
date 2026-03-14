"use client";

import { Trees } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
	const links = [
		{ to: "/", label: "🗳️ Vote" },
		{ to: "/results", label: "🏆 Results" },
	] as const;

	return (
		<header className="border-emerald-900/80 border-b bg-emerald-950/90 backdrop-blur-sm">
			<div className="container mx-auto flex items-center justify-between px-4 py-3">
				<Link href="/" className="flex items-center gap-2">
					<Trees className="size-5 text-emerald-400" />
					<span className="font-display font-semibold text-emerald-50 text-lg">
						Camp GroupHang
					</span>
				</Link>
				<nav className="flex items-center gap-4">
					{links.map(({ to, label }) => (
						<Link
							key={to}
							href={to}
							className="font-display font-medium text-emerald-300 text-sm transition-colors hover:text-white"
						>
							{label}
						</Link>
					))}
					<ModeToggle />
				</nav>
			</div>
		</header>
	);
}
