import {
	ArchiveArrowDownIcon,
	ArchiveArrowUpIcon,
	Delete04Icon,
	Edit02Icon,
	ViewIcon,
	ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@renovabit/ui/components/ui/button";
import { Checkbox } from "@renovabit/ui/components/ui/checkbox";
import { cn } from "@renovabit/ui/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Image } from "@unpic/react";
import { ColumnHeader } from "@/components/table/column-header";
import { StatusCell } from "@/components/table/status-cell";
import { getCloudflareTransformUrl } from "@/libs/cloudflare-transform";
import { CategoryTree } from "../../model/category-model";

export type CategoryColumnHandlers = {
	onEdit: (category: CategoryTree) => void;
	onDelete: (category: CategoryTree) => void;
	onDeactivate: (category: CategoryTree) => void;
};

export function getColumns(
	handlers: CategoryColumnHandlers,
): ColumnDef<CategoryTree>[] {
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
						"font-medium truncate max-w-[200px] block",
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
				<span className="text-muted-foreground truncate max-w-[150px] block">
					{row.original.slug}
				</span>
			),
		},
		{
			accessorKey: "imageUrl",
			meta: { label: "Imagen" },
			header: ({ column }) => <ColumnHeader column={column} title="Imagen" />,
			cell: ({ row }) => {
				const url = row.original.imageUrl;

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
			id: "parent",
			accessorKey: "parent.name",
			meta: { label: "Padre" },
			header: ({ column }) => <ColumnHeader column={column} title="Padre" />,
			cell: ({ row }) => {
				const parentName = row.original.parent?.name;
				return (
					<span className="text-muted-foreground truncate max-w-[150px] block">
						{parentName || <span className="text-muted-foreground/50">—</span>}
					</span>
				);
			},
		},
		{
			accessorKey: "order",
			meta: { label: "Orden" },
			header: ({ column }) => <ColumnHeader column={column} title="Orden" />,
			cell: ({ row }) => (
				<span className="text-muted-foreground">{row.original.order}</span>
			),
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
			accessorKey: "showInNavbar",
			meta: { label: "Navbar" },
			header: ({ column }) => <ColumnHeader column={column} title="Navbar" />,
			cell: ({ row }) => {
				const inNavbar = row.original.showInNavbar;
				const active = row.original.isActive;

				if (!active) {
					return <span className="text-muted-foreground/30 flex">-</span>;
				}

				return (
					<>
						{inNavbar ? (
							<div title="Visible en Navbar" className="text-blue-600">
								<HugeiconsIcon icon={ViewIcon} className="size-5" />
							</div>
						) : (
							<div
								title="Oculto en Navbar"
								className="text-muted-foreground/50"
							>
								<HugeiconsIcon icon={ViewOffIcon} className="size-5" />
							</div>
						)}
					</>
				);
			},
		},
		{
			id: "actions",
			header: "Acciones",
			cell: ({ row }) => {
				const category = row.original;

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
								onEdit(category);
							}}
							aria-label={`Editar ${category.name}`}
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
								onDeactivate(category);
							}}
							aria-label={
								category.isActive
									? `Desactivar ${category.name}`
									: `Activar ${category.name}`
							}
						>
							<HugeiconsIcon
								icon={
									category.isActive ? ArchiveArrowDownIcon : ArchiveArrowUpIcon
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
								onDelete(category);
							}}
							aria-label={`Eliminar ${category.name}`}
						>
							<HugeiconsIcon icon={Delete04Icon} />
						</Button>
					</div>
				);
			},
		},
	];
}
