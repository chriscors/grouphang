"use client";

import { api } from "@grouphang/backend/convex/_generated/api";
import type { Id } from "@grouphang/backend/convex/_generated/dataModel";
import { Button } from "@grouphang/ui/components/button";
import { useMutation, useQuery } from "convex/react";
import { Loader2, Send } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CampyHeader } from "./campy-header";
import { EmailBudgetForm } from "./email-budget-form";
import { RankingBoard } from "./ranking-board";
import { useRouter } from "next/navigation";

const EMAIL_STORAGE_KEY = "grouphang-email";

export function VotePage() {
	const airbnbs = useQuery(api.airbnbs.list);
	const [email, setEmail] = useState("");
	const [budget, setBudget] = useState("");
	const [rankedIds, setRankedIds] = useState<Id<"airbnbs">[]>([]);
	const [unrankedIds, setUnrankedIds] = useState<Id<"airbnbs">[]>([]);
	const [comments, setComments] = useState<Record<string, string>>({});
	const [isReturning, setIsReturning] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [initialized, setInitialized] = useState(false);
	const router = useRouter();
	const submit = useMutation(api.responses.submit);

	const existingResponse = useQuery(
		api.responses.getByEmail,
		email.includes("@") ? { email: email.toLowerCase().trim() } : "skip",
	);

	useEffect(() => {
		const saved = localStorage.getItem(EMAIL_STORAGE_KEY);
		if (saved) setEmail(saved);
	}, []);

	useEffect(() => {
		if (airbnbs && !initialized && !existingResponse) {
			setUnrankedIds(airbnbs.map((a) => a._id));
			setInitialized(true);
		}
	}, [airbnbs, initialized, existingResponse]);

	useEffect(() => {
		if (existingResponse && airbnbs) {
			setBudget(existingResponse.budget.toString());
			const existingRanked = existingResponse.rankings.filter((id) =>
				airbnbs.some((a) => a._id === id),
			);
			const existingUnranked = airbnbs
				.map((a) => a._id)
				.filter((id) => !existingRanked.includes(id));
			setRankedIds(existingRanked);
			setUnrankedIds(existingUnranked);

			// Restore saved comments
			if (existingResponse.comments) {
				const commentMap: Record<string, string> = {};
				for (const c of existingResponse.comments) {
					commentMap[c.airbnbId] = c.text;
				}
				setComments(commentMap);
			}

			setIsReturning(true);
			setInitialized(true);
		}
	}, [existingResponse, airbnbs]);

	const handleEmailBlur = useCallback(() => {
		const trimmed = email.toLowerCase().trim();
		if (trimmed) {
			localStorage.setItem(EMAIL_STORAGE_KEY, trimmed);
			setEmail(trimmed);
		}
	}, [email]);

	const handleRankingsChange = useCallback(
		(ranked: Id<"airbnbs">[], unranked: Id<"airbnbs">[]) => {
			setRankedIds(ranked);
			setUnrankedIds(unranked);
		},
		[],
	);

	const handleCommentChange = useCallback(
		(airbnbId: Id<"airbnbs">, text: string) => {
			setComments((prev) => {
				const next = { ...prev };
				if (text) {
					next[airbnbId] = text;
				} else {
					delete next[airbnbId];
				}
				return next;
			});
		},
		[],
	);

	const handleSubmit = async () => {
		const trimmedEmail = email.toLowerCase().trim();
		if (!trimmedEmail.includes("@")) {
			toast.error("Please enter a valid email address");
			return;
		}
		const budgetNum = Number.parseFloat(budget);
		if (!budget || Number.isNaN(budgetNum) || budgetNum < 0) {
			toast.error("Please enter a valid budget amount");
			return;
		}
		if (rankedIds.length === 0) {
			toast.error("Please rank at least one listing");
			return;
		}

		const commentsList = Object.entries(comments)
			.filter(([, text]) => text.trim())
			.map(([airbnbId, text]) => ({
				airbnbId: airbnbId as Id<"airbnbs">,
				text: text.trim(),
			}));

		setSubmitting(true);
		try {
			await submit({
				email: trimmedEmail,
				budget: budgetNum,
				rankings: rankedIds,
				comments: commentsList.length > 0 ? commentsList : undefined,
			});
			toast.success(
				isReturning ? "Your vote has been updated!" : "Your vote is in!",
			);
		} catch {
			toast.error("Something went wrong. Please try again.");
		} finally {
			setSubmitting(false);
			router.push("/results");
		}
	};

	if (!airbnbs) {
		return (
			<div className="flex flex-col items-center justify-center py-20">
				<Loader2 className="size-6 animate-spin text-muted-foreground" />
				<p className="mt-2 text-muted-foreground text-xs">
					Loading listings...
				</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-4xl px-4 pb-12">
			<CampyHeader subtitle="Vote for your favorite stay" />

			<div className="space-y-8">
				<EmailBudgetForm
					email={email}
					budget={budget}
					onEmailChange={setEmail}
					onBudgetChange={setBudget}
					onEmailBlur={handleEmailBlur}
					isReturning={isReturning}
				/>

				{email.includes("@") && (
					<>
						<hr />
						<RankingBoard
							airbnbs={airbnbs}
							rankedIds={rankedIds}
							unrankedIds={unrankedIds}
							onRankingsChange={handleRankingsChange}
	
							comments={comments}
							onCommentChange={handleCommentChange}
						/>
						<div className="flex justify-center pt-4">
							<Button
								size="lg"
								onClick={handleSubmit}
								disabled={submitting || rankedIds.length === 0}
								className="bg-emerald-600 text-white hover:bg-emerald-700"
							>
								{submitting ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									<Send className="size-4" />
								)}
								{isReturning ? "Update My Vote" : "Submit My Vote"}
							</Button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
