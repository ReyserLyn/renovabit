import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Brand } from "@renovabit/db/schema";
import { Button } from "@renovabit/ui/components/ui/button.tsx";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { AuthenticatedHeader } from "@/components/layout/authenticated-header";
import { PageHeader } from "@/components/layout/page-header";
import { DataTableBulkDeleteAction } from "@/components/table/bulk-delete-action";
import { BrandFormModal } from "@/features/brands/components/forms/BrandFormModal";
import { DeleteBrandModal } from "@/features/brands/components/modals/DeleteBrandModal";
import { ToggleBrandStatusModal } from "@/features/brands/components/modals/ToggleBrandStatusModal";
import { BrandsTable } from "@/features/brands/components/table/brands-table";
import { getColumns } from "@/features/brands/components/table/columns";
import { useBrands, useBulkDeleteBrands } from "@/features/brands/hooks";

export const Route = createFileRoute("/_authenticated/marcas")({
	component: MarcasPage,
});

function MarcasPage() {
	const { data: brandsRaw, isPending } = useBrands(true);
	const brands = Array.isArray(brandsRaw) ? brandsRaw : [];
	const hasData = brands.length > 0 || !isPending;

	const [formOpen, setFormOpen] = useState(false);
	const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deleteBrand, setDeleteBrand] = useState<Brand | null>(null);
	const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
	const [deactivateBrand, setDeactivateBrand] = useState<Brand | null>(null);

	const bulkDeleteBrands = useBulkDeleteBrands();

	const handleAdd = useCallback(() => {
		setEditingBrand(null);
		setFormOpen(true);
	}, []);

	const handleEdit = useCallback((brand: Brand) => {
		setEditingBrand(brand);
		setFormOpen(true);
	}, []);

	const handleDeleteClick = useCallback((brand: Brand) => {
		setDeleteBrand(brand);
		setDeleteDialogOpen(true);
	}, []);

	const handleDeactivateClick = useCallback((brand: Brand) => {
		setDeactivateBrand(brand);
		setDeactivateDialogOpen(true);
	}, []);

	const handleBulkDelete = useCallback(
		async (selectedBrands: Brand[]) => {
			const ids = selectedBrands.map((b) => b.id);
			const promise = bulkDeleteBrands.mutateAsync(ids);

			toast.promise(promise, {
				loading: "Eliminando marcas...",
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
				onDelete: handleDeleteClick,
				onDeactivate: handleDeactivateClick,
			}),
		[handleEdit, handleDeleteClick, handleDeactivateClick],
	);

	return (
		<>
			<AuthenticatedHeader
				breadcrumbs={[
					{ label: "Panel de Administración", to: "/" },
					{ label: "Marcas" },
				]}
			/>

			<div className="flex flex-1 flex-col gap-8 p-8">
				<PageHeader
					title="Marcas"
					description="Gestiona las marcas asociadas a tus productos."
					actions={
						<Button onClick={handleAdd}>
							<HugeiconsIcon icon={Add01Icon} className="mr-2 size-4" />
							Nueva marca
						</Button>
					}
				/>

				{!hasData ? (
					<div className="flex items-center justify-center py-12 text-muted-foreground">
						Cargando…
					</div>
				) : (
					<BrandsTable
						columns={columns}
						data={brands}
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
				open={formOpen}
				onOpenChange={setFormOpen}
				brand={editingBrand}
			/>
			<DeleteBrandModal
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				brand={deleteBrand}
			/>
			<ToggleBrandStatusModal
				open={deactivateDialogOpen}
				onOpenChange={setDeactivateDialogOpen}
				brand={deactivateBrand}
			/>
		</>
	);
}
