import {
	ArchiveArrowDownIcon,
	ArchiveArrowUpIcon,
	Copy01Icon,
	Delete04Icon,
	Edit02Icon,
	StarIcon,
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
import { STATUS_LABELS } from "../../models/product-model";
import { ProductWithRelations } from "../../services/products-service";

export type ProductColumnHandlers = {
	onEdit: (product: ProductWithRelations) => void;
	onDelete: (product: ProductWithRelations) => void;
	onToggleStatus: (product: ProductWithRelations) => void;
	onDuplicate?: (product: ProductWithRelations) => void;
};

export function getColumns(
	handlers: ProductColumnHandlers,
): ColumnDef<ProductWithRelations>[] {
	const { onEdit, onDelete, onToggleStatus, onDuplicate } = handlers;

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
				<div className="flex flex-col min-w-0">
					<span
						className={cn(
							"font-medium truncate max-w-[200px] block",
							row.original.status !== "active" && "text-muted-foreground",
						)}
					>
						{row.original.name}
					</span>
					<span className="text-xs text-muted-foreground truncate max-w-[200px] block">
						SKU: {row.original.sku}
					</span>
				</div>
			),
		},
		{
			id: "image",
			meta: { label: "Imágenes" },
			header: ({ column }) => <ColumnHeader column={column} title="Imágenes" />,
			cell: ({ row }) => {
				const images = row.original.images ?? [];
				if (images.length === 0)
					return <span className="text-muted-foreground">—</span>;

				const thumbOpts = {
					width: 36,
					height: 36,
					fit: "contain" as const,
					format: "auto" as const,
				};

				return (
					<div className="flex items-center gap-0.5">
						{images.slice(0, 4).map((img, i) => (
							<div
								key={img.id ?? i}
								className="shrink-0 size-9 rounded-md border bg-muted/30 overflow-hidden flex items-center justify-center [&_img]:max-w-full [&_img]:max-h-full [&_img]:w-auto [&_img]:h-auto [&_img]:object-contain"
							>
								<Image
									src={getCloudflareTransformUrl(img.url, thumbOpts)}
									alt={img.alt ?? row.original.name}
									width={36}
									height={36}
									layout="constrained"
									objectFit="contain"
									background="auto"
								/>
							</div>
						))}
						{images.length > 4 && (
							<span className="text-xs text-muted-foreground shrink-0 px-1">
								+{images.length - 4}
							</span>
						)}
					</div>
				);
			},
		},
		{
			accessorKey: "brand.name",
			meta: { label: "Marca" },
			header: ({ column }) => <ColumnHeader column={column} title="Marca" />,
			cell: ({ row }) => {
				const brandName = row.original.brand?.name;
				return (
					<span className="text-muted-foreground truncate max-w-[150px] block">
						{brandName || <span className="text-muted-foreground/50">—</span>}
					</span>
				);
			},
		},
		{
			accessorKey: "price",
			meta: { label: "Precio" },
			header: ({ column }) => <ColumnHeader column={column} title="Precio" />,
			cell: ({ row }) => {
				const price = parseFloat(row.original.price);
				return (
					<span className="font-medium">
						{new Intl.NumberFormat("es-PE", {
							style: "currency",
							currency: "PEN",
						}).format(price)}
					</span>
				);
			},
		},
		{
			accessorKey: "stock",
			meta: { label: "Stock" },
			header: ({ column }) => <ColumnHeader column={column} title="Stock" />,
			cell: ({ row }) => {
				const stock = row.original.stock;
				return (
					<span
						className={cn(
							"font-medium",
							stock === 0 ? "text-red-500" : stock < 5 ? "text-yellow-500" : "",
						)}
					>
						{stock}
					</span>
				);
			},
		},
		{
			accessorKey: "status",
			meta: { label: "Estado" },
			header: ({ column }) => <ColumnHeader column={column} title="Estado" />,
			cell: ({ row }) => {
				const status = row.original.status;
				const variant =
					status === "active"
						? "success"
						: status === "out_of_stock"
							? "warning"
							: "muted";
				return <StatusCell label={STATUS_LABELS[status]} variant={variant} />;
			},
		},
		{
			accessorKey: "isFeatured",
			meta: { label: "Destacado" },
			header: ({ column }) => (
				<ColumnHeader column={column} title="Destacado" />
			),
			cell: ({ row }) => {
				return row.original.isFeatured ? (
					<HugeiconsIcon icon={StarIcon} className="size-5 text-yellow-400" />
				) : null;
			},
		},
		{
			id: "actions",
			header: "Acciones",
			cell: ({ row }) => {
				const product = row.original;

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
								onEdit(product);
							}}
							aria-label={`Editar ${product.name}`}
						>
							<HugeiconsIcon icon={Edit02Icon} />
						</Button>

						{onDuplicate && (
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									onDuplicate(product);
								}}
								aria-label={`Duplicar ${product.name}`}
							>
								<HugeiconsIcon icon={Copy01Icon} />
							</Button>
						)}

						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onToggleStatus(product);
							}}
							aria-label={
								product.status === "active"
									? `Desactivar ${product.name}`
									: `Activar ${product.name}`
							}
						>
							<HugeiconsIcon
								icon={
									product.status === "active"
										? ArchiveArrowDownIcon
										: ArchiveArrowUpIcon
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
								onDelete(product);
							}}
							aria-label={`Eliminar ${product.name}`}
						>
							<HugeiconsIcon icon={Delete04Icon} />
						</Button>
					</div>
				);
			},
		},
	];
}
