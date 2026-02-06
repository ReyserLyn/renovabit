/**
 * Valida keys de storage (R2/S3) para evitar path traversal y formas evasivas.
 * Considera: .., %2e%2e, %252e, / inicial, segmentos . o .., null bytes, caracteres no permitidos.
 */
const MAX_KEY_LENGTH = 1024;
const SAFE_KEY_REGEX = /^[a-zA-Z0-9/_.-]+$/;

function decodeKeyOnce(raw: string): string {
	try {
		return decodeURIComponent(raw);
	} catch {
		return raw;
	}
}

export function validateStorageKey(
	rawKey: string,
): { valid: true } | { valid: false; error: string } {
	if (typeof rawKey !== "string" || rawKey.length === 0) {
		return { valid: false, error: "Key inválida o vacía" };
	}
	if (rawKey.length > MAX_KEY_LENGTH) {
		return { valid: false, error: "Key demasiado larga" };
	}

	const decoded = decodeKeyOnce(rawKey);

	if (decoded.includes("\0")) {
		return { valid: false, error: "Key con caracteres no permitidos" };
	}
	if (decoded.startsWith("/")) {
		return { valid: false, error: "Key no puede comenzar por /" };
	}
	if (decoded.includes("..")) {
		return { valid: false, error: "Key no puede contener .." };
	}

	const segments = decoded.split("/").filter((s) => s.length > 0);
	if (segments.some((s) => s === "." || s === "..")) {
		return { valid: false, error: "Key con segmentos . o .. no permitidos" };
	}

	if (!SAFE_KEY_REGEX.test(decoded)) {
		return {
			valid: false,
			error: "Key solo puede contener letras, números, /, _, ., -",
		};
	}

	return { valid: true };
}
