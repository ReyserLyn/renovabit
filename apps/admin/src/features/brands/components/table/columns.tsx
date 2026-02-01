import {
	ArchiveArrowDownIcon,
	ArchiveArrowUpIcon,
	Delete04Icon,
	Edit02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Brand } from "@renovabit/db/schema";
import { Badge } from "@renovabit/ui/components/ui/badge.js";
import { Button } from "@renovabit/ui/components/ui/button.js";
import { Checkbox } from "@renovabit/ui/components/ui/checkbox.tsx";
import { cn } from "@renovabit/ui/lib/utils.js";
import { ColumnDef } from "@tanstack/react-table";
import { ColumnHeader } from "@/components/table/column-header";
import { formatDate } from "@/libs/utils";

export type BrandsTableHandlers = {
	onEdit: (brand: Brand) => void;
	onDelete: (brand: Brand) => void;
	onDeactivate: (brand: Brand) => void;
};

export function getColumns(handlers: BrandsTableHandlers): ColumnDef<Brand>[] {
	const { onEdit, onDelete, onDeactivate } = handlers;

	return [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						table.getIsSomePageRowsSelected()
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "name",
			meta: { label: "Nombre" },
			header: ({ column }) => <ColumnHeader column={column} title="Nombre" />,
			cell: ({ row }) => (
				<span
					className={cn(
						"font-medium truncate max-w-[180px] block",
						!row.original.isActive && "text-muted-foreground",
					)}
				>
					{row.original.name}
				</span>
			),
		},
		{
			accessorKey: "slug",
			meta: { label: "Slug" },
			header: ({ column }) => <ColumnHeader column={column} title="Slug" />,
			cell: ({ row }) => (
				<span className="text-muted-foreground truncate max-w-[140px] block">
					{row.original.slug}
				</span>
			),
		},
		{
			accessorKey: "logo",
			meta: { label: "Logo" },
			header: ({ column }) => <ColumnHeader column={column} title="Logo" />,
			cell: ({ row }) => {
				const url = row.original.logo;

				if (!url) return <span className="text-muted-foreground">—</span>;

				return (
					<div className="flex items-center justify-center size-10 rounded-lg border bg-muted/30 overflow-hidden">
						<img
							src={url}
							alt=""
							className="h-full w-full object-cover"
							loading="lazy"
							onError={(e) => {
								const target = e.target as HTMLImageElement;
								if (!target.src.includes("ui-avatars")) {
									target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(row.original.name)}&background=random`;
								}
							}}
						/>
					</div>
				);
			},
		},
		{
			accessorKey: "isActive",
			meta: { label: "Estado" },
			header: ({ column }) => <ColumnHeader column={column} title="Estado" />,
			cell: ({ row }) => {
				const active = row.original.isActive;

				return (
					<Badge variant={active ? "default" : "secondary"}>
						{active ? "Activa" : "Inactiva"}
					</Badge>
				);
			},
		},
		{
			accessorKey: "createdAt",
			meta: { label: "Fecha" },
			header: ({ column }) => <ColumnHeader column={column} title="Fecha" />,
			cell: ({ row }) => formatDate(row.original.createdAt),
		},
		{
			id: "actions",
			header: "Acciones",
			cell: ({ row }) => {
				const brand = row.original;

				return (
					<div
						className="flex items-center gap-2"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.stopPropagation()}
					>
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onEdit(brand);
							}}
							aria-label={`Editar ${brand.name}`}
						>
							<HugeiconsIcon icon={Edit02Icon} />
						</Button>

						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onDeactivate(brand);
							}}
							aria-label={
								brand.isActive
									? `Desactivar ${brand.name}`
									: `Activar ${brand.name}`
							}
						>
							<HugeiconsIcon
								icon={
									brand.isActive ? ArchiveArrowDownIcon : ArchiveArrowUpIcon
								}
							/>
						</Button>

						<Button
							type="button"
							variant="destructive"
							size="icon-sm"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onDelete(brand);
							}}
							aria-label={`Eliminar ${brand.name}`}
						>
							<HugeiconsIcon icon={Delete04Icon} />
						</Button>
					</div>
				);
			},
		},
	];
}
