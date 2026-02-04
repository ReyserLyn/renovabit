import type { Category } from "@renovabit/db/schema";
import { toast } from "sonner";
import { ActionModal } from "@/components/modals/ActionModal";
import { useUpdateCategory } from "../../hooks";

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

	const handleConfirm = async () => {
		if (!category) return;

		const promise = (async () => {
			await updateCategory.mutateAsync({
				id: category.id,
				body: { isActive: !category.isActive },
			});
			onOpenChange(false);
		})();

		toast.promise(promise, {
			loading: category.isActive
				? "Desactivando categoría..."
				: "Activando categoría...",
			success: category.isActive
				? "Categoría desactivada correctamente."
				: "Categoría activada correctamente.",
			error: (err) =>
				err instanceof Error ? err.message : "Error al cambiar el estado.",
		});
	};

	return (
		<ActionModal
			open={open}
			onOpenChange={onOpenChange}
			title={
				category?.isActive ? "¿Desactivar categoría?" : "¿Activar categoría?"
			}
			description={
				<>
					¿Estás seguro de que deseas{" "}
					{category?.isActive ? "desactivar" : "activar"} la categoría{" "}
					<strong>{category?.name}</strong>?
				</>
			}
			onConfirm={handleConfirm}
			isPending={updateCategory.isPending}
			confirmLabel={category?.isActive ? "Desactivar" : "Activar"}
			variant={category?.isActive ? "destructive" : "default"}
		/>
	);
}
