// Magic bytes para validar tipos de archivo comunes
const FILE_SIGNATURES: Record<string, number[][]> = {
	"image/jpeg": [
		[0xff, 0xd8, 0xff, 0xe0],
		[0xff, 0xd8, 0xff, 0xe1],
		[0xff, 0xd8, 0xff, 0xdb],
	],
	"image/png": [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
	"image/webp": [
		[0x52, 0x49, 0x46, 0x46], // RIFF
	],
	"image/gif": [
		[0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
		[0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
	],
};

export async function validateFileType(
	fileUrl: string,
	declaredContentType: string,
): Promise<{ valid: boolean; error?: string }> {
	if (!declaredContentType.startsWith("image/")) {
		return { valid: true };
	}

	try {
		const response = await fetch(fileUrl);
		if (!response.ok) {
			return {
				valid: false,
				error: "No se pudo acceder al archivo para validación",
			};
		}

		const arrayBuffer = await response.arrayBuffer();
		const bytes = new Uint8Array(arrayBuffer.slice(0, 12));

		const signatures = FILE_SIGNATURES[declaredContentType];
		if (!signatures) {
			return { valid: true };
		}

		// Verificar si los primeros bytes coinciden con alguna firma esperada
		const matches = signatures.some((signature) => {
			return signature.every((byte, index) => bytes[index] === byte);
		});

		// Para WebP, necesitamos verificar más bytes
		if (declaredContentType === "image/webp" && bytes[0] === 0x52) {
			// Verificar que después de RIFF viene WEBP
			const webpHeader = new TextDecoder().decode(bytes.slice(4, 8));
			if (webpHeader === "WEBP") {
				return { valid: true };
			}
		}

		if (!matches && declaredContentType !== "image/webp") {
			return {
				valid: false,
				error: `El tipo de archivo no coincide con el tipo declarado (${declaredContentType})`,
			};
		}

		return { valid: true };
	} catch (error) {
		if (process.env.NODE_ENV !== "production") {
			console.warn("Error al validar tipo de archivo:", error);
		}
		return { valid: true };
	}
}
