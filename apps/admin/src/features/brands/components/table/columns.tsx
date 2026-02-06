import {
	ArchiveArrowDownIcon,
	ArchiveArrowUpIcon,
	Delete04Icon,
	Edit02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Brand } from "@renovabit/db/schema";
import { Button } from "@renovabit/ui/components/ui/button";
import { Checkbox } from "@renovabit/ui/components/ui/checkbox";
import { cn } from "@renovabit/ui/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Image } from "@unpic/react";
import { ColumnHeader } from "@/components/table/column-header";
import { StatusCell } from "@/components/table/status-cell";
import { getCloudflareTransformUrl } from "@/libs/cloudflare-transform";
import { formatDate } from "@/libs/utils";

export type BrandColumnHandlers = {
	onEdit: (brand: Brand) => void;
	onDelete: (brand: Brand) => void;
	onDeactivate: (brand: Brand) => void;
};

export function getColumns(handlers: BrandColumnHandlers): ColumnDef<Brand>[] {
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
					aria-label="Seleccionar todos"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Seleccionar fila"
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
				const imageSrc = getCloudflareTransformUrl(url, {
					width: 40,
					height: 40,
					fit: "contain",
					format: "auto",
				});

				return (
					<div className="flex items-center justify-center size-10 rounded-lg border bg-muted/30 overflow-hidden">
						<Image
							src={imageSrc}
							alt={row.original.name}
							width={40}
							height={40}
							layout="constrained"
							objectFit="contain"
							background="auto"
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
					<StatusCell
						label={active ? "Activa" : "Inactiva"}
						variant={active ? "success" : "muted"}
					/>
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
