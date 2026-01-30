import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { authClientRepo } from "@/libs/better-auth/auth-client-repo";
import type { RegisterFormValues } from "../domain/auth-model";

export function useRegister() {
	const router = useRouter();

	const registerMutation = useMutation({
		mutationFn: async ({ name, email, password }: RegisterFormValues) => {
			return authClientRepo.signUp.email({ name, email, password });
		},
		onSuccess: () => {
			toast.success("Has creado tu cuenta correctamente.");
			void router.invalidate();
		},
		onError: (error) => {
			toast.error(error instanceof Error ? error.message : "Ocurrió un error");
		},
	});

	return { registerMutation };
}
