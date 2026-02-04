import type { Category, CategoryInsertBody } from "@renovabit/db/schema";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@renovabit/ui/components/ui/dialog.tsx";
import { useCallback } from "react";
import { toast } from "sonner";
import { uploadFile } from "@/features/storage/storage-utils";
import { useCreateCategory, useUpdateCategory } from "../../hooks";
import type { CategoryFormValues } from "../../model/category-model";
import { validateCategory } from "../../services/categories-service";
import { CategoryForm } from "../forms/CategoryForm";

interface CategoryFormModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	category?: Category | null;
}

export function CategoryFormModal({
	open,
	onOpenChange,
	category,
}: CategoryFormModalProps) {
	const isEditing = !!category?.id;
	const createCategory = useCreateCategory();
	const updateCategory = useUpdateCategory();

	const isPending = createCategory.isPending || updateCategory.isPending;

	const handleSubmit = async (values: CategoryFormValues) => {
		const promise = (async () => {
			// 1. PRE-VALIDATION
			await validateCategory({
				id: category?.id,
				name: values.name,
				slug: values.slug,
			});

			let imageUrl = typeof values.imageUrl === "string" ? values.imageUrl : "";

			// 2. STORAGE
			if (values.imageUrl instanceof File) {
				const { url } = await uploadFile(values.imageUrl, "categories");
				imageUrl = url;
			}

			const body: CategoryInsertBody = {
				name: values.name,
				slug: values.slug,
				description: values.description || null,
				imageUrl: imageUrl.trim() || null,
				parentId: values.parentId || null,
				order: values.order,
				showInNavbar: values.showInNavbar,
				isActive: values.isActive,
			};

			// 3. DATABASE
			if (isEditing && category) {
				await updateCategory.mutateAsync({
					id: category.id,
					body,
				});
			} else {
				await createCategory.mutateAsync(body);
			}

			onOpenChange(false);
		})();

		toast.promise(promise, {
			loading: isEditing ? "Guardando cambios..." : "Creando categoría...",
			success: isEditing
				? "Categoría actualizada correctamente."
				: "Categoría creada con éxito.",
			error: (err) =>
				err instanceof Error ? err.message : "Error al procesar la categoría.",
		});

		try {
			await promise;
		} catch {
			// Toast handles error UI
		}
	};

	const handleOpenChange = useCallback(
		(next: boolean, ev?: { cancel?: () => void }) => {
			if (!next && isPending && typeof ev?.cancel === "function") {
				ev.cancel();
				return;
			}
			onOpenChange(next);
		},
		[onOpenChange, isPending],
	);

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-2xl" showCloseButton={!isPending}>
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Configuración de Categoría" : "Nueva Categoría"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Actualiza los detalles de la categoría."
							: "Ingresa los datos para registrar una nueva categoría."}
					</DialogDescription>
				</DialogHeader>

				<CategoryForm
					categoryId={category?.id}
					initialValues={
						category
							? {
									name: category.name,
									slug: category.slug,
									description: category.description || "",
									imageUrl: category.imageUrl || "",
									parentId: category.parentId,
									order: category.order,
									showInNavbar: category.showInNavbar,
									isActive: category.isActive,
								}
							: undefined
					}
					isPending={isPending}
					onSubmit={handleSubmit}
					onCancel={() => onOpenChange(false)}
					submitLabel={isEditing ? "Guardar cambios" : "Crear categoría"}
				/>
			</DialogContent>
		</Dialog>
	);
}
