import { toast } from "sonner";
import { ActionModal } from "@/components/modals/ActionModal";
import { useUpdateProduct } from "../../hooks";
import type { ProductWithRelations } from "../../services/products-service";

interface ToggleProductStatusModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product: ProductWithRelations | null;
}

export function ToggleProductStatusModal({
	open,
	onOpenChange,
	product,
}: ToggleProductStatusModalProps) {
	const updateProduct = useUpdateProduct();
	const isActivating = product ? product.status !== "active" : false;

	const handleConfirm = async () => {
		if (!product) return;

		const newStatus = product.status === "active" ? "inactive" : "active";

		const promise = (async () => {
			await updateProduct.mutateAsync({
				id: product.id,
				body: { status: newStatus },
			});
			onOpenChange(false);
		})();

		toast.promise(promise, {
			loading: isActivating ? "Activando producto…" : "Desactivando producto…",
			success: isActivating
				? "Producto activado correctamente."
				: "Producto desactivado correctamente.",
			error: (err) =>
				err instanceof Error ? err.message : "Error al cambiar el estado.",
		});
	};

	return (
		<ActionModal
			open={open}
			onOpenChange={onOpenChange}
			title={isActivating ? "¿Activar producto?" : "¿Desactivar producto?"}
			description={
				isActivating ? (
					<>
						El producto <strong>{product?.name}</strong> volverá a estar activo
						y visible en la tienda.
					</>
				) : (
					<>
						El producto <strong>{product?.name}</strong> dejará de estar activo
						y se ocultará de los listados.
					</>
				)
			}
			onConfirm={handleConfirm}
			isPending={updateProduct.isPending}
			confirmLabel={isActivating ? "Activar" : "Desactivar"}
			variant={isActivating ? "default" : "destructive"}
		/>
	);
}
