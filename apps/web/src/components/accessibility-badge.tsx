import { cn } from "@grouphang/ui/lib/utils";
import { Accessibility } from "lucide-react";

const GRADE_STYLES: Record<string, string> = {
	A: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700",
	B: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700",
	C: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700",
	D: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700",
	E: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700",
	F: "bg-red-200 text-red-900 border-red-400 dark:bg-red-900/60 dark:text-red-200 dark:border-red-600",
	"?": "bg-muted text-muted-foreground border-border",
};

const GRADE_LABELS: Record<string, string> = {
	A: "Very accessible",
	B: "Mostly accessible",
	C: "Somewhat accessible",
	D: "Limited accessibility",
	E: "Poor accessibility",
	F: "Not accessible",
	"?": "Accessibility unknown",
};

interface AccessibilityBadgeProps {
	grade: string;
	size?: "sm" | "md";
}

export function AccessibilityBadge({
	grade,
	size = "sm",
}: AccessibilityBadgeProps) {
	const styles = GRADE_STYLES[grade] ?? GRADE_STYLES["?"];
	const label = GRADE_LABELS[grade] ?? GRADE_LABELS["?"];
	return (
		<span
			title={label}
			className={cn(
				"inline-flex shrink-0 items-center gap-1 border px-1.5 font-bold tabular-nums",
				size === "sm" ? "h-5 text-[10px]" : "h-6 text-xs",
				styles,
			)}
		>
			<Accessibility className={size === "sm" ? "size-2.5" : "size-3"} />
			{grade}
		</span>
	);
}
