import type { UserUpdateBody } from "@renovabit/db/schema";
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
import { useAdminCreateUser, useUpdateUser } from "../../hooks";
import type {
	AdminUser,
	UserFormValues,
	UserUpdateFormValues,
} from "../../model/user-model";
import { validateUser } from "../../services/users-service";
import { UserForm } from "../forms/UserForm";

interface UserFormModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: AdminUser | null;
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

	const handleSubmit = async (
		values: UserFormValues | UserUpdateFormValues,
	) => {
		const displayUsername = values.displayUsername?.trim();
		const firstWord = displayUsername?.split(/\s+/)[0];
		const username = firstWord ? firstWord.toLowerCase() : undefined;

		const promise = (async () => {
			if (isEditing && user) {
				const updateValues = values as UserUpdateFormValues;

				const body: UserUpdateBody = {
					name: updateValues.name?.trim() || undefined,
					email: updateValues.email?.trim() || undefined,
					phone: updateValues.phone?.trim() || undefined,
					username,
					displayUsername: displayUsername || undefined,
					role: updateValues.role,
				};

				await validateUser({
					id: user.id,
					email: updateValues.email,
					username,
				});

				await updateUser.mutateAsync({ id: user.id, body });
			} else {
				const createValues = values as UserFormValues;

				const body = {
					name: createValues.name,
					email: createValues.email,
					password: createValues.password,
					confirmPassword: createValues.confirmPassword,
					phone: createValues.phone,
					username,
					displayUsername: displayUsername || undefined,
					role: createValues.role,
				};

				await validateUser({
					email: createValues.email,
					username,
				});

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
				err instanceof Error
					? err.message
					: "No se pudo guardar el usuario. Comprueba la conexión e inténtalo de nuevo.",
		});
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
										username: user.username || "",
										displayUsername:
											user.displayUsername || user.username || "",
										role: user.role,
									}
								: undefined
						}
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
