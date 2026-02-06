import {
	ArrowRight01Icon,
	Folder01Icon,
	Menu01Icon,
	ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Category } from "@renovabit/db/schema";
import { Badge } from "@renovabit/ui/components/ui/badge";
import { Button } from "@renovabit/ui/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@renovabit/ui/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@renovabit/ui/components/ui/collapsible";
import { cn } from "@renovabit/ui/lib/utils";
import { useMemo } from "react";

interface CategoryTreePreviewProps {
	categories: Category[];
}

interface TreeItem extends Category {
	children: TreeItem[];
}

export function CategoryTreePreview({ categories }: CategoryTreePreviewProps) {
	const tree = useMemo(() => {
		const categoryMap = new Map<string, TreeItem>();
		const roots: TreeItem[] = [];

		// Initialize all items
		for (const cat of categories) {
			categoryMap.set(cat.id, { ...cat, children: [] });
		}

		// Build hierarchy
		for (const cat of categories) {
			const item = categoryMap.get(cat.id)!;
			if (cat.parentId && categoryMap.has(cat.parentId)) {
				categoryMap.get(cat.parentId)!.children.push(item);
			} else {
				roots.push(item);
			}
		}

		// Sort each level by order then name
		const sortItems = (items: TreeItem[]) => {
			items.sort((a, b) => {
				if (a.order !== b.order) return a.order - b.order;
				return a.name.localeCompare(b.name);
			});
			for (const item of items) {
				if (item.children.length > 0) {
					sortItems(item.children);
				}
			}
		};

		sortItems(roots);
		return roots;
	}, [categories]);

	const renderItem = (item: TreeItem, level = 0) => {
		const hasChildren = item.children.length > 0;

		if (hasChildren) {
			return (
				<Collapsible key={item.id} defaultOpen={level < 1}>
					<CollapsibleTrigger
						render={
							<Button
								variant="ghost"
								size="sm"
								className={cn(
									"group w-full justify-start gap-2 hover:bg-accent hover:text-accent-foreground transition-none h-9 px-2",
									!item.isActive && "opacity-60",
								)}
							>
								<HugeiconsIcon
									icon={ArrowRight01Icon}
									className="size-3.5 transition-transform group-data-[state=open]:rotate-90 text-muted-foreground"
								/>
								<HugeiconsIcon
									icon={Folder01Icon}
									className="size-4 text-primary/70"
								/>
								<span className="truncate flex-1 text-left">{item.name}</span>
								{!item.isActive && (
									<Badge variant="outline" className="text-[10px] h-4 px-1">
										Inactiva
									</Badge>
								)}
								{item.showInNavbar && (
									<div
										className="size-1.5 rounded-full bg-green-500"
										title="En Navbar"
									/>
								)}
							</Button>
						}
					/>
					<CollapsibleContent className="ml-4 pl-2 border-l border-muted-foreground/20 mt-1 flex flex-col gap-1">
						{item.children.map((child) => renderItem(child, level + 1))}
					</CollapsibleContent>
				</Collapsible>
			);
		}

		return (
			<div
				key={item.id}
				className={cn(
					"flex items-center gap-2 h-9 px-2 rounded-md hover:bg-accent/50 text-sm",
					!item.isActive && "opacity-60",
				)}
			>
				<div className="size-3.5" />
				<HugeiconsIcon
					icon={Menu01Icon}
					className="size-4 text-muted-foreground"
				/>
				<span className="truncate flex-1">{item.name}</span>
				{!item.isActive && (
					<Badge variant="outline" className="text-[10px] h-4 px-1">
						Inactiva
					</Badge>
				)}
				{item.showInNavbar && (
					<div
						className="size-1.5 rounded-full bg-green-500"
						title="En Navbar"
					/>
				)}
			</div>
		);
	};

	return (
		<Card className="w-full bg-muted/30 border-dashed">
			<CardHeader className="py-4">
				<CardTitle className="text-sm font-medium flex items-center gap-2">
					<HugeiconsIcon icon={ViewIcon} className="size-4" />
					Previsualización de Estructura (Navbar)
				</CardTitle>
				<p className="text-xs text-muted-foreground">
					Así se verá el orden y la jerarquía de tus categorías. Las que tienen
					el punto verde aparecerán en el Navbar.
				</p>
			</CardHeader>
			<CardContent className="pb-6">
				<div className="flex flex-col gap-1 max-w-md bg-background rounded-lg border p-2 shadow-sm">
					{tree.length > 0 ? (
						tree.map((item) => renderItem(item))
					) : (
						<div className="text-center py-8 text-muted-foreground text-sm">
							No hay categorías para mostrar.
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
