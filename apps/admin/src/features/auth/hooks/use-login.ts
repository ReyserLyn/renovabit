import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { authClientRepo } from "@/libs/better-auth/auth-client-repo";
import type { LoginFormValues } from "../domain/auth-model";

export function useLogin() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const loginMutation = useMutation({
		mutationFn: async ({ email, password }: LoginFormValues) => {
			return authClientRepo.signIn.email({ email, password });
		},
		onSuccess: () => {
			toast.success("Has iniciado sesión correctamente.");
			void router.invalidate();
			void queryClient.invalidateQueries();
		},
		onError: (error) => {
			toast.error(error instanceof Error ? error.message : "Ocurrió un error");
		},
	});

	return { loginMutation };
}
