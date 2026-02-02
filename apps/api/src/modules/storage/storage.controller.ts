import { Elysia, t } from "elysia";
import { authRoutes } from "@/modules/auth/middleware";
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
			body: t.Object({
				filename: t.String(),
				contentType: t.String(),
				prefix: t.Optional(t.String()),
			}),
			response: {
				200: t.Object({
					key: t.String(),
					uploadUrl: t.String(),
					publicUrl: t.String(),
				}),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
			},
			detail: {
				summary: "Generar una URL de subida presignada para R2",
				tags: ["Storage"],
			},
		},
	)
	.delete(
		"/file/:key",
		async ({ params }) => {
			await storageService.deleteFile(params.key);
			return { success: true };
		},
		{
			isAdmin: true,
			params: t.Object({
				key: t.String(),
			}),
			response: {
				200: t.Object({ success: t.Boolean() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
			},
			detail: {
				summary: "Eliminar un archivo de R2",
				tags: ["Storage"],
			},
		},
	);
