import { useCallback } from "react";
import { toast } from "sonner";
import { ActionModal } from "@/components/modals/ActionModal";
import { getAuthMessage } from "@/libs/better-auth/auth-error-messages";
import { useDeleteUser } from "../../hooks";
import type { User } from "../../model/user-model";
import { getUserDisplayName } from "../../model/user-model";

interface DeleteUserModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: User | null;
}

export function DeleteUserModal({
	open,
	onOpenChange,
	user,
}: DeleteUserModalProps) {
	const deleteUser = useDeleteUser();
	const isPending = deleteUser.isPending;
	const displayName = user ? getUserDisplayName(user) : "este usuario";

	const handleConfirm = useCallback(async () => {
		if (!user) return;

		const promise = (async () => {
			await deleteUser.mutateAsync(user.id);
			onOpenChange(false);
		})();

		await toast.promise(promise, {
			loading: "Eliminando usuario…",
			success: `El usuario "${displayName}" ha sido eliminado.`,
			error: (err) => getAuthMessage(err) || "No se pudo eliminar el usuario.",
		});
	}, [user, deleteUser, onOpenChange, displayName]);

	return (
		<ActionModal
			open={open}
			onOpenChange={onOpenChange}
			title="¿Eliminar usuario?"
			description={
				<>
					Se eliminará permanentemente el usuario <strong>{displayName}</strong>
					. Esta acción no se puede deshacer.
				</>
			}
			onConfirm={handleConfirm}
			isPending={isPending}
			confirmLabel="Eliminar usuario"
			variant="destructive"
		/>
	);
}
