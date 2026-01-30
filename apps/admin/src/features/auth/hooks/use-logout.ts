import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { authClientRepo } from "@/libs/better-auth/auth-client-repo";

export function useLogout() {
	const navigate = useNavigate();
	const router = useRouter();
	const queryClient = useQueryClient();

	const logoutMutation = useMutation({
		mutationFn: async () => authClientRepo.signOut(),
		onSuccess: () => {
			queryClient.setQueryData(["session"], null);
			toast.success("Has cerrado sesión correctamente.");
			void router.invalidate();
			navigate({ to: "/login" });
		},
		onError: (error) => {
			toast.error(error instanceof Error ? error.message : "Ocurrió un error");
		},
	});

	return { logoutMutation };
}
