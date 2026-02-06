import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@renovabit/ui/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { AuthenticatedHeader } from "@/components/layout/authenticated-header";
import { PageHeader } from "@/components/layout/page-header";
import { DataTableBulkDeleteAction } from "@/components/table/bulk-delete-action";
import { useBrands } from "@/features/brands/hooks";
import { useCategories } from "@/features/categories/hooks";
import { ProductFilters } from "@/features/products/components/filters/ProductFilters";
import { DeleteProductModal } from "@/features/products/components/modals/delete-product-modal";
import { ProductFormModal } from "@/features/products/components/modals/ProductFormModal";
import { ToggleProductStatusModal } from "@/features/products/components/modals/ToggleProductStatusModal";
import { getColumns } from "@/features/products/components/table/columns";
import { ProductsTable } from "@/features/products/components/table/products-table";
import { useBulkDeleteProducts } from "@/features/products/hooks";
import {
	getProductListParamsFromFilters,
	PAGE_SIZE,
	useProductFilters,
} from "@/features/products/parsers/product-filters";
import type { ProductListParams } from "@/features/products/services/products-service";
import {
	deleteProduct,
	type ProductWithRelations,
	productsQueryOptions,
} from "@/features/products/services/products-service";

export const Route = createFileRoute("/_authenticated/productos")({
	component: ProductsPage,
});

function ProductsPage() {
	const queryClient = useQueryClient();
	const [filters, setFilters] = useProductFilters();
	const { data: categoriesRaw = [] } = useCategories(true);
	const { data: brandsRaw = [] } = useBrands(true);

	const categories = Array.isArray(categoriesRaw) ? categoriesRaw : [];
	const brands = Array.isArray(brandsRaw) ? brandsRaw : [];

	const listParams = useMemo((): ProductListParams => {
		const base = getProductListParamsFromFilters(filters);
		const categoryId =
			base.category &&
			(categories as { slug: string; id: string }[]).find(
				(c) => c.slug === base.category,
			)?.id;
		const brandId =
			base.brand &&
			(brands as { slug: string; id: string }[]).find(
				(b) => b.slug === base.brand,
			)?.id;
		return {
			categoryId,
			brandId,
			includeInactive: base.includeInactive,
			limit: base.limit,
			offset: base.offset,
		};
	}, [filters, categories, brands]);

	const { data, isPending, isFetching } = useQuery(
		productsQueryOptions(listParams),
	);
	const products = data?.data ?? [];
	const total = data?.total ?? 0;

	const [formModalOpen, setFormModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] =
		useState<ProductWithRelations | null>(null);

	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] =
		useState<ProductWithRelations | null>(null);

	const [toggleStatusModalOpen, setToggleStatusModalOpen] = useState(false);
	const [productForToggle, setProductForToggle] =
		useState<ProductWithRelations | null>(null);

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteProduct(id),
		onSuccess: () => {
			toast.success("Producto eliminado correctamente");
			queryClient.invalidateQueries({ queryKey: ["products"] });
			setDeleteModalOpen(false);
			setSelectedProduct(null);
		},
		onError: () => {
			toast.error("No se pudo eliminar el producto. Vuelve a intentarlo.");
		},
	});

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
		setSelectedProduct(product);
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
			pageSize: PAGE_SIZE,
			onPageChange: handlePageChange,
		}),
		[total, filters.page, handlePageChange],
	);

	return (
		<>
			<AuthenticatedHeader
				breadcrumbs={[
					{ label: "Panel de Administración", to: "/" },
					{ label: "Productos" },
				]}
			/>

			<div className="flex flex-1 flex-col gap-8 p-8">
				<PageHeader
					title="Productos"
					description="Gestiona el catálogo de productos de tu tienda."
					actions={
						<Button onClick={handleCreate}>
							<HugeiconsIcon icon={Add01Icon} className="mr-2 size-4" />
							Nuevo Producto
						</Button>
					}
				/>

				{isPending ? (
					<div className="flex justify-center py-12 text-muted-foreground">
						Cargando productos…
					</div>
				) : (
					<ProductsTable
						columns={columns}
						data={products}
						onRefresh={() =>
							queryClient.invalidateQueries({ queryKey: ["products"] })
						}
						isRefreshing={isFetching}
						filterSlot={<ProductFilters />}
						serverPagination={serverPagination}
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
					onOpenChange={setDeleteModalOpen}
					onConfirm={() => {
						if (selectedProduct) {
							deleteMutation.mutate(selectedProduct.id);
						}
					}}
					isPending={deleteMutation.isPending}
					productName={selectedProduct?.name}
				/>

				<ToggleProductStatusModal
					open={toggleStatusModalOpen}
					onOpenChange={(open) => {
						setToggleStatusModalOpen(open);
						if (!open) setProductForToggle(null);
					}}
					product={productForToggle}
				/>
			</div>
		</>
	);
}
