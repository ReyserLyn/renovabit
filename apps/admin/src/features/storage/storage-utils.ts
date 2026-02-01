import { api } from "@/libs/eden-client/eden-client";

export async function uploadFile(file: File, prefix = "uploads") {
	// 1. Get presigned URL from our API
	const { data, error } = await api.api.v1.storage["upload-url"].post({
		filename: file.name,
		contentType: file.type,
		prefix,
	});

	if (error || !data) {
		throw new Error(
			error?.value?.message || "Falló al obtener la URL de subida",
		);
	}

	const { uploadUrl, publicUrl, key } = data;

	// 2. Upload directly to R2
	const response = await fetch(uploadUrl, {
		method: "PUT",
		body: file,
		headers: {
			"Content-Type": file.type,
		},
	});

	if (!response.ok) {
		throw new Error("Falló la subida a R2");
	}

	return {
		url: publicUrl,
		key,
	};
}

export async function deleteFile(key: string) {
	const { error } = await api.api.v1.storage.file({ key }).delete();

	if (error) {
		console.error("Failed to delete orphaned file:", error);
	}
}
