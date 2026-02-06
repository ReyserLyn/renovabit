import { Add01Icon } from "@hugeicons/core-free-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { AuthenticatedHeader } from "@/components/layout/authenticated-header";
import { PageHeader } from "@/components/layout/page-header";
import { PrimaryActionButton } from "@/components/layout/primary-action-button";
import { DataTableBulkDeleteAction } from "@/components/table/bulk-delete-action";
import { DataTable } from "@/components/table/data-table";
import { TableSkeleton } from "@/components/table/table-skeleton";
import { ProductFilters } from "@/features/products/components/filters/ProductFilters";
import { DeleteProductModal } from "@/features/products/components/modals/delete-product-modal";
import { ProductFormModal } from "@/features/products/components/modals/ProductFormModal";
import { ToggleProductStatusModal } from "@/features/products/components/modals/ToggleProductStatusModal";
import { getColumns } from "@/features/products/components/table/columns";
import {
	useBulkDeleteProducts,
	useProductListParams,
} from "@/features/products/hooks";
import {
	PAGE_SIZE,
	PAGE_SIZE_OPTIONS,
} from "@/features/products/parsers/product-filters";
import {
	type ProductWithRelations,
	productsKeys,
	productsQueryOptions,
} from "@/features/products/services/products-service";
import { useBreadcrumbs } from "@/libs/breadcrumbs";

export const Route = createFileRoute("/_authenticated/productos")({
	component: ProductsPage,
});

function ProductsPage() {
	const queryClient = useQueryClient();
	const breadcrumbs = useBreadcrumbs();
	const { listParams, filters, setFilters, categories, brands } =
		useProductListParams();

	const { data, isPending, isFetching } = useQuery(
		productsQueryOptions(listParams),
	);
	const products = data?.data ?? [];
	const total = data?.total ?? 0;

	const [formModalOpen, setFormModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] =
		useState<ProductWithRelations | null>(null);

	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [productToDelete, setProductToDelete] =
		useState<ProductWithRelations | null>(null);

	const [toggleStatusModalOpen, setToggleStatusModalOpen] = useState(false);
	const [productForToggle, setProductForToggle] =
		useState<ProductWithRelations | null>(null);

	const bulkDeleteMutation = useBulkDeleteProducts();

	const handleCreate = useCallback(() => {
		setEditingProduct(null);
		setFormModalOpen(true);
	}, []);

	const handleEdit = useCallback((product: ProductWithRelations) => {
		setEditingProduct(product);
		setFormModalOpen(true);
	}, []);

	const handleDuplicate = useCallback((product: ProductWithRelations) => {
		const draft: ProductWithRelations = {
			...product,
			id: "",
			slug: `${product.slug}-copia`,
			sku: `${product.sku}-copia`,
		};
		setEditingProduct(draft);
		setFormModalOpen(true);
	}, []);

	const handleDelete = useCallback((product: ProductWithRelations) => {
		setProductToDelete(product);
		setDeleteModalOpen(true);
	}, []);

	const handleToggleStatus = useCallback((product: ProductWithRelations) => {
		setProductForToggle(product);
		setToggleStatusModalOpen(true);
	}, []);

	const handleBulkDelete = useCallback(
		async (selected: ProductWithRelations[]) => {
			const ids = selected.map((p) => p.id);
			const promise = bulkDeleteMutation.mutateAsync(ids);
			toast.promise(promise, {
				loading: "Eliminando productos…",
				success: `${selected.length} producto(s) eliminados.`,
				error: "No se pudieron eliminar los productos. Vuelve a intentarlo.",
			});
			await promise;
		},
		[bulkDeleteMutation],
	);

	const handlePageChange = useCallback(
		(page: number) => {
			setFilters((prev) => ({ ...prev, page }));
		},
		[setFilters],
	);

	const handlePageSizeChange = useCallback(
		(pageSize: number) => {
			setFilters((prev) => ({ ...prev, pageSize, page: 0 }));
		},
		[setFilters],
	);

	const handleRefresh = useCallback(() => {
		queryClient.invalidateQueries({ queryKey: productsKeys.all });
	}, [queryClient]);

	const handleToggleStatusModalOpenChange = useCallback((open: boolean) => {
		setToggleStatusModalOpen(open);
		if (!open) setProductForToggle(null);
	}, []);

	const columns = useMemo(
		() =>
			getColumns({
				onEdit: handleEdit,
				onDelete: handleDelete,
				onToggleStatus: handleToggleStatus,
				onDuplicate: handleDuplicate,
			}),
		[handleEdit, handleDelete, handleToggleStatus, handleDuplicate],
	);

	const serverPagination = useMemo(
		() => ({
			total,
			pageIndex: filters.page,
			pageSize: PAGE_SIZE_OPTIONS.includes(
				filters.pageSize as (typeof PAGE_SIZE_OPTIONS)[number],
			)
				? filters.pageSize
				: PAGE_SIZE,
			onPageChange: handlePageChange,
			pageSizeOptions: [...PAGE_SIZE_OPTIONS],
			onPageSizeChange: handlePageSizeChange,
		}),
		[
			total,
			filters.page,
			filters.pageSize,
			handlePageChange,
			handlePageSizeChange,
		],
	);

	return (
		<>
			<AuthenticatedHeader breadcrumbs={breadcrumbs} />

			<div className="flex flex-1 flex-col gap-8 p-8">
				<PageHeader
					title="Productos"
					description="Gestiona el catálogo de productos de tu tienda."
					actions={
						<PrimaryActionButton icon={Add01Icon} onClick={handleCreate}>
							Nuevo Producto
						</PrimaryActionButton>
					}
				/>

				{isPending ? (
					<div className="space-y-4" aria-busy="true" aria-live="polite">
						<div className="sr-only">Cargando productos…</div>
						<TableSkeleton columnCount={8} rowCount={8} />
					</div>
				) : (
					<DataTable
						columns={columns}
						data={products}
						emptyMessage="No hay productos. Añade uno para comenzar."
						emptyActionLabel="Crear primer producto"
						onEmptyAction={handleCreate}
						filterPlaceholder="Filtrar productos por nombre…"
						defaultSorting={[{ id: "createdAt", desc: true }]}
						filterSlot={
							<ProductFilters categories={categories} brands={brands} />
						}
						serverPagination={serverPagination}
						onRefresh={handleRefresh}
						isRefreshing={isFetching}
						refreshAriaLabel="Actualizar lista de productos"
						renderBulkActions={(table) => (
							<DataTableBulkDeleteAction
								table={table}
								onDelete={handleBulkDelete}
								itemName="productos"
								itemNameSingular="producto"
							/>
						)}
					/>
				)}

				<ProductFormModal
					open={formModalOpen}
					onOpenChange={setFormModalOpen}
					product={editingProduct}
				/>

				<DeleteProductModal
					open={deleteModalOpen}
					onOpenChange={(open) => {
						setDeleteModalOpen(open);
						if (!open) setProductToDelete(null);
					}}
					product={productToDelete}
				/>

				<ToggleProductStatusModal
					open={toggleStatusModalOpen}
					onOpenChange={handleToggleStatusModalOpenChange}
					product={productForToggle}
				/>
			</div>
		</>
	);
}
