import { toast } from "sonner";
import { ActionModal } from "@/components/modals/ActionModal";
import { useDeleteUser } from "../../hooks";
import type { AdminUser } from "../../model/user-model";
import { getUserDisplayName } from "../../model/user-model";

interface DeleteUserModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: AdminUser | null;
}

export function DeleteUserModal({
	open,
	onOpenChange,
	user,
}: DeleteUserModalProps) {
	const deleteUser = useDeleteUser();

	const handleConfirm = async () => {
		if (!user) return;

		const promise = (async () => {
			await deleteUser.mutateAsync(user.id);
			onOpenChange(false);
		})();

		toast.promise(promise, {
			loading: "Eliminando usuario…",
			success: `El usuario "${getUserDisplayName(user)}" ha sido eliminado.`,
			error: (err) =>
				err instanceof Error ? err.message : "No se pudo eliminar el usuario.",
		});
	};

	const displayName = user ? getUserDisplayName(user) : "este usuario";

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
			isPending={deleteUser.isPending}
			confirmLabel="Eliminar usuario"
			variant="destructive"
		/>
	);
}
