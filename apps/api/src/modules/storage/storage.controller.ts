import { Elysia, t } from "elysia";
import { authMacro } from "@/modules/auth/middleware";
import { storageService } from "./storage.service";

export const storageController = new Elysia({ prefix: "/storage" })
	.use(authMacro)
	.post(
		"/upload-url",
		async ({ body, user, set }) => {
			if (user?.role !== "admin") {
				set.status = 403;
				return { message: "Forbidden" };
			}

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
			isAuth: true,
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
		async ({ params, user, set }) => {
			if (user?.role !== "admin") {
				set.status = 403;
				return { message: "Forbidden" };
			}

			await storageService.deleteFile(params.key);
			return { success: true };
		},
		{
			isAuth: true,
			params: t.Object({
				key: t.String(),
			}),
			response: {
				200: t.Object({ success: t.Boolean() }),
				403: t.Object({ message: t.String() }),
			},
			detail: {
				summary: "Eliminar un archivo de R2",
				tags: ["Storage"],
			},
		},
	);
