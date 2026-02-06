import type { Category } from "@renovabit/db/schema";
import { toast } from "sonner";
import { ActionModal } from "@/components/modals/ActionModal";
import { useDeleteCategory } from "../../hooks";

interface DeleteCategoryModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	category: Category | null;
}

export function DeleteCategoryModal({
	open,
	onOpenChange,
	category,
}: DeleteCategoryModalProps) {
	const deleteCategory = useDeleteCategory();

	const handleConfirm = async () => {
		if (!category) return;

		const promise = (async () => {
			await deleteCategory.mutateAsync(category.id);
			onOpenChange(false);
		})();

		toast.promise(promise, {
			loading: "Eliminando categoría…",
			success: `La categoría "${category.name}" ha sido eliminada.`,
			error: (err) =>
				err instanceof Error
					? err.message
					: "No se pudo eliminar la categoría.",
		});
	};

	return (
		<ActionModal
			open={open}
			onOpenChange={onOpenChange}
			title="¿Eliminar categoría?"
			description={
				<>
					Se eliminará permanentemente la categoría{" "}
					<strong>{category?.name}</strong>. Esta acción no se puede deshacer.
				</>
			}
			onConfirm={handleConfirm}
			isPending={deleteCategory.isPending}
			confirmLabel="Eliminar categoría"
			variant="destructive"
		/>
	);
}
