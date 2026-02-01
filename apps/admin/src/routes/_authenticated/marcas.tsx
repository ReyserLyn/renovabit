import type { Brand } from "@renovabit/db/schema";
import { Button } from "@renovabit/ui/components/ui/button.tsx";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { AuthenticatedHeader } from "@/components/layout/authenticated-header";
import { BrandFormModal } from "@/features/brands/components/forms/BrandFormModal";
import { DeleteBrandModal } from "@/features/brands/components/modals/DeleteBrandModal";
import { ToggleBrandStatusModal } from "@/features/brands/components/modals/ToggleBrandStatusModal";
import { BrandsTable } from "@/features/brands/components/table/brands-table";
import { getColumns } from "@/features/brands/components/table/columns";
import { useBrands } from "@/features/brands/hooks";

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

			<div className="flex flex-1 flex-col gap-4 p-4">
				<div className="flex items-center justify-between">
					<h1 className="text-xl font-semibold tracking-tight">Marcas</h1>
					<Button onClick={handleAdd}>Añadir marca</Button>
				</div>

				{!hasData ? (
					<div className="flex items-center justify-center py-12 text-muted-foreground">
						Cargando…
					</div>
				) : (
					<BrandsTable columns={columns} data={brands} />
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
