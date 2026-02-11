import { authClientRepo } from "./auth-client-repo";

/** Códigos de Better Auth + códigos propios de nuestra API (ej. EMAIL_ALREADY_IN_USE) */
type ErrorCodeKey =
	| keyof typeof authClientRepo.$ERROR_CODES
	| "EMAIL_ALREADY_IN_USE"
	| "USERNAME_IS_ALREADY_TAKEN";
type ErrorTypes = Partial<Record<ErrorCodeKey, { en: string; es: string }>>;

const errorCodes = {
	INVALID_EMAIL_OR_PASSWORD: {
		en: "Invalid email or password",
		es: "Correo o contraseña incorrectos.",
	},
	INVALID_USERNAME_OR_PASSWORD: {
		en: "Invalid username or password",
		es: "Usuario o contraseña incorrectos.",
	},
	USER_ALREADY_EXISTS: {
		en: "User already registered",
		es: "Ya existe un usuario con ese correo.",
	},
	USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: {
		en: "User already exists. Use another email.",
		es: "Ya existe un usuario con ese correo.",
	},
	INVALID_PASSWORD: {
		en: "Current password is invalid",
		es: "La contraseña actual no es válida.",
	},
	YOU_CANNOT_REMOVE_YOURSELF: {
		en: "You cannot remove yourself",
		es: "No puedes eliminarte a ti mismo.",
	},
	FAILED_TO_CREATE_USER: {
		en: "Failed to create user",
		es: "No se pudo crear el usuario. El correo o nombre de usuario podrían estar en uso.",
	},
	INVALID_EMAIL: {
		en: "Invalid email",
		es: "Correo electrónico no válido.",
	},
	USER_NOT_FOUND: {
		en: "User not found",
		es: "Usuario no encontrado.",
	},
	USERNAME_IS_ALREADY_TAKEN: {
		en: "Username already in use",
		es: "El nombre de usuario ya está en uso.",
	},
	EMAIL_ALREADY_IN_USE: {
		en: "Email already in use",
		es: "El correo electrónico ya está en uso.",
	},
} satisfies ErrorTypes;

function getRawMessage(error: unknown): string {
	if (error instanceof Error) return error.message;
	if (typeof error === "object" && error !== null && "message" in error) {
		return String((error as { message: unknown }).message);
	}
	return "";
}

/**
 * Obtiene el mensaje de error de auth traducido.
 * Usa código cuando está disponible, si no fallback de red o genérico.
 */
export function getAuthMessage(
	error: unknown,
	lang: "en" | "es" = "es",
): string {
	const code =
		error && typeof error === "object" && "code" in error
			? String((error as { code: unknown }).code)
			: undefined;

	if (code && code in errorCodes) {
		return errorCodes[code as keyof typeof errorCodes][lang];
	}

	const msg = getRawMessage(error);
	if (msg === "Failed to fetch") {
		return lang === "es"
			? "No se pudo conectar. Inténtalo de nuevo."
			: "Could not connect. Please try again.";
	}
	return (
		msg ||
		(lang === "es"
			? "Ocurrió un error. Inténtalo de nuevo."
			: "An error occurred. Please try again.")
	);
}
