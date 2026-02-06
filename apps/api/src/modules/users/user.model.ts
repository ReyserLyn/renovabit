import { schemas } from "@renovabit/db/schema";

export type {
	AdminChangePasswordBody,
	AdminCreateUserBody,
	User,
} from "@renovabit/db/schema";

// Re-exportar esquemas admin para uso en controladores
export const adminCreateUserBody = schemas.user.adminCreate;
export const adminChangePasswordBody = schemas.user.adminChangePassword;
