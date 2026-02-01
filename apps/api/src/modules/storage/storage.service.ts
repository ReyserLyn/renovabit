import { R2Service } from "@renovabit/storage/r2-service";

export const storageService = new R2Service({
	accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID ?? "",
	accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ?? "",
	secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ?? "",
	bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME ?? "",
	publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL,
});
