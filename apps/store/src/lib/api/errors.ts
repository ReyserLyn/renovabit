/** Formato de error de la API (sincronizado con ErrorResponseBody en apps/api). */
interface ApiErrorResponse {
	code?: string;
	message: string;
	details?: unknown;
}

/** Error tipado para la store; mismo contrato que la API. */
export class StoreApiError extends Error {
	constructor(
		message: string,
		public readonly status: number,
		public readonly code: string,
		public readonly details?: unknown,
	) {
		super(message);
		this.name = "StoreApiError";
	}

	get isNetworkError(): boolean {
		return this.status === 0 || this.code === "ERR_NETWORK";
	}

	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	get isValidationError(): boolean {
		return this.status === 400 || this.code === "ERR_VALIDATION";
	}

	get isNotFound(): boolean {
		return this.status === 404;
	}

	get isRateLimit(): boolean {
		return this.status === 429 || this.code === "ERR_RATE_LIMIT";
	}
}

/** Extrae error de la respuesta de Eden (error.status + error.value). */
function extractError(
	error: unknown,
): { status: number; data: ApiErrorResponse } | null {
	if (
		error &&
		typeof error === "object" &&
		"status" in error &&
		typeof error.status === "number" &&
		"value" in error
	) {
		return {
			status: error.status,
			data: error.value as ApiErrorResponse,
		};
	}
	return null;
}

function handleApiError(error: unknown): StoreApiError {
	if (error instanceof TypeError) {
		return new StoreApiError(
			"No se pudo conectar con el servidor. Verifica tu conexión.",
			0,
			"ERR_NETWORK",
		);
	}
	const extracted = extractError(error);
	if (extracted) {
		const { status, data } = extracted;
		return new StoreApiError(
			data.message || "Error en la solicitud",
			status,
			data.code || `ERR_HTTP_${status}`,
			data.details,
		);
	}
	if (error instanceof Error) {
		return new StoreApiError(error.message, 500, "ERR_UNKNOWN");
	}
	return new StoreApiError("Error desconocido", 500, "ERR_UNKNOWN");
}

/** Ejecuta una llamada Eden y devuelve data o lanza StoreApiError. */
export async function apiCall<T>(
	promise: Promise<{ data: T; error: null } | { data: null; error: unknown }>,
): Promise<T> {
	let result: Awaited<typeof promise>;

	try {
		result = await promise;
	} catch (err) {
		throw handleApiError(err);
	}

	if (result.error) {
		throw handleApiError(result.error);
	}

	if (result.data === null) {
		throw new StoreApiError("Respuesta vacía", 500, "ERR_EMPTY_RESPONSE");
	}

	return result.data;
}

/** Mensaje amigable para mostrar en UI según el tipo de error. */
export function getErrorMessage(error: unknown): string {
	if (error instanceof StoreApiError) {
		if (error.isNetworkError) {
			return "Sin conexión a internet. Verifica tu red.";
		}
		if (error.isAuthError) {
			return "Tu sesión expiró. Por favor inicia sesión nuevamente.";
		}
		if (error.isNotFound) {
			return "No encontramos lo que buscas.";
		}
		return error.message;
	}

	if (error instanceof Error) {
		return error.message;
	}

	return "Ocurrió un error inesperado";
}
