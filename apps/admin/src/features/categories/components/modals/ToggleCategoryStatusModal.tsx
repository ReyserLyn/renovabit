import { toast } from "sonner";
import { ActionModal } from "@/components/modals/ActionModal";
import { useUpdateCategory } from "../../hooks";
import { Category } from "../../model/category-model";

interface ToggleCategoryStatusModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	category: Category | null;
}

export function ToggleCategoryStatusModal({
	open,
	onOpenChange,
	category,
}: ToggleCategoryStatusModalProps) {
	const updateCategory = useUpdateCategory();
	const isActivating = category ? !category.isActive : false;

	const handleConfirm = async () => {
		if (!category) return;

		const nextActive = !category.isActive;

		const promise = (async () => {
			await updateCategory.mutateAsync({
				id: category.id,
				body: { isActive: nextActive },
			});
			onOpenChange(false);
		})();

		toast.promise(promise, {
			loading: "Cambiando estado…",
			success: nextActive
				? `La categoría "${category.name}" ahora está activa.`
				: `La categoría "${category.name}" ha sido desactivada.`,
			error: (err) =>
				err instanceof Error ? err.message : "Error al cambiar el estado.",
		});
	};

	return (
		<ActionModal
			open={open}
			onOpenChange={onOpenChange}
			title={isActivating ? "¿Activar categoría?" : "¿Desactivar categoría?"}
			description={
				isActivating ? (
					<>
						La categoría <strong>{category?.name}</strong> volverá a estar
						activa y visible.
					</>
				) : (
					<>
						La categoría <strong>{category?.name}</strong> dejará de estar
						activa y se ocultará de los listados.
					</>
				)
			}
			onConfirm={handleConfirm}
			isPending={updateCategory.isPending}
			confirmLabel={isActivating ? "Activar" : "Desactivar"}
			variant={isActivating ? "default" : "destructive"}
		/>
	);
}
