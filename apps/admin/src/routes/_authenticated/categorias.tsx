import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Category } from "@renovabit/db/schema";
import { Button } from "@renovabit/ui/components/ui/button.tsx";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { AuthenticatedHeader } from "@/components/layout/authenticated-header";
import { PageHeader } from "@/components/layout/page-header";
import { DataTableBulkDeleteAction } from "@/components/table/bulk-delete-action";
import { CategoryTreePreview } from "@/features/categories/components/CategoryTreePreview";
import { CategoryFormModal } from "@/features/categories/components/modals/CategoryFormModal";
import { DeleteCategoryModal } from "@/features/categories/components/modals/DeleteCategoryModal";
import { ToggleCategoryStatusModal } from "@/features/categories/components/modals/ToggleCategoryStatusModal";
import { CategoriesTable } from "@/features/categories/components/table/categories-table";
import {
	type CategoryWithParent,
	getColumns,
} from "@/features/categories/components/table/columns";
import {
	useBulkDeleteCategories,
	useCategories,
} from "@/features/categories/hooks";

export const Route = createFileRoute("/_authenticated/categorias")({
	component: CategoriasPage,
});

function CategoriasPage() {
	const { data: categoriesRaw, isPending } = useCategories(true);
	const categories = Array.isArray(categoriesRaw)
		? (categoriesRaw as CategoryWithParent[])
		: [];

	const hasData = categories.length > 0 || !isPending;

	const [formOpen, setFormOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
	const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
	const [deactivateCategory, setDeactivateCategory] = useState<Category | null>(
		null,
	);

	const bulkDeleteCategories = useBulkDeleteCategories();

	const handleAdd = useCallback(() => {
		setEditingCategory(null);
		setFormOpen(true);
	}, []);

	const handleEdit = useCallback((category: Category) => {
		setEditingCategory(category);
		setFormOpen(true);
	}, []);

	const handleDeleteClick = useCallback((category: Category) => {
		setDeleteCategory(category);
		setDeleteDialogOpen(true);
	}, []);

	const handleDeactivateClick = useCallback((category: Category) => {
		setDeactivateCategory(category);
		setDeactivateDialogOpen(true);
	}, []);

	const handleBulkDelete = useCallback(
		async (selectedCategories: Category[]) => {
			const ids = selectedCategories.map((c) => c.id);
			const promise = bulkDeleteCategories.mutateAsync(ids);

			toast.promise(promise, {
				loading: "Eliminando categorías...",
				success: `${selectedCategories.length} categorías eliminadas.`,
				error: "Error al eliminar categorías.",
			});

			await promise;
		},
		[bulkDeleteCategories],
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
					{ label: "Categorías" },
				]}
			/>

			<div className="flex flex-1 flex-col gap-8 p-8">
				<PageHeader
					title="Categorías"
					description="Organiza tu catálogo con categorías y subcategorías."
					actions={
						<Button onClick={handleAdd}>
							<HugeiconsIcon icon={Add01Icon} className="mr-2 size-4" />
							Nueva categoría
						</Button>
					}
				/>

				{!hasData ? (
					<div className="flex items-center justify-center py-12 text-muted-foreground">
						Cargando…
					</div>
				) : (
					<div className="space-y-8">
						<CategoriesTable
							columns={columns}
							data={categories}
							renderBulkActions={(table) => (
								<DataTableBulkDeleteAction
									table={table}
									onDelete={handleBulkDelete}
									itemName="categorías"
									itemNameSingular="categoría"
								/>
							)}
						/>

						<div>
							<h2 className="text-lg font-semibold mb-4 text-muted-foreground">
								Previsualización de Estructura
							</h2>
							<CategoryTreePreview categories={categories} />
						</div>
					</div>
				)}
			</div>

			<CategoryFormModal
				open={formOpen}
				onOpenChange={setFormOpen}
				category={editingCategory}
			/>
			<DeleteCategoryModal
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				category={deleteCategory}
			/>
			<ToggleCategoryStatusModal
				open={deactivateDialogOpen}
				onOpenChange={setDeactivateDialogOpen}
				category={deactivateCategory}
			/>
		</>
	);
}
