import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (!context.session?.user) {
			throw redirect({ to: "/login" });
		}
	},
});

function RouteComponent() {
	return <div>Hello "/dashboard"!</div>;
}
