import type { Brand } from "@renovabit/db/schema";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@renovabit/ui/components/ui/dialog.tsx";
import { useCallback } from "react";
import { toast } from "sonner";
import { useCreateBrand, useUpdateBrand } from "../../hooks";
import type { BrandFormValues } from "../../model/brand-model";
import { BrandForm } from "./BrandForm";

interface BrandFormModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	brand?: Brand | null;
}

export function BrandFormModal({
	open,
	onOpenChange,
	brand,
}: BrandFormModalProps) {
	const isEditing = !!brand?.id;
	const createBrand = useCreateBrand();
	const updateBrand = useUpdateBrand();

	const isPending = createBrand.isPending || updateBrand.isPending;

	const handleSubmit = async (values: BrandFormValues) => {
		const body = {
			...values,
			logo: values.logo?.trim() || undefined,
		};

		const promise = (async () => {
			if (isEditing && brand) {
				await updateBrand.mutateAsync({ id: brand.id, body });
			} else {
				await createBrand.mutateAsync(body);
			}
			onOpenChange(false);
		})();

		toast.promise(promise, {
			loading: isEditing ? "Guardando cambios..." : "Registrando marca...",
			success: isEditing
				? "Marca actualizada correctamente."
				: "Marca registrada con éxito.",
			error: (err) =>
				err instanceof Error ? err.message : "Error al procesar la marca.",
		});

		await promise;
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
			<DialogContent className="sm:max-w-md" showCloseButton={!isPending}>
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Configuración de Marca" : "Nueva Marca"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Actualiza los detalles de la marca."
							: "Ingresa los datos para registrar una nueva marca."}
					</DialogDescription>
				</DialogHeader>

				<BrandForm
					initialValues={
						brand
							? {
									name: brand.name,
									slug: brand.slug,
									logo: brand.logo ?? "",
									isActive: brand.isActive,
								}
							: {
									name: "",
									slug: "",
									logo: "",
									isActive: true,
								}
					}
					isPending={isPending}
					onSubmit={handleSubmit}
					onCancel={() => onOpenChange(false)}
					submitLabel={isEditing ? "Guardar cambios" : "Añadir marca"}
				/>
			</DialogContent>
		</Dialog>
	);
}
