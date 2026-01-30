import { authClientRepo } from "@/libs/better-auth/auth-client-repo";

export type Session = typeof authClientRepo.$Infer.Session;

export function useSession() {
	return authClientRepo.useSession();
}
