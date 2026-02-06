import {
	AlertCircleIcon,
	Cancel01Icon,
	Tick01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@renovabit/ui/lib/utils.js";

export type StatusVariant = "success" | "muted" | "warning";

const variantStyles: Record<
	StatusVariant,
	{ container: string; icon: typeof Tick01Icon }
> = {
	success: {
		container: "bg-emerald-100 text-emerald-600",
		icon: Tick01Icon,
	},
	muted: {
		container: "bg-muted text-muted-foreground",
		icon: Cancel01Icon,
	},
	warning: {
		container: "bg-amber-100 text-amber-600",
		icon: AlertCircleIcon,
	},
};

type StatusCellProps = {
	label: string;
	variant: StatusVariant;
	className?: string;
};

/** Celda de estado unificada: icono + label para tablas (Productos, Categorías, Marcas). */
export function StatusCell({ label, variant, className }: StatusCellProps) {
	const { container, icon } = variantStyles[variant];
	return (
		<div className={cn("flex items-center gap-2", className)} title={label}>
			<div
				className={cn(
					"flex shrink-0 items-center justify-center size-6 rounded-full",
					container,
				)}
			>
				<HugeiconsIcon icon={icon} className="size-4" />
			</div>
			<span className="text-sm truncate">{label}</span>
		</div>
	);
}
