/** Cloudflare Image Resizing (Transform). Zona debe tener Image Resizing habilitado. */

export type CloudflareImageOptions = {
	width?: number;
	height?: number;
	fit?: "scale-down" | "contain" | "cover" | "crop" | "pad";
	quality?: number;
	format?: "auto" | "webp" | "avif" | "jpeg" | "png";
};

function buildOptionsString(options: CloudflareImageOptions): string {
	const parts: string[] = [];
	if (options.width != null) parts.push(`width=${options.width}`);
	if (options.height != null) parts.push(`height=${options.height}`);
	if (options.fit) parts.push(`fit=${options.fit}`);
	if (options.quality != null) parts.push(`quality=${options.quality}`);
	if (options.format) parts.push(`format=${options.format}`);
	return parts.join(",");
}

function isLocalOrigin(origin: string): boolean {
	try {
		const u = new URL(origin);
		return u.hostname === "localhost" || u.hostname === "127.0.0.1";
	} catch {
		return false;
	}
}

function getTransformBaseUrl(): string | undefined {
	const envUrl = (import.meta.env.VITE_PUBLIC_APP_URL as string)?.trim();
	if (typeof window !== "undefined") {
		const origin = window.location.origin;
		if (isLocalOrigin(origin) && envUrl) return envUrl;
		return origin;
	}
	return envUrl;
}

/** URL de Transform: /cdn-cgi/image/<opts>/<source>. En localhost sin VITE_PUBLIC_APP_URL devuelve la URL original. */
export function getCloudflareTransformUrl(
	imageUrl: string,
	options: CloudflareImageOptions = {},
): string {
	const baseUrl = getTransformBaseUrl();
	if (!baseUrl || !imageUrl) return imageUrl;
	if (isLocalOrigin(baseUrl)) return imageUrl;

	const opts = buildOptionsString(options);
	if (!opts) return imageUrl;

	const cleanBase = baseUrl.replace(/\/$/, "");
	const source = imageUrl.startsWith("http")
		? imageUrl
		: `${cleanBase}/${imageUrl.replace(/^\//, "")}`;
	return `${cleanBase}/cdn-cgi/image/${opts}/${source}`;
}
