import { Add01Icon } from "@hugeicons/core-free-icons";
import type { Brand } from "@renovabit/db/schema";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { AuthenticatedHeader } from "@/components/layout/authenticated-header";
import { PageHeader } from "@/components/layout/page-header";
import { PrimaryActionButton } from "@/components/layout/primary-action-button";
import { DataTableBulkDeleteAction } from "@/components/table/bulk-delete-action";
import { DataTable } from "@/components/table/data-table";
import { TableSkeleton } from "@/components/table/table-skeleton";
import { BrandFormModal } from "@/features/brands/components/forms/BrandFormModal";
import { DeleteBrandModal } from "@/features/brands/components/modals/DeleteBrandModal";
import { ToggleBrandStatusModal } from "@/features/brands/components/modals/ToggleBrandStatusModal";
import { getColumns } from "@/features/brands/components/table/columns";
import { useBrands, useBulkDeleteBrands } from "@/features/brands/hooks";
import { brandsKeys } from "@/features/brands/services/brands-service";
import { useBreadcrumbs } from "@/libs/breadcrumbs";

export const Route = createFileRoute("/_authenticated/marcas")({
	component: MarcasPage,
});

function MarcasPage() {
	const queryClient = useQueryClient();
	const breadcrumbs = useBreadcrumbs();
	const { data: brandsRaw, isPending, isFetching } = useBrands(true);
	const brands = Array.isArray(brandsRaw) ? brandsRaw : [];
	const hasData = brands.length > 0 || !isPending;

	const [formModalOpen, setFormModalOpen] = useState(false);
	const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
	const [toggleStatusModalOpen, setToggleStatusModalOpen] = useState(false);
	const [brandForToggle, setBrandForToggle] = useState<Brand | null>(null);

	const bulkDeleteBrands = useBulkDeleteBrands();

	const handleAdd = useCallback(() => {
		setEditingBrand(null);
		setFormModalOpen(true);
	}, []);

	const handleEdit = useCallback((brand: Brand) => {
		setEditingBrand(brand);
		setFormModalOpen(true);
	}, []);

	const handleDelete = useCallback((brand: Brand) => {
		setBrandToDelete(brand);
		setDeleteModalOpen(true);
	}, []);

	const handleToggleStatus = useCallback((brand: Brand) => {
		setBrandForToggle(brand);
		setToggleStatusModalOpen(true);
	}, []);

	const handleBulkDelete = useCallback(
		async (selectedBrands: Brand[]) => {
			const ids = selectedBrands.map((b) => b.id);
			const promise = bulkDeleteBrands.mutateAsync(ids);

			toast.promise(promise, {
				loading: "Eliminando marcas…",
				success: `${selectedBrands.length} marcas eliminadas.`,
				error: "Error al eliminar marcas.",
			});

			await promise;
		},
		[bulkDeleteBrands],
	);

	const columns = useMemo(
		() =>
			getColumns({
				onEdit: handleEdit,
				onDelete: handleDelete,
				onDeactivate: handleToggleStatus,
			}),
		[handleEdit, handleDelete, handleToggleStatus],
	);

	return (
		<>
			<AuthenticatedHeader breadcrumbs={breadcrumbs} />

			<div className="flex flex-1 flex-col gap-8 p-8">
				<PageHeader
					title="Marcas"
					description="Gestiona las marcas asociadas a tus productos."
					actions={
						<PrimaryActionButton icon={Add01Icon} onClick={handleAdd}>
							Nueva marca
						</PrimaryActionButton>
					}
				/>

				{!hasData ? (
					<div className="space-y-4" aria-busy="true" aria-live="polite">
						<div className="sr-only">Cargando marcas…</div>
						<TableSkeleton columnCount={5} rowCount={8} />
					</div>
				) : (
					<DataTable
						columns={columns}
						data={brands}
						emptyMessage="No hay marcas. Añade una para comenzar."
						emptyActionLabel="Crear primera marca"
						onEmptyAction={handleAdd}
						filterPlaceholder="Filtrar marcas por nombre…"
						onRefresh={() =>
							queryClient.invalidateQueries({ queryKey: brandsKeys.all })
						}
						isRefreshing={isFetching}
						refreshAriaLabel="Actualizar lista de marcas"
						renderBulkActions={(table) => (
							<DataTableBulkDeleteAction
								table={table}
								onDelete={handleBulkDelete}
								itemName="marcas"
								itemNameSingular="marca"
							/>
						)}
					/>
				)}
			</div>

			<BrandFormModal
				open={formModalOpen}
				onOpenChange={setFormModalOpen}
				brand={editingBrand}
			/>
			<DeleteBrandModal
				open={deleteModalOpen}
				onOpenChange={(open) => {
					setDeleteModalOpen(open);
					if (!open) setBrandToDelete(null);
				}}
				brand={brandToDelete}
			/>
			<ToggleBrandStatusModal
				open={toggleStatusModalOpen}
				onOpenChange={(open) => {
					setToggleStatusModalOpen(open);
					if (!open) setBrandForToggle(null);
				}}
				brand={brandForToggle}
			/>
		</>
	);
}
