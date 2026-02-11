import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@renovabit/ui/components/ui/dialog";
import { useCallback } from "react";
import { toast } from "sonner";
import { useBanUser } from "../../hooks";
import type { BanUserFormValues, User } from "../../model/user-model";
import { getUserDisplayName } from "../../model/user-model";
import { BanUserForm } from "../forms/BanUserForm";

interface BanUserModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: User | null;
}

export function BanUserModal({ open, onOpenChange, user }: BanUserModalProps) {
	const banUser = useBanUser();
	const isPending = banUser.isPending;
	const displayName = user ? getUserDisplayName(user) : "Usuario";

	const handleSubmit = useCallback(
		async (values: BanUserFormValues) => {
			if (!user) return;

			const promise = (async () => {
				await banUser.mutateAsync({
					id: user.id,
					body: {
						banReason: values.banReason,
						banExpiresIn: values.banExpiresIn,
					},
				});
				onOpenChange(false);
			})();

			await toast.promise(promise, {
				loading: "Baneando usuario…",
				success: `El usuario "${displayName}" ha sido baneado.`,
				error: (err) =>
					err instanceof Error ? err.message : "No se pudo banear el usuario.",
			});
		},
		[user, banUser, onOpenChange, displayName],
	);

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
					<DialogTitle>Banear usuario</DialogTitle>
					<DialogDescription>
						El usuario <strong>{displayName}</strong> no podrá acceder a la
						plataforma mientras esté baneado.
					</DialogDescription>
				</DialogHeader>

				<BanUserForm
					onSubmit={handleSubmit}
					onCancel={() => onOpenChange(false)}
					isPending={isPending}
					submitLabel="Banear usuario"
				/>
			</DialogContent>
		</Dialog>
	);
}
