/** Clases throw en servicios; notFound/forbidden/badRequest en controladores; onError unifica respuesta. */

export class ApplicationError extends Error {
	constructor(
		message: string,
		public readonly code: string,
		public readonly statusCode: number,
		public readonly details?: unknown,
	) {
		super(message);
		this.name = this.constructor.name;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class NotFoundError extends ApplicationError {
	constructor(message: string = "Recurso no encontrado", details?: unknown) {
		super(message, "ERR_NOT_FOUND", 404, details);
	}
}

export class ConflictError extends ApplicationError {
	constructor(message: string, details?: unknown) {
		super(message, "ERR_CONFLICT", 409, details);
	}
}

export class ValidationError extends ApplicationError {
	constructor(message: string, details?: unknown) {
		super(message, "ERR_VALIDATION", 400, details);
	}
}

export class BadRequestError extends ApplicationError {
	constructor(message: string, details?: unknown) {
		super(message, "ERR_BAD_REQUEST", 400, details);
	}
}

export class ForbiddenError extends ApplicationError {
	constructor(
		message: string = "No tienes permiso para esta acción",
		details?: unknown,
	) {
		super(message, "ERR_FORBIDDEN", 403, details);
	}
}

export type ErrorResponseBody = {
	code?: string;
	message: string;
	details?: unknown;
};

type SetStatus = { status?: number | string };

export function notFound(
	set: SetStatus,
	message: string,
	code?: string,
): ErrorResponseBody {
	set.status = 404;
	return { ...(code && { code }), message };
}

export function forbidden(
	set: SetStatus,
	message: string,
	code?: string,
): ErrorResponseBody {
	set.status = 403;
	return { ...(code && { code }), message };
}

export function badRequest(
	set: SetStatus,
	message: string,
	options?: { code?: string; details?: unknown },
): ErrorResponseBody {
	set.status = 400;
	return {
		...(options?.code && { code: options.code }),
		message,
		...(options?.details !== undefined && { details: options.details }),
	};
}

export function mapDbErrorToResponse(
	errorMessage: string,
	isProd: boolean,
): { status: number; body: ErrorResponseBody } {
	const msgLower = errorMessage.toLowerCase();

	if (
		msgLower.includes("null value") ||
		msgLower.includes("violates not-null")
	) {
		return {
			status: 400,
			body: {
				...(isProd && { code: "ERR_VALIDATION" }),
				message: "Faltan campos obligatorios",
			},
		};
	}

	if (
		msgLower.includes("duplicate key") ||
		msgLower.includes("already exists")
	) {
		return {
			status: 409,
			body: {
				...(isProd && { code: "ERR_CONFLICT" }),
				message: "El registro ya existe",
			},
		};
	}

	if (
		errorMessage.includes("invalid input syntax for type uuid") ||
		errorMessage.includes("invalid input syntax for uuid") ||
		errorMessage.includes("uuid array")
	) {
		return {
			status: 400,
			body: {
				...(isProd && { code: "ERR_INVALID_ID" }),
				message: isProd
					? "ID o identificador con formato inválido"
					: "ID o identificador con formato inválido (UUID requerido)",
			},
		};
	}

	return {
		status: 500,
		body: {
			...(isProd && { code: "ERR_INTERNAL" }),
			message: isProd
				? "Error interno del servidor"
				: errorMessage || "Error desconocido",
		},
	};
}
