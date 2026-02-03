import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { authClientRepo } from "@/libs/better-auth/auth-client-repo";
import { getAuthErrorMessage } from "@/libs/better-auth/auth-error-messages";
import type { RegisterFormValues } from "../domain/auth-model";

export function useRegister() {
	const router = useRouter();

	const registerMutation = useMutation({
		mutationFn: async ({ name, email, password }: RegisterFormValues) => {
			const firstName = name.trim().split(/\s+/)[0] ?? name;
			const displayName =
				firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

			const { data, error } = await authClientRepo.signUp.email({
				name,
				email,
				password,
				role: "user",
				username: firstName.toLowerCase(),
				displayUsername: displayName,
				phone: "",
			});
			if (error) {
				const msg =
					getAuthErrorMessage(error.code) ||
					error.message ||
					"No se pudo completar el registro. Comprueba tu conexión e intenta de nuevo.";
				throw new Error(msg);
			}
			return data;
		},
		onSuccess: () => {
			toast.success("Has creado tu cuenta correctamente.");
			void router.invalidate();
		},
	});

	return { registerMutation };
}
