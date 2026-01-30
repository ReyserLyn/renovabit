import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const Route = createFileRoute("/login")({
	component: LoginPage,
	beforeLoad: async ({ context }) => {
		if (context.session?.user) {
			throw redirect({ to: "/" });
		}
	},
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
