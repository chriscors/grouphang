"use client";

import { Input } from "@grouphang/ui/components/input";
import { Label } from "@grouphang/ui/components/label";
import { DollarSign, Mail } from "lucide-react";

interface EmailBudgetFormProps {
	email: string;
	budget: string;
	onEmailChange: (email: string) => void;
	onBudgetChange: (budget: string) => void;
	onEmailBlur: () => void;
	isReturning: boolean;
}

export function EmailBudgetForm({
	email,
	budget,
	onEmailChange,
	onBudgetChange,
	onEmailBlur,
	isReturning,
}: EmailBudgetFormProps) {
	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="email">
					<Mail className="size-3.5" />
					Email
				</Label>
				<Input
					id="email"
					type="email"
					placeholder="your@email.com"
					value={email}
					onChange={(e) => onEmailChange(e.target.value)}
					onBlur={onEmailBlur}
				/>
				{isReturning && (
					<p className="text-emerald-600 text-xs dark:text-emerald-400">
						Welcome back! Your previous answers have been loaded.
					</p>
				)}
			</div>
			<div className="space-y-2">
				<Label htmlFor="budget">
					<DollarSign className="size-3.5" />
					Your Budget
				</Label>
				<div className="relative">
					<span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground text-xs">
						$
					</span>
					<Input
						id="budget"
						type="number"
						min={0}
						step={10}
						placeholder="250"
						value={budget}
						onChange={(e) => onBudgetChange(e.target.value)}
						className="pl-6"
					/>
				</div>
				<p className="text-muted-foreground text-xs">
					How much can you put towards the group stay?
				</p>
			</div>
		</div>
	);
}
