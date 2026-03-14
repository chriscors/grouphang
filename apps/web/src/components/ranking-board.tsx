"use client";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Doc, Id } from "@grouphang/backend/convex/_generated/dataModel";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AirbnbCard } from "./airbnb-card";
import { SortableAirbnbCard } from "./sortable-airbnb-card";

interface RankingBoardProps {
	airbnbs: Doc<"airbnbs">[];
	rankedIds: Id<"airbnbs">[];
	unrankedIds: Id<"airbnbs">[];
	onRankingsChange: (
		ranked: Id<"airbnbs">[],
		unranked: Id<"airbnbs">[],
	) => void;
	comments: Record<string, string>;
	onCommentChange: (airbnbId: Id<"airbnbs">, text: string) => void;
}

export function RankingBoard({
	airbnbs,
	rankedIds,
	unrankedIds,
	onRankingsChange,
	comments,
	onCommentChange,
}: RankingBoardProps) {
	const [activeId, setActiveId] = useState<Id<"airbnbs"> | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
		useSensor(TouchSensor, {
			activationConstraint: { delay: 200, tolerance: 5 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const airbnbMap = new Map(airbnbs.map((a) => [a._id, a]));

	const handleAdd = (id: Id<"airbnbs">) => {
		onRankingsChange(
			[...rankedIds, id],
			unrankedIds.filter((u) => u !== id),
		);
	};

	const handleRemove = (id: Id<"airbnbs">) => {
		onRankingsChange(
			rankedIds.filter((r) => r !== id),
			[...unrankedIds, id],
		);
	};

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as Id<"airbnbs">);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveId(null);
		if (!over || active.id === over.id) return;

		const oldIndex = rankedIds.indexOf(active.id as Id<"airbnbs">);
		const newIndex = rankedIds.indexOf(over.id as Id<"airbnbs">);
		if (oldIndex !== -1 && newIndex !== -1) {
			onRankingsChange(arrayMove(rankedIds, oldIndex, newIndex), unrankedIds);
		}
	};

	const activeAirbnb = activeId ? airbnbMap.get(activeId) : null;

	return (
		<div className="space-y-6">
			{/* Ranked zone */}
			<div>
				<h3 className="mb-2 flex items-center gap-2 font-semibold text-sm">
					<span className="inline-flex size-5 items-center justify-center bg-emerald-600 text-[10px] text-white">
						{rankedIds.length}
					</span>
					My Rankings
				</h3>
				<p className="mb-3 text-muted-foreground text-xs">
					#1 = your top pick. Drag to reorder.
				</p>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={rankedIds}
						strategy={verticalListSortingStrategy}
					>
						<div className="min-h-[80px] space-y-2 border border-emerald-600/30 border-dashed bg-emerald-50/50 p-3 dark:bg-emerald-950/20">
							{rankedIds.length === 0 && (
								<p className="py-6 text-center text-muted-foreground text-xs">
									Click + on a listing below to rank it
								</p>
							)}
							{rankedIds.map((id, index) => {
								const airbnb = airbnbMap.get(id);
								if (!airbnb) return null;
								return (
									<SortableAirbnbCard
										key={id}
										airbnb={airbnb}
	
										rank={index + 1}
										comment={comments[id]}
										onCommentChange={onCommentChange}
										onRemove={() => handleRemove(id)}
									/>
								);
							})}
						</div>
					</SortableContext>

					<DragOverlay>
						{activeAirbnb ? (
							<div className="opacity-90 shadow-lg">
								<AirbnbCard
									name={activeAirbnb.name}
									imageUrl={activeAirbnb.imageUrl}
									price2Night={activeAirbnb.price2Night}
									price3Night={activeAirbnb.price3Night}
									location={activeAirbnb.location}
									url={activeAirbnb.url}
									accessibility={activeAirbnb.accessibility}

									showDragHandle
									compact
								/>
							</div>
						) : null}
					</DragOverlay>
				</DndContext>
			</div>

			{/* Unranked zone */}
			{unrankedIds.length > 0 && (
				<div>
					<h3 className="mb-3 font-semibold text-sm">Available Listings</h3>
					<div className="space-y-2">
						{unrankedIds.map((id) => {
							const airbnb = airbnbMap.get(id);
							if (!airbnb) return null;
							return (
								<div key={id}>
									<AirbnbCard
										name={airbnb.name}
										imageUrl={airbnb.imageUrl}
										price2Night={airbnb.price2Night}
										price3Night={airbnb.price3Night}
										location={airbnb.location}
										url={airbnb.url}
										accessibility={airbnb.accessibility}
	
										compact
									/>
									<button
										type="button"
										onClick={() => handleAdd(id)}
										className="flex w-full items-center justify-center gap-1.5 border border-border border-t-0 py-1.5 text-muted-foreground text-xs hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/30"
									>
										<Plus className="size-3" />
										Add to ranking
									</button>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
