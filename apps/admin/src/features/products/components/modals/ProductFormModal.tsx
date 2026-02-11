import { Button } from "@renovabit/ui/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@renovabit/ui/components/ui/dialog";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { uploadFile } from "@/features/storage/storage-utils";
import { useCreateProduct, useUpdateProduct } from "../../hooks";
import type {
	ProductFormValues,
	ProductImage,
} from "../../models/product-model";
import type { ProductWithRelations } from "../../services/products-service";
import { validateProduct } from "../../services/products-service";
import { ProductForm } from "../forms/ProductForm.tsx";

interface ProductFormModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product?: ProductWithRelations | null;
}

export function ProductFormModal({
	open,
	onOpenChange,
	product,
}: ProductFormModalProps) {
	const isEditing = !!product?.id;
	const [isDirty, setIsDirty] = useState(false);
	const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

	const createProduct = useCreateProduct();
	const updateProduct = useUpdateProduct();

	const isPending = createProduct.isPending || updateProduct.isPending;

	useEffect(() => {
		if (open) {
			setIsDirty(false);
			setShowDiscardConfirm(false);
		}
	}, [open]);

	const handleSubmit = async (values: ProductFormValues) => {
		const promise = (async () => {
			// 1. PRE-VALIDACIÓN
			await validateProduct({
				id: product?.id,
				slug: values.slug,
				sku: values.sku,
			});

			// 2. PROCESAR / SUBIR IMÁGENES
			const uploadedImages = (
				await Promise.all(
					values.images.map(async (img) => {
						if (img.file instanceof File) {
							const { url } = await uploadFile(img.file, "products");

							return {
								url,
								alt: img.alt || undefined,
								order: img.order,
							};
						}
						if (img.url) {
							return {
								id: img.id,
								url: img.url,
								alt: img.alt || undefined,
								order: img.order,
							};
						}
						return undefined;
					}),
				)
			).filter((img): img is NonNullable<typeof img> => !!img);

			// 3. GUARDAR EN DB
			const base = {
				...values,
				images: uploadedImages,
				specifications: values.specifications ?? [],
			};
			if (isEditing && product) {
				await updateProduct.mutateAsync({ id: product.id, body: base });
			} else {
				await createProduct.mutateAsync(base);
			}

			onOpenChange(false);
		})();

		toast.promise(promise, {
			loading: isEditing ? "Guardando cambios…" : "Creando producto…",
			success: isEditing
				? "Producto actualizado correctamente."
				: "Producto creado con éxito.",
			error:
				"No se pudo guardar el producto. Comprueba la conexión e inténtalo de nuevo.",
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
			if (!next && isDirty) {
				setShowDiscardConfirm(true);
				return;
			}
			onOpenChange(next);
		},
		[onOpenChange, isPending, isDirty],
	);

	const handleConfirmDiscard = useCallback(() => {
		setShowDiscardConfirm(false);
		setIsDirty(false);
		onOpenChange(false);
	}, [onOpenChange]);

	return (
		<>
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogContent className="sm:max-w-2xl" showCloseButton={!isPending}>
					<DialogHeader>
						<DialogTitle>
							{isEditing ? "Configuración de Producto" : "Nuevo Producto"}
						</DialogTitle>
						<DialogDescription>
							{isEditing
								? "Actualiza los detalles del producto."
								: "Ingresa los datos para registrar un nuevo producto."}
						</DialogDescription>
					</DialogHeader>

					<ProductForm
						initialValues={
							product
								? {
										name: product.name,
										slug: product.slug,
										sku: product.sku,
										description: product.description || "",
										price: product.price,
										stock: product.stock,
										brandId: product.brandId || undefined,
										categoryId: product.categoryId || undefined,
										status: product.status,
										isFeatured: product.isFeatured,
										specifications: product.specifications,
										images:
											product.images?.map((img: ProductImage) => ({
												id: img.id,
												url: img.url,
												alt: img.alt || "",
												order: img.order || 0,
											})) || [],
									}
								: undefined
						}
						isPending={isPending}
						onSubmit={handleSubmit}
						onCancel={() => handleOpenChange(false)}
						onDirtyChange={setIsDirty}
						submitLabel={isEditing ? "Guardar cambios" : "Crear producto"}
					/>
				</DialogContent>
			</Dialog>

			<Dialog open={showDiscardConfirm} onOpenChange={setShowDiscardConfirm}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>¿Descartar cambios?</DialogTitle>
						<DialogDescription>
							Hay cambios sin guardar. Si cierras ahora, se perderán.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => setShowDiscardConfirm(false)}
						>
							Seguir editando
						</Button>
						<Button
							type="button"
							variant="destructive"
							onClick={handleConfirmDiscard}
						>
							Descartar
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
