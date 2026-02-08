import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { authClientRepo } from "@/libs/better-auth/auth-client-repo";
import {
	getAuthErrorMessage,
	getAuthOrNetworkMessage,
} from "@/libs/better-auth/auth-error-messages";
import { getSessionFn } from "@/libs/better-auth/auth-session";
import type { LoginFormValues } from "../domain/auth-model";

export function useLogin() {
	const navigate = useNavigate();
	const router = useRouter();
	const queryClient = useQueryClient();

	const loginMutation = useMutation({
		mutationFn: async ({ emailOrUsername, password }: LoginFormValues) => {
			try {
				const isEmail = emailOrUsername.includes("@");
				const { data, error } = isEmail
					? await authClientRepo.signIn.email({
							email: emailOrUsername.trim(),
							password,
						})
					: await authClientRepo.signIn.username({
							username: emailOrUsername.trim().toLowerCase(),
							password,
						});

				if (error) {
					const msg =
						getAuthErrorMessage(error.code) ||
						getAuthOrNetworkMessage(error) ||
						"No se pudo iniciar sesión. Inténtalo de nuevo.";
					throw new Error(msg);
				}
				return data;
			} catch (err) {
				const msg =
					getAuthErrorMessage(
						err && typeof err === "object" && "code" in err
							? String((err as { code: unknown }).code)
							: undefined,
					) || getAuthOrNetworkMessage(err);
				throw new Error(msg);
			}
		},
		onSuccess: async () => {
			const session = await getSessionFn();
			queryClient.setQueryData(["session"], session);

			if (session?.user?.role !== "admin") {
				await authClientRepo.signOut();
				queryClient.setQueryData(["session"], null);
				toast.error(
					"No tienes permisos para acceder al panel de administración.",
				);
				return;
			}

			toast.success("Has iniciado sesión correctamente.");
			void router.invalidate();
			navigate({ to: "/" });
		},
	});

	return { loginMutation };
}
