import { Button } from "@renovabit/ui/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@renovabit/ui/components/ui/card.tsx";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useLogout } from "@/features/auth/hooks/use-logout";

export const Route = createFileRoute("/")({
	component: HomePage,
	beforeLoad: async ({ context }) => {
		if (!context.session?.user) {
			throw redirect({ to: "/login" });
		}
	},
});

function HomePage() {
	const navigate = useNavigate();
	const { session } = Route.useRouteContext();
	const { logoutMutation } = useLogout();
	const user = session?.user;
	const isPending = logoutMutation.isPending;

	const handleLogout = () => {
		logoutMutation.mutate(undefined, {
			onSuccess: () => {
				navigate({ to: "/login" });
			},
		});
	};

	return (
		<div className="min-h-screen bg-muted/30">
			<header className="border-b bg-card px-4 py-3">
				<div className="mx-auto flex max-w-4xl items-center justify-between">
					<h1 className="text-lg font-semibold text-balance">
						Admin Dashboard
					</h1>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={handleLogout}
						disabled={isPending}
						aria-busy={isPending}
						aria-label="Cerrar sesión"
					>
						{isPending ? "Cerrando sesión…" : "Cerrar sesión"}
					</Button>
				</div>
			</header>
			<main className="mx-auto max-w-4xl p-4">
				<Card size="default">
					<CardHeader>
						<CardTitle className="text-balance">Sesión iniciada</CardTitle>
						<CardDescription>
							Has iniciado sesión correctamente. Aquí puedes ver tu información.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						{user?.name && (
							<p className="text-sm">
								<strong>Nombre:</strong>{" "}
								<span className="truncate wrap-break-word">{user.name}</span>
							</p>
						)}
						{user?.email && (
							<p className="text-sm min-w-0">
								<strong>Correo:</strong>{" "}
								<span className="truncate wrap-break-word">{user.email}</span>
							</p>
						)}
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
