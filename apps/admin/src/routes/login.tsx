import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { authQueryOptions } from "@/libs/better-auth/auth-session";

export const Route = createFileRoute("/login")({
	beforeLoad: async ({ context }) => {
		const session = await context.queryClient.ensureQueryData(
			authQueryOptions(),
		);

		if (session) {
			throw redirect({
				to: "/",
			});
		}
	},
	component: LoginPage,
});

function LoginPage() {
	return (
		<div className="container flex min-h-svh flex-col items-center justify-center">
			<div className="w-full max-w-md">
				<LoginForm />
			</div>
		</div>
	);
}
