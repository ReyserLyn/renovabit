import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { authClientRepo } from "@/libs/better-auth/auth-client-repo";
import { getAuthErrorMessage } from "@/libs/better-auth/auth-error-messages";
import type { LoginFormValues } from "../domain/auth-model";

export function useLogin() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const loginMutation = useMutation({
		mutationFn: async ({ email, password }: LoginFormValues) => {
			const { data, error } = await authClientRepo.signIn.email({
				email,
				password,
			});
			if (error) {
				const msg =
					getAuthErrorMessage(error.code) ||
					error.message ||
					"No se pudo iniciar sesión. Comprueba tu conexión e intenta de nuevo.";
				throw new Error(msg);
			}
			return data;
		},
		onSuccess: () => {
			toast.success("Has iniciado sesión correctamente.");
			void router.invalidate();
			void queryClient.invalidateQueries();
		},
	});

	return { loginMutation };
}
