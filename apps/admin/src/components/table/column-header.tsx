import {
	ArrowDown01Icon,
	ArrowUp01Icon,
	Sorting05Icon,
	ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@renovabit/ui/components/ui/button.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@renovabit/ui/components/ui/dropdown-menu.tsx";
import { cn } from "@renovabit/ui/lib/utils.ts";
import { type Column } from "@tanstack/react-table";

interface ColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
}

export function ColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: ColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>;
	}

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							variant="ghost"
							size="sm"
							className="data-[state=open]:bg-accent -ml-3 h-8"
						>
							<span>{title}</span>
							{column.getIsSorted() === "desc" ? (
								<HugeiconsIcon icon={ArrowDown01Icon} />
							) : column.getIsSorted() === "asc" ? (
								<HugeiconsIcon icon={ArrowUp01Icon} />
							) : (
								<HugeiconsIcon icon={Sorting05Icon} />
							)}
						</Button>
					}
				></DropdownMenuTrigger>

				<DropdownMenuContent align="start">
					<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
						<HugeiconsIcon icon={ArrowUp01Icon} />
						Asc
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
						<HugeiconsIcon icon={ArrowDown01Icon} />
						Desc
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
						<HugeiconsIcon icon={ViewOffSlashIcon} />
						Ocultar
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
