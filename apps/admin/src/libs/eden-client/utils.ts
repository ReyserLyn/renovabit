/**
 * Estructura mínima de un error proveniente de la API
 */
interface ApiErrorResponse {
	message: string;
	[key: string]: unknown;
}

/**
 * Type guard para verificar si un objeto tiene la estructura de ApiErrorResponse
 */
function isApiErrorResponse(error: unknown): error is ApiErrorResponse {
	return (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		typeof (error as Record<string, unknown>).message === "string"
	);
}

/**
 * Estructura de error que devuelve Eden Treaty cuando falla una petición
 */
interface EdenError {
	status: number;
	value: unknown;
	headers: Record<string, string>;
}

/**
 * Type guard para verificar si un objeto es un error de Eden Treaty
 */
function isEdenError(error: unknown): error is EdenError {
	return (
		typeof error === "object" &&
		error !== null &&
		"status" in error &&
		"value" in error
	);
}

/**
 * Extrae un mensaje de error legible de una respuesta de Eden Treaty.
 */
export function getErrorMessage(
	res: unknown,
	defaultMessage = "Ocurrió un error inesperado",
): string {
	if (!res || typeof res !== "object") return defaultMessage;

	// Eden Treaty devuelve un objeto que puede tener una propiedad 'error'
	if ("error" in res && res.error !== null) {
		const errorObj = res.error;

		if (isEdenError(errorObj)) {
			// El campo 'value' contiene el JSON devuelto por el servidor
			if (isApiErrorResponse(errorObj.value)) {
				return errorObj.value.message;
			}

			// Si es un error de validación de Elysia/TypeBox
			if (errorObj.value && typeof errorObj.value === "object") {
				const value = errorObj.value as Record<string, unknown>;
				if ("errors" in value && Array.isArray(value.errors)) {
					const firstError = value.errors[0] as Record<string, unknown>;
					if (firstError && typeof firstError.message === "string") {
						return firstError.message;
					}
				}
			}
		}

		// Si res.error es simplemente una instancia de Error
		if (errorObj instanceof Error) {
			return errorObj.message !== "[object Object]"
				? errorObj.message
				: defaultMessage;
		}
	}

	// Manejo recursivo o fallback para status
	const response = res as { status?: number; data?: unknown };
	if (response.status && (response.status < 200 || response.status >= 300)) {
		if (isApiErrorResponse(response.data)) {
			return response.data.message;
		}
		return `Error (Status ${response.status})`;
	}

	return defaultMessage;
}

/**
 * Lanza un Error con un mensaje legible extraído de la respuesta de Eden.
 */
export function handleEdenError(res: unknown, defaultMessage?: string): never {
	throw new Error(getErrorMessage(res, defaultMessage));
}
