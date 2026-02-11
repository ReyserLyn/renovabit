import {
	generateSecurePassword,
	schemas,
	validatePasswordForRole,
} from "@renovabit/db/schema";
import { z } from "zod";

// User Select
export const UserSchema = schemas.user.select;
export type User = z.infer<typeof UserSchema>;

// User Update
export const UserUpdateBodySchema = schemas.user.update;
export type UserUpdateBody = z.infer<typeof UserUpdateBodySchema>;

// User Create
export const UserAdminCreateSchema = schemas.user.adminCreate;
export type UserAdminCreate = z.infer<typeof UserAdminCreateSchema>;
export type UserAdminCreateInput = z.input<typeof UserAdminCreateSchema>;

// User session
export const UserSessionSchema = schemas.user.session;
export type UserSession = z.infer<typeof UserSessionSchema>;

// User Change Password
export const UserAdminChangePasswordSchema = schemas.user.adminChangePassword;
export type UserAdminChangePassword = z.infer<
	typeof UserAdminChangePasswordSchema
>;

// User Create Form Values (input = lo que el usuario edita; output incluye username derivado)
export const UserFormValuesSchema = UserAdminCreateSchema;
export type UserFormValues = z.input<typeof UserFormValuesSchema>;

// User Update Form Values
export const UserUpdateFormValuesSchema = UserUpdateBodySchema;
export type UserUpdateFormValues = z.infer<typeof UserUpdateFormValuesSchema>;

// User Password Form Values (base, sin validación por rol)
export const UserPasswordFormValuesSchema = UserAdminChangePasswordSchema;
export type UserPasswordFormValues = z.infer<
	typeof UserPasswordFormValuesSchema
>;

/** Schema con validación de contraseña según rol (admin/distributor exigen símbolo) */
export function getUserPasswordFormValuesSchema(role: User["role"]) {
	return UserAdminChangePasswordSchema.superRefine((data, ctx) => {
		const result = validatePasswordForRole(data.password, role);
		if (!result.valid) {
			ctx.addIssue({
				code: "custom",
				message: result.message,
				path: ["password"],
			});
		}
	});
}

// User Ban
export const UserBanSchema = schemas.user.ban;
export type UserBan = z.infer<typeof UserBanSchema>;

// Ban User Form Values
export const BanUserFormValuesSchema = UserBanSchema;
export type BanUserFormValues = z.infer<typeof BanUserFormValuesSchema>;

export const defaultBanUserFormValues: BanUserFormValues = {
	banReason: "",
	banExpiresIn: 0,
};

// Default User Create Form Values (input shape)
export const defaultUserFormValues: UserFormValues = {
	name: "",
	email: "",
	role: "customer",
	password: "",
	confirmPassword: "",
	displayUsername: "",
	phone: undefined,
};

// Default User Update Form Values
export const defaultUserUpdateFormValues: UserUpdateFormValues = {
	name: undefined,
	email: undefined,
	displayUsername: undefined,
	phone: undefined,
	role: "customer",
};

// Default User Password Form Values
export const defaultUserPasswordFormValues: UserPasswordFormValues = {
	password: "",
	confirmPassword: "",
};

export function getUserDisplayName(user: User): string {
	if (user.displayUsername && user.displayUsername.trim().length > 0) {
		return user.displayUsername;
	}
	if (user.name && user.name.trim().length > 0) {
		return user.name;
	}
	if (user.username && user.username.trim().length > 0) {
		return user.username;
	}
	return user.email;
}

export const USER_ROLE_VALUES = ["admin", "customer", "distributor"] as const;

const ROLE_CONFIG = {
	admin: { label: "Administrador", weight: 3 },
	distributor: { label: "Distribuidor", weight: 2 },
	customer: { label: "Cliente", weight: 1 },
} as const satisfies Record<User["role"], { label: string; weight: number }>;

export function getRoleLabel(role: User["role"]): string {
	return ROLE_CONFIG[role].label;
}

/** Labels en plural para filtros (ej. "Administradores") */
export const ROLE_FILTER_LABELS: Record<User["role"], string> = {
	admin: "Administradores",
	distributor: "Distribuidores",
	customer: "Clientes",
};

export const roleWeight: Record<User["role"], number> = {
	admin: ROLE_CONFIG.admin.weight,
	distributor: ROLE_CONFIG.distributor.weight,
	customer: ROLE_CONFIG.customer.weight,
};

export { generateSecurePassword };
