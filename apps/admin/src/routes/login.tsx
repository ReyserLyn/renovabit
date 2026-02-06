import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { authClientRepo } from "@/libs/better-auth/auth-client-repo";
import { authQueryOptions } from "@/libs/better-auth/auth-session";

export const Route = createFileRoute("/login")({
	beforeLoad: async ({ context }) => {
		try {
			const session = await context.queryClient.ensureQueryData(
				authQueryOptions(),
			);

			if (session?.user?.role === "admin") {
				throw redirect({
					to: "/",
				});
			}

			if (session?.user?.role && session.user.role !== "admin") {
				await authClientRepo.signOut();
				context.queryClient.setQueryData(["session"], null);
			}
		} catch (error) {
			if (error && typeof error === "object" && "to" in error) {
				throw error;
			}
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
