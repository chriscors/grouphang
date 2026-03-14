"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Doc, Id } from "@grouphang/backend/convex/_generated/dataModel";
import { Textarea } from "@grouphang/ui/components/textarea";
import { MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { AirbnbCard } from "./airbnb-card";

interface SortableAirbnbCardProps {
	airbnb: Doc<"airbnbs">;
	rank?: number;
	comment?: string;
	onCommentChange?: (airbnbId: Id<"airbnbs">, text: string) => void;
	onRemove?: () => void;
}

export function SortableAirbnbCard({
	airbnb,
	rank,
	comment,
	onCommentChange,
	onRemove,
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
			<div className="relative">
				<div {...attributes} {...listeners}>
					<AirbnbCard
						name={airbnb.name}
						imageUrl={airbnb.imageUrl}
						price2Night={airbnb.price2Night}
						price3Night={airbnb.price3Night}
						location={airbnb.location}
						url={airbnb.url}
						accessibility={airbnb.accessibility}
						rank={rank}
						showDragHandle
						compact
					/>
				</div>
				{onRemove && (
					<button
						type="button"
						onClick={onRemove}
						className="absolute top-2 right-2 z-20 bg-background/80 p-0.5 text-muted-foreground hover:text-destructive"
					>
						<X className="size-3.5" />
					</button>
				)}
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
							<Textarea
								value={comment ?? ""}
								onChange={(e) => onCommentChange(airbnb._id, e.target.value)}
								placeholder="What do you think about this place?"
								rows={2}
								className="min-h-0 resize-none"
							/>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
