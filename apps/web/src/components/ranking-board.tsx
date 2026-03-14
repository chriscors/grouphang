"use client";

import {
	closestCorners,
	DndContext,
	type DragEndEvent,
	type DragOverEvent,
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
import { useCallback, useState } from "react";
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
	voterCount: number;
	comments: Record<string, string>;
	onCommentChange: (airbnbId: Id<"airbnbs">, text: string) => void;
}

export function RankingBoard({
	airbnbs,
	rankedIds,
	unrankedIds,
	onRankingsChange,
	voterCount,
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

	const findContainer = useCallback(
		(id: string) => {
			if (id === "ranked" || id === "unranked") return id;
			if (rankedIds.includes(id as Id<"airbnbs">)) return "ranked";
			if (unrankedIds.includes(id as Id<"airbnbs">)) return "unranked";
			return null;
		},
		[rankedIds, unrankedIds],
	);

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as Id<"airbnbs">);
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over) return;

		const activeContainer = findContainer(active.id as string);
		const overContainer = findContainer(over.id as string);

		if (!activeContainer || !overContainer || activeContainer === overContainer)
			return;

		const activeItemId = active.id as Id<"airbnbs">;
		const sourceIds =
			activeContainer === "ranked" ? [...rankedIds] : [...unrankedIds];
		const destIds =
			overContainer === "ranked" ? [...rankedIds] : [...unrankedIds];

		sourceIds.splice(sourceIds.indexOf(activeItemId), 1);
		const overIndex = destIds.indexOf(over.id as Id<"airbnbs">);
		if (overIndex >= 0) {
			destIds.splice(overIndex, 0, activeItemId);
		} else {
			destIds.push(activeItemId);
		}

		if (activeContainer === "ranked") {
			onRankingsChange(sourceIds, destIds);
		} else {
			onRankingsChange(destIds, sourceIds);
		}
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveId(null);
		if (!over) return;

		const activeContainer = findContainer(active.id as string);
		const overContainer = findContainer(over.id as string);

		if (!activeContainer || !overContainer) return;

		if (activeContainer === overContainer) {
			const items =
				activeContainer === "ranked" ? [...rankedIds] : [...unrankedIds];
			const oldIndex = items.indexOf(active.id as Id<"airbnbs">);
			const newIndex = items.indexOf(over.id as Id<"airbnbs">);

			if (oldIndex !== newIndex) {
				const newItems = arrayMove(items, oldIndex, newIndex);
				if (activeContainer === "ranked") {
					onRankingsChange(newItems, unrankedIds);
				} else {
					onRankingsChange(rankedIds, newItems);
				}
			}
		}
	};

	const activeAirbnb = activeId ? airbnbMap.get(activeId) : null;

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
		>
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Ranked zone */}
				<div>
					<h3 className="mb-2 flex items-center gap-2 font-semibold text-sm">
						<span className="inline-flex size-5 items-center justify-center bg-emerald-600 text-[10px] text-white">
							{rankedIds.length}
						</span>
						My Rankings
					</h3>
					<p className="mb-3 text-muted-foreground text-xs">
						Drag here to vote. #1 = your top pick.
					</p>
					<SortableContext
						items={rankedIds}
						strategy={verticalListSortingStrategy}
						id="ranked"
					>
						<div className="min-h-[120px] space-y-2 border border-emerald-600/30 border-dashed bg-emerald-50/50 p-3 dark:bg-emerald-950/20">
							{rankedIds.length === 0 && (
								<p className="py-8 text-center text-muted-foreground text-xs">
									Drag listings here to rank them
								</p>
							)}
							{rankedIds.map((id, index) => {
								const airbnb = airbnbMap.get(id);
								if (!airbnb) return null;
								return (
									<SortableAirbnbCard
										key={id}
										airbnb={airbnb}
										voterCount={voterCount}
										rank={index + 1}
										comment={comments[id]}
										onCommentChange={onCommentChange}
									/>
								);
							})}
						</div>
					</SortableContext>
				</div>

				{/* Unranked zone */}
				<div>
					<h3 className="mb-2 font-semibold text-sm">Available Listings</h3>
					<p className="mb-3 text-muted-foreground text-xs">
						Long press (mobile) or drag to rank.
					</p>
					<SortableContext
						items={unrankedIds}
						strategy={verticalListSortingStrategy}
						id="unranked"
					>
						<div className="min-h-[120px] space-y-2 border border-border border-dashed p-3">
							{unrankedIds.length === 0 && (
								<p className="py-8 text-center text-muted-foreground text-xs">
									All listings ranked!
								</p>
							)}
							{unrankedIds.map((id) => {
								const airbnb = airbnbMap.get(id);
								if (!airbnb) return null;
								return (
									<SortableAirbnbCard
										key={id}
										airbnb={airbnb}
										voterCount={voterCount}
									/>
								);
							})}
						</div>
					</SortableContext>
				</div>
			</div>

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
							voterCount={voterCount}
							showDragHandle
							compact
						/>
					</div>
				) : null}
			</DragOverlay>
		</DndContext>
	);
}
