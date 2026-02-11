/**
 * Patrón centralizado para mapear errores de Better Auth a ApplicationError.
 * Preserva el código original para que el frontend pueda traducir via getAuthMessage.
 */
import { APIError } from "better-call";
import {
	BadRequestError,
	ConflictError,
	ForbiddenError,
	InternalError,
	NotFoundError,
} from "@/lib/errors";

type AuthErrorBody = { code?: string; message?: string } | undefined;

function isAPIError(error: unknown): error is APIError {
	return error instanceof Error && "statusCode" in error && "body" in error;
}

function extractAuthError(error: APIError): { code?: string; message: string } {
	const body = error.body as AuthErrorBody;
	const code = body?.code;
	const message =
		body?.message ??
		(error instanceof Error ? error.message : undefined) ??
		"Request failed";
	return { code, message };
}

/**
 * Mapea statusCode de Better Auth a nuestro ApplicationError.
 * Siempre preserva body.code para traducción en frontend.
 */
function mapStatusToError(
	statusCode: number,
	message: string,
	authCode?: string,
) {
	switch (statusCode) {
		case 400:
			return new BadRequestError(message, undefined, authCode);
		case 401:
		case 403:
			return new ForbiddenError(message, undefined, authCode);
		case 404:
			return new NotFoundError(message, undefined, authCode);
		case 409:
			return new ConflictError(message, undefined, authCode);
		case 422:
			return new BadRequestError(message, undefined, authCode);
		default:
			return new InternalError(message, undefined, authCode);
	}
}

/**
 * Procesa errores de Better Auth y los transforma en ApplicationError.
 * Usar en catch de cualquier llamada a auth.api.*
 *
 * @example
 * try {
 *   await auth.api.createUser({ ... });
 * } catch (error) {
 *   handleAuthError(error, "Failed to create user");
 * }
 */
export function handleAuthError(
	error: unknown,
	fallbackMessage: string,
): never {
	if (isAPIError(error)) {
		const { code, message } = extractAuthError(error);
		throw mapStatusToError(error.statusCode, message, code);
	}
	const message =
		error instanceof Error && error.message ? error.message : fallbackMessage;
	throw new InternalError(message);
}

/**
 * Para operaciones bulk: extrae { message, code } sin throw.
 * Usar cuando se quiere agregar a un array de errores en vez de fallar.
 */
export function parseAuthError(
	error: unknown,
	fallbackMessage: string,
): { message: string; code?: string } {
	if (isAPIError(error)) {
		const { code, message } = extractAuthError(error);
		return { message, ...(code && { code }) };
	}
	return {
		message: error instanceof Error ? error.message : fallbackMessage,
	};
}
