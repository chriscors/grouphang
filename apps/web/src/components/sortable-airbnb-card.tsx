"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Doc, Id } from "@grouphang/backend/convex/_generated/dataModel";
import { cn } from "@grouphang/ui/lib/utils";
import { MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { AirbnbCard } from "./airbnb-card";

interface SortableAirbnbCardProps {
	airbnb: Doc<"airbnbs">;
	voterCount?: number;
	rank?: number;
	comment?: string;
	onCommentChange?: (airbnbId: Id<"airbnbs">, text: string) => void;
}

export function SortableAirbnbCard({
	airbnb,
	voterCount,
	rank,
	comment,
	onCommentChange,
}: SortableAirbnbCardProps) {
	const [showComment, setShowComment] = useState(!!comment);

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: airbnb._id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
		touchAction: "none" as const,
	};

	return (
		<div ref={setNodeRef} style={style}>
			<div {...attributes} {...listeners}>
				<AirbnbCard
					name={airbnb.name}
					imageUrl={airbnb.imageUrl}
					price2Night={airbnb.price2Night}
					price3Night={airbnb.price3Night}
					location={airbnb.location}
					url={airbnb.url}
					accessibility={airbnb.accessibility}
					voterCount={voterCount}
					rank={rank}
					showDragHandle
					compact
				/>
			</div>
			{onCommentChange && (
				<div className="border border-border border-t-0 px-3 pb-2">
					{!showComment ? (
						<button
							type="button"
							onClick={() => setShowComment(true)}
							className="flex items-center gap-1 pt-2 text-muted-foreground text-xs hover:text-foreground"
						>
							<MessageSquare className="size-3" />
							Add a comment
						</button>
					) : (
						<div className="space-y-1.5 pt-2">
							<div className="flex items-center justify-between">
								<span className="flex items-center gap-1 text-muted-foreground text-xs">
									<MessageSquare className="size-3" />
									Your comment
								</span>
								<button
									type="button"
									onClick={() => {
										setShowComment(false);
										onCommentChange(airbnb._id, "");
									}}
									className="text-muted-foreground hover:text-foreground"
								>
									<X className="size-3" />
								</button>
							</div>
							<textarea
								value={comment ?? ""}
								onChange={(e) => onCommentChange(airbnb._id, e.target.value)}
								placeholder="What do you think about this place?"
								rows={2}
								className={cn(
									"w-full resize-none border border-input bg-transparent px-2.5 py-1.5 text-xs",
									"placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/50",
								)}
							/>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
