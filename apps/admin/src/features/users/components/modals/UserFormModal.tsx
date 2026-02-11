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
import { getAuthMessage } from "@/libs/better-auth/auth-error-messages";
import { useAdminCreateUser, useUpdateUser } from "../../hooks";
import type {
	User,
	UserAdminCreateInput,
	UserFormValues,
	UserUpdateBody,
	UserUpdateFormValues,
} from "../../model/user-model";
import { UserForm } from "../forms/UserForm";

function isUserFormValues(
	v: UserFormValues | UserUpdateFormValues,
): v is UserFormValues {
	return "password" in v && typeof v.password === "string";
}

interface UserFormModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: User | null;
}

export function UserFormModal({
	open,
	onOpenChange,
	user,
}: UserFormModalProps) {
	const isEditing = !!user?.id;
	const [isDirty, setIsDirty] = useState(false);
	const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

	const createUser = useAdminCreateUser();
	const updateUser = useUpdateUser();

	const isPending = createUser.isPending || updateUser.isPending;

	useEffect(() => {
		if (open) {
			setIsDirty(false);
			setShowDiscardConfirm(false);
		}
	}, [open]);

	const handleSubmit = useCallback(
		async (values: UserFormValues | UserUpdateFormValues) => {
			const promise = (async () => {
				if (isEditing && user) {
					const body: UserUpdateBody = {
						name: values.name?.trim() || undefined,
						email: values.email?.trim() || undefined,
						phone: values.phone?.trim() || undefined,
						displayUsername: values.displayUsername?.trim() || undefined,
						role: values.role,
					};

					await updateUser.mutateAsync({ id: user.id, body });
				} else if (isUserFormValues(values)) {
					const body: UserAdminCreateInput = {
						name: values.name.trim(),
						email: values.email.trim(),
						password: values.password,
						confirmPassword: values.confirmPassword,
						displayUsername: values.displayUsername!.trim(),
						phone: values.phone?.trim() || undefined,
						role: values.role,
					};

					await createUser.mutateAsync(body);
				}

				onOpenChange(false);
			})();

			await toast.promise(promise, {
				loading: isEditing ? "Guardando cambios…" : "Creando usuario…",
				success: isEditing
					? "Usuario actualizado correctamente."
					: "Usuario creado con éxito.",
				error: (err) =>
					getAuthMessage(err) ||
					"No se pudo guardar el usuario. Comprueba la conexión e inténtalo de nuevo.",
			});
		},
		[isEditing, user, updateUser, createUser, onOpenChange],
	);

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
							{isEditing ? "Editar usuario" : "Nuevo usuario"}
						</DialogTitle>
						<DialogDescription>
							{isEditing
								? "Actualiza los datos principales del usuario."
								: "Ingresa los datos para registrar un nuevo usuario."}
						</DialogDescription>
					</DialogHeader>

					<UserForm
						isEditing={isEditing}
						initialValues={
							user
								? {
										name: user.name || "",
										email: user.email,
										phone: user.phone || "",
										displayUsername:
											user.displayUsername || user.username || "",
										role: user.role,
									}
								: undefined
						}
						initialValuesKey={user?.id ?? "new"}
						isPending={isPending}
						onSubmit={handleSubmit}
						onCancel={() => handleOpenChange(false)}
						onDirtyChange={setIsDirty}
						submitLabel={isEditing ? "Guardar cambios" : "Crear usuario"}
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
