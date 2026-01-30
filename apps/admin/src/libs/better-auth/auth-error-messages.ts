import { authClientRepo } from "./auth-client-repo";

type AuthErrorCode = keyof typeof authClientRepo.$ERROR_CODES;

type ErrorTypes = Partial<Record<AuthErrorCode, { en: string; es: string }>>;

const errorCodes = {
	INVALID_EMAIL_OR_PASSWORD: {
		en: "Invalid email or password",
		es: "Correo o contraseña incorrectos.",
	},
	USER_ALREADY_EXISTS: {
		en: "User already registered",
		es: "Ya existe un usuario con ese correo.",
	},
	INVALID_PASSWORD: {
		en: "Current password is invalid",
		es: "La contraseña actual no es válida.",
	},
} satisfies ErrorTypes;

export function getAuthErrorMessage(
	code: string | undefined,
	lang: "en" | "es" = "es",
): string {
	if (!code || !(code in errorCodes)) return "";
	return errorCodes[code as keyof typeof errorCodes][lang];
}
