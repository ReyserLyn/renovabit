import {
	SidebarInset,
	SidebarProvider,
} from "@renovabit/ui/components/ui/sidebar.tsx";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/sidebar";
import { authQueryOptions } from "@/libs/better-auth/auth-session";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ context }) => {
		const session = await context.queryClient.ensureQueryData(
			authQueryOptions(),
		);

		if (!session) {
			throw redirect({
				to: "/login",
			});
		}

		return {
			session,
		};
	},
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	const { session } = Route.useRouteContext();
	const user = session!.user;

	return (
		<SidebarProvider>
			<AppSidebar user={user} />
			<SidebarInset>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
