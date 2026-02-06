import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@renovabit/ui/components/ui/dialog";
import { useCallback } from "react";
import { toast } from "sonner";
import { useAdminChangeUserPassword } from "../../hooks";
import type { AdminUser, UserPasswordFormValues } from "../../model/user-model";
import { getUserDisplayName } from "../../model/user-model";
import { UserPasswordForm } from "../forms/UserPasswordForm";

interface UserPasswordModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: AdminUser | null;
}

export function UserPasswordModal({
	open,
	onOpenChange,
	user,
}: UserPasswordModalProps) {
	const changePassword = useAdminChangeUserPassword();
	const isPending = changePassword.isPending;

	const handleSubmit = async (values: UserPasswordFormValues) => {
		if (!user) return;

		const promise = (async () => {
			await changePassword.mutateAsync({
				id: user.id,
				body: {
					password: values.password,
					confirmPassword: values.confirmPassword,
				},
			});
			onOpenChange(false);
		})();

		await toast.promise(promise, {
			loading: "Cambiando contraseña…",
			success: `La contraseña de "${getUserDisplayName(user)}" ha sido actualizada.`,
			error: (err) =>
				err instanceof Error
					? err.message
					: "No se pudo cambiar la contraseña.",
		});
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

	const displayName = user ? getUserDisplayName(user) : "Usuario";

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-md" showCloseButton={!isPending}>
				<DialogHeader>
					<DialogTitle>Cambiar contraseña</DialogTitle>
					<DialogDescription>
						Establece una nueva contraseña para <strong>{displayName}</strong>.
						El usuario deberá usar esta contraseña para iniciar sesión.
					</DialogDescription>
				</DialogHeader>

				<UserPasswordForm
					isPending={isPending}
					onSubmit={handleSubmit}
					onCancel={() => onOpenChange(false)}
					submitLabel="Cambiar contraseña"
					userRole={user?.role}
				/>
			</DialogContent>
		</Dialog>
	);
}
