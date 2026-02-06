import { Toaster } from "@renovabit/ui/components/ui/sonner";
import appCss from "@renovabit/ui/styles/globals.css?url";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import {
	authQueryOptions,
	type Session,
} from "@/libs/better-auth/auth-session";
import TanStackQueryDevtools from "../libs/tanstack-query/devtools";

export type MyRouterContext = {
	queryClient: QueryClient;
	session: Session | null;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: ({ context }) => {
		context.queryClient.prefetchQuery(authQueryOptions());
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Admin Dashboard Renovabit",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="es">
			<head>
				<HeadContent />
			</head>
			<body>
				<Toaster richColors />
				<NuqsAdapter>{children}</NuqsAdapter>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
