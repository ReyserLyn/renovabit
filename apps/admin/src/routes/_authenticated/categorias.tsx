import { Add01Icon } from "@hugeicons/core-free-icons";
import type { Category } from "@renovabit/db/schema";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { AuthenticatedHeader } from "@/components/layout/authenticated-header";
import { PageHeader } from "@/components/layout/page-header";
import { PrimaryActionButton } from "@/components/layout/primary-action-button";
import { SectionTitle } from "@/components/layout/section-title";
import { DataTableBulkDeleteAction } from "@/components/table/bulk-delete-action";
import { DataTable } from "@/components/table/data-table";
import { TableSkeleton } from "@/components/table/table-skeleton";
import { CategoryTreePreview } from "@/features/categories/components/CategoryTreePreview";
import { CategoryFormModal } from "@/features/categories/components/modals/CategoryFormModal";
import { DeleteCategoryModal } from "@/features/categories/components/modals/DeleteCategoryModal";
import { ToggleCategoryStatusModal } from "@/features/categories/components/modals/ToggleCategoryStatusModal";
import {
	type CategoryWithParent,
	getColumns,
} from "@/features/categories/components/table/columns";
import {
	useBulkDeleteCategories,
	useCategories,
} from "@/features/categories/hooks";
import { categoriesKeys } from "@/features/categories/services/categories-service";
import { useBreadcrumbs } from "@/libs/breadcrumbs";

export const Route = createFileRoute("/_authenticated/categorias")({
	component: CategoriasPage,
});

function CategoriasPage() {
	const queryClient = useQueryClient();
	const breadcrumbs = useBreadcrumbs();
	const { data: categoriesRaw, isPending, isFetching } = useCategories(true);
	const categories = Array.isArray(categoriesRaw)
		? (categoriesRaw as CategoryWithParent[])
		: [];

	const hasData = categories.length > 0 || !isPending;

	const [formModalOpen, setFormModalOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
		null,
	);
	const [toggleStatusModalOpen, setToggleStatusModalOpen] = useState(false);
	const [categoryForToggle, setCategoryForToggle] = useState<Category | null>(
		null,
	);

	const bulkDeleteCategories = useBulkDeleteCategories();

	const handleAdd = useCallback(() => {
		setEditingCategory(null);
		setFormModalOpen(true);
	}, []);

	const handleEdit = useCallback((category: Category) => {
		setEditingCategory(category);
		setFormModalOpen(true);
	}, []);

	const handleDelete = useCallback((category: Category) => {
		setCategoryToDelete(category);
		setDeleteModalOpen(true);
	}, []);

	const handleToggleStatus = useCallback((category: Category) => {
		setCategoryForToggle(category);
		setToggleStatusModalOpen(true);
	}, []);

	const handleBulkDelete = useCallback(
		async (selectedCategories: Category[]) => {
			const ids = selectedCategories.map((c) => c.id);
			const promise = bulkDeleteCategories.mutateAsync(ids);

			toast.promise(promise, {
				loading: "Eliminando categorías…",
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
					title="Categorías"
					description="Organiza tu catálogo con categorías y subcategorías."
					actions={
						<PrimaryActionButton icon={Add01Icon} onClick={handleAdd}>
							Nueva categoría
						</PrimaryActionButton>
					}
				/>

				{!hasData ? (
					<div className="space-y-4" aria-busy="true" aria-live="polite">
						<div className="sr-only">Cargando categorías…</div>
						<TableSkeleton columnCount={6} rowCount={8} />
					</div>
				) : (
					<div className="space-y-8">
						<DataTable
							columns={columns}
							data={categories}
							emptyMessage="No hay categorías. Añade una para comenzar."
							emptyActionLabel="Crear primera categoría"
							onEmptyAction={handleAdd}
							filterPlaceholder="Filtrar categorías por nombre…"
							defaultSorting={[{ id: "parent", desc: true }]}
							onRefresh={() =>
								queryClient.invalidateQueries({ queryKey: categoriesKeys.all })
							}
							isRefreshing={isFetching}
							refreshAriaLabel="Actualizar lista de categorías"
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
							<SectionTitle>Previsualización de estructura</SectionTitle>
							<CategoryTreePreview categories={categories} />
						</div>
					</div>
				)}
			</div>

			<CategoryFormModal
				open={formModalOpen}
				onOpenChange={setFormModalOpen}
				category={editingCategory}
			/>
			<DeleteCategoryModal
				open={deleteModalOpen}
				onOpenChange={(open) => {
					setDeleteModalOpen(open);
					if (!open) setCategoryToDelete(null);
				}}
				category={categoryToDelete}
			/>
			<ToggleCategoryStatusModal
				open={toggleStatusModalOpen}
				onOpenChange={(open) => {
					setToggleStatusModalOpen(open);
					if (!open) setCategoryForToggle(null);
				}}
				category={categoryForToggle}
			/>
		</>
	);
}
