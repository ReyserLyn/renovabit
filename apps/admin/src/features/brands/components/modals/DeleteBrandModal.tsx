import type { Brand } from "@renovabit/db/schema";
import { toast } from "sonner";
import { ActionModal } from "@/components/modals/ActionModal";
import { useDeleteBrand } from "../../hooks";

interface DeleteBrandModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	brand: Brand | null;
}

export function DeleteBrandModal({
	open,
	onOpenChange,
	brand,
}: DeleteBrandModalProps) {
	const deleteBrand = useDeleteBrand();

	const handleConfirm = async () => {
		if (!brand) return;

		const promise = (async () => {
			await deleteBrand.mutateAsync(brand.id);
			onOpenChange(false);
		})();

		toast.promise(promise, {
			loading: "Eliminando marca...",
			success: `La marca "${brand.name}" ha sido eliminada.`,
			error: (err) =>
				err instanceof Error ? err.message : "No se pudo eliminar la marca.",
		});
	};

	return (
		<ActionModal
			open={open}
			onOpenChange={onOpenChange}
			title="¿Eliminar marca?"
			description={
				<>
					Se eliminará permanentemente la marca <strong>{brand?.name}</strong>.
					Esta acción no se puede deshacer.
				</>
			}
			onConfirm={handleConfirm}
			isPending={deleteBrand.isPending}
			confirmLabel="Eliminar marca"
			variant="destructive"
		/>
	);
}
