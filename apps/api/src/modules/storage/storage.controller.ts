import { Elysia } from "elysia";
import { badRequest } from "@/lib/errors";
import { validateFileType } from "@/lib/file-validation";
import { logger } from "@/lib/logger";
import { validateStorageKey } from "@/lib/storage-key-validation";
import { authRoutes } from "@/modules/auth";
import {
	deleteFileParams,
	deleteFileResponse,
	messageResponse,
	uploadUrlBody,
	uploadUrlResponse,
	verifyUploadBody,
	verifyUploadErrorResponse,
	verifyUploadSuccessResponse,
} from "./storage.model";
import { storageService } from "./storage.service";

export const storageController = new Elysia({ prefix: "/storage" })
	.use(authRoutes)
	.post(
		"/upload-url",
		async ({ body }) => {
			const key = storageService.generateKey(body.filename, body.prefix);
			const uploadUrl = await storageService.getPresignedUploadUrl({
				key,
				contentType: body.contentType,
			});

			return {
				key,
				uploadUrl,
				publicUrl: storageService.getFileUrl(key),
			};
		},
		{
			isAdmin: true,
			body: uploadUrlBody,
			response: {
				200: uploadUrlResponse,
				401: messageResponse,
				403: messageResponse,
			},
			detail: {
				summary: "Generar una URL de subida presignada para R2",
				tags: ["Storage"],
			},
		},
	)
	.post(
		"/verify-upload",
		async ({ body, set }) => {
			const { publicUrl, declaredContentType, key } = body;

			if (!publicUrl || !declaredContentType) {
				set.status = 400;
				return {
					success: false as const,
					message: "publicUrl y declaredContentType son requeridos",
				};
			}

			const validation = await validateFileType(publicUrl, declaredContentType);

			if (!validation.valid) {
				if (key) {
					const keyValidation = validateStorageKey(key);
					if (keyValidation.valid) {
						try {
							await storageService.deleteFile(key);
							logger.warn(
								{
									key,
									publicUrl,
									declaredContentType,
									error: validation.error,
								},
								"Archivo eliminado por no coincidir con tipo declarado",
							);
						} catch (error) {
							logger.error(
								{ err: error, key },
								"Error al eliminar archivo inválido",
							);
						}
					}
				} else {
					logger.warn(
						{
							publicUrl,
							declaredContentType,
							error: validation.error,
						},
						"Archivo subido no coincide con tipo declarado (key no proporcionada)",
					);
				}

				set.status = 400;
				return {
					success: false as const,
					message: validation.error || "El tipo de archivo no coincide",
				};
			}

			return { success: true as const };
		},
		{
			isAdmin: true,
			body: verifyUploadBody,
			response: {
				200: verifyUploadSuccessResponse,
				400: verifyUploadErrorResponse,
				401: messageResponse,
				403: messageResponse,
			},
			detail: {
				summary: "Verificar integridad de archivo subido (validar magic bytes)",
				tags: ["Storage"],
			},
		},
	)
	.delete(
		"/file/:key",
		async ({ params, set }) => {
			const keyValidation = validateStorageKey(params.key);
			if (!keyValidation.valid) {
				return badRequest(set, keyValidation.error);
			}
			await storageService.deleteFile(params.key);
			return { success: true };
		},
		{
			isAdmin: true,
			params: deleteFileParams,
			response: {
				200: deleteFileResponse,
				401: messageResponse,
				403: messageResponse,
			},
			detail: {
				summary: "Eliminar un archivo de R2",
				tags: ["Storage"],
			},
		},
	);
