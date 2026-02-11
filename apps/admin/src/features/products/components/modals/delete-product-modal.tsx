import { toast } from "sonner";
import { ActionModal } from "@/components/modals/ActionModal";
import { useDeleteProduct } from "../../hooks";
import { Product } from "../../models/product-model";

interface DeleteProductModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product: Product | null;
}

export function DeleteProductModal({
	open,
	onOpenChange,
	product,
}: DeleteProductModalProps) {
	const deleteProduct = useDeleteProduct();

	const handleConfirm = async () => {
		if (!product) return;

		const promise = (async () => {
			await deleteProduct.mutateAsync(product.id);
			onOpenChange(false);
		})();

		toast.promise(promise, {
			loading: "Eliminando producto…",
			success: "Producto eliminado correctamente.",
			error: (err) =>
				err instanceof Error ? err.message : "No se pudo eliminar el producto.",
		});
	};

	return (
		<ActionModal
			open={open}
			onOpenChange={onOpenChange}
			title="¿Eliminar producto?"
			description={
				<>
					Se eliminará permanentemente el producto{" "}
					<strong>{product?.name}</strong> y sus imágenes. Esta acción no se
					puede deshacer.
				</>
			}
			onConfirm={handleConfirm}
			isPending={deleteProduct.isPending}
			confirmLabel="Eliminar producto"
			variant="destructive"
		/>
	);
}
