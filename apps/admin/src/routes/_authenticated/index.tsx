import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@renovabit/ui/components/ui/card.tsx";
import { createFileRoute } from "@tanstack/react-router";
import { AuthenticatedHeader } from "@/components/layout/authenticated-header";

export const Route = createFileRoute("/_authenticated/")({
	component: HomePage,
});

function HomePage() {
	const { session } = Route.useRouteContext();
	const user = session!.user;

	return (
		<>
			<AuthenticatedHeader
				breadcrumbs={[
					{ label: "Panel de Administración", to: "/" },
					{ label: "Dashboard" },
				]}
			/>
			<div className="flex flex-1 flex-col gap-4 p-4">
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
			</div>
		</>
	);
}
