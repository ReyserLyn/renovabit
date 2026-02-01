import type { Brand } from "@renovabit/db/schema";
import { toast } from "sonner";
import { useUpdateBrand } from "../../hooks";
import { ActionModal } from "./ActionModal";

interface ToggleBrandStatusModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	brand: Brand | null;
}

export function ToggleBrandStatusModal({
	open,
	onOpenChange,
	brand,
}: ToggleBrandStatusModalProps) {
	const updateBrand = useUpdateBrand();
	const isActivating = brand ? !brand.isActive : false;

	const handleConfirm = async () => {
		if (!brand) return;

		const nextActive = !brand.isActive;

		const promise = (async () => {
			await updateBrand.mutateAsync({
				id: brand.id,
				body: { isActive: nextActive },
			});
			onOpenChange(false);
		})();

		toast.promise(promise, {
			loading: "Cambiando estado...",
			success: nextActive
				? `La marca "${brand.name}" ahora está activa.`
				: `La marca "${brand.name}" ha sido desactivada.`,
			error: (err) =>
				err instanceof Error ? err.message : "Error al cambiar el estado.",
		});
	};

	return (
		<ActionModal
			open={open}
			onOpenChange={onOpenChange}
			title={isActivating ? "¿Activar marca?" : "¿Desactivar marca?"}
			description={
				isActivating ? (
					<>
						La marca <strong>{brand?.name}</strong> volverá a estar activa y
						visible.
					</>
				) : (
					<>
						La marca <strong>{brand?.name}</strong> dejará de estar activa y se
						ocultará de los listados.
					</>
				)
			}
			onConfirm={handleConfirm}
			isPending={updateBrand.isPending}
			confirmLabel={isActivating ? "Activar" : "Desactivar"}
			variant={isActivating ? "default" : "secondary"}
		/>
	);
}
