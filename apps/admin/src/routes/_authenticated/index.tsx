import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@renovabit/ui/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { AuthenticatedHeader } from "@/components/layout/authenticated-header";
import { useBreadcrumbs } from "@/libs/breadcrumbs";

export const Route = createFileRoute("/_authenticated/")({
	component: HomePage,
});

function HomePage() {
	const { session } = Route.useRouteContext();
	const user = session!.user;
	const breadcrumbs = useBreadcrumbs();

	return (
		<>
			<AuthenticatedHeader breadcrumbs={breadcrumbs} />
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
