import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@renovabit/ui/components/ui/breadcrumb.tsx";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@renovabit/ui/components/ui/card.tsx";
import { Separator } from "@renovabit/ui/components/ui/separator.tsx";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@renovabit/ui/components/ui/sidebar.tsx";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/sidebar";

export const Route = createFileRoute("/")({
	component: HomePage,
	beforeLoad: async ({ context }) => {
		if (!context.session?.user) {
			throw redirect({ to: "/login" });
		}
	},
});

function HomePage() {
	const { session } = Route.useRouteContext();
	const user = session!.user;

	return (
		<SidebarProvider>
			<AppSidebar user={user} />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex flex-1 items-center gap-2">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink render={<Link to="/" />}>
										Panel de Administración
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>Dashboard</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4">
					<Card size="default">
						<CardHeader>
							<CardTitle className="text-balance">Sesión iniciada</CardTitle>
							<CardDescription>
								Has iniciado sesión correctamente. Aquí puedes ver tu
								información.
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
			</SidebarInset>
		</SidebarProvider>
	);
}
