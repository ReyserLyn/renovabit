import {
	Calendar03Icon,
	ComputerIcon,
	Logout01Icon,
	SmartPhone01Icon,
	Tablet01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@renovabit/ui/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@renovabit/ui/components/ui/dialog";
import { ScrollArea } from "@renovabit/ui/components/ui/scroll-area";
import { Spinner } from "@renovabit/ui/components/ui/spinner";
import { useCallback } from "react";
import { toast } from "sonner";
import { formatDate } from "@/libs/utils";
import {
	useListUserSessions,
	useRevokeAllUserSessions,
	useRevokeUserSession,
} from "../../hooks";
import type { User } from "../../model/user-model";
import { getUserDisplayName } from "../../model/user-model";

interface UserSessionsModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: User | null;
}

function getDeviceIcon(userAgent?: string) {
	const ua = userAgent?.toLowerCase() || "";
	if (ua.includes("mobi") || ua.includes("android") || ua.includes("iphone"))
		return SmartPhone01Icon;
	if (ua.includes("tablet") || ua.includes("ipad")) return Tablet01Icon;
	return ComputerIcon;
}

export function UserSessionsModal({
	open,
	onOpenChange,
	user,
}: UserSessionsModalProps) {
	const {
		data: sessions,
		isLoading,
		isError,
	} = useListUserSessions(user?.id ?? "");
	const revokeSession = useRevokeUserSession(user?.id ?? "");
	const revokeAllSessions = useRevokeAllUserSessions(user?.id ?? "");

	const isPending = revokeSession.isPending || revokeAllSessions.isPending;
	const displayName = user ? getUserDisplayName(user) : "Usuario";

	const handleRevoke = useCallback(
		async (token: string) => {
			const promise = revokeSession.mutateAsync(token);

			await toast.promise(promise, {
				loading: "Revocando sesión…",
				success: "Sesión revocada correctamente.",
				error: (err) =>
					err instanceof Error ? err.message : "No se pudo revocar la sesión.",
			});
		},
		[revokeSession],
	);

	const handleRevokeAll = useCallback(async () => {
		const promise = revokeAllSessions.mutateAsync();

		await toast.promise(promise, {
			loading: "Revocando todas las sesiones…",
			success: "Todas las sesiones han sido revocadas.",
			error: (err) =>
				err instanceof Error
					? err.message
					: "No se pudieron revocar las sesiones.",
		});
	}, [revokeAllSessions]);

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

	const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-xl" showCloseButton={!isPending}>
				<DialogHeader>
					<div className="flex items-center justify-between">
						<div>
							<DialogTitle>Sesiones activas</DialogTitle>
							<DialogDescription>
								Gestiona las sesiones del usuario <strong>{displayName}</strong>
								.
							</DialogDescription>
						</div>
						{sessions && sessions.length > 0 && (
							<Button
								variant="outline"
								size="sm"
								className="text-destructive hover:bg-destructive/10"
								onClick={handleRevokeAll}
								disabled={revokeAllSessions.isPending}
							>
								Revocar todas
							</Button>
						)}
					</div>
				</DialogHeader>

				<div className="py-4">
					{isLoading ? (
						<div className="flex h-40 items-center justify-center">
							<Spinner className="size-8" />
						</div>
					) : isError ? (
						<div className="flex h-40 items-center justify-center text-muted-foreground">
							Error al cargar las sesiones.
						</div>
					) : sessions && sessions.length > 0 ? (
						<ScrollArea className="h-72">
							<div className="flex flex-col gap-3 pr-4">
								{sessions.map((session) => (
									<div
										key={session.id}
										className="flex items-center justify-between rounded-lg border p-3"
									>
										<div className="flex items-center gap-3">
											<div className="rounded-full bg-muted p-2">
												<HugeiconsIcon
													icon={getDeviceIcon(session.userAgent ?? undefined)}
													className="size-5"
												/>
											</div>
											<div className="flex flex-col">
												<span className="text-sm font-medium">
													{session.ipAddress || "IP desconocida"}
												</span>
												<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
													<HugeiconsIcon
														icon={Calendar03Icon}
														className="size-3"
													/>
													<span>Creada: {formatDate(session.createdAt)}</span>
												</div>
												{session.userAgent && (
													<span className="mt-0.5 text-[10px] text-muted-foreground line-clamp-1 max-w-[200px]">
														{session.userAgent}
													</span>
												)}
											</div>
										</div>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleRevoke(session.token)}
											disabled={revokeSession.isPending}
											title="Revocar sesión"
										>
											<HugeiconsIcon
												icon={Logout01Icon}
												className="size-4 text-destructive"
											/>
										</Button>
									</div>
								))}
							</div>
						</ScrollArea>
					) : (
						<div className="flex h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
							<HugeiconsIcon
								icon={Logout01Icon}
								className="size-8 opacity-20"
							/>
							<p>No hay sesiones activas para este usuario.</p>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button type="button" variant="outline" onClick={handleClose}>
						Cerrar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
