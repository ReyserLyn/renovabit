import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createR2Client } from "./client";
import type { R2Config, UploadUrlOptions } from "./types";

const R2_INTERNAL_REGEX = /cloudflarestorage\.com\/(.+)$/;
const R2_DEV_REGEX = /r2\.dev\/(.+)$/;
const SAFE_NAME_REGEX = /[^a-z0-9]/g;
const SLASH_START_REGEX = /^\//;
const SLASH_END_REGEX = /\/$/;

export class R2Service {
	private readonly client;
	private readonly bucket: string;
	private readonly publicBaseUrl?: string;

	constructor(config: R2Config) {
		this.client = createR2Client(config);
		this.bucket = config.bucketName;
		this.publicBaseUrl = config.publicUrl;
	}

	/**
	 * Generates a presigned URL for direct upload from the browser.
	 * This is the most efficient and secure way to handle large file uploads.
	 */
	async getPresignedUploadUrl(options: UploadUrlOptions): Promise<string> {
		const command = new PutObjectCommand({
			Bucket: this.bucket,
			Key: options.key,
			ContentType: options.contentType,
		});

		// URL expires in 15 minutes by default
		return await getSignedUrl(this.client, command, {
			expiresIn: options.expiresIn ?? 900,
		});
	}

	/**
	 * Returns the key (path) if the URL is from our public base; otherwise null.
	 */
	getKeyFromPublicUrl(url: string): string | null {
		// 1. Try with custom public URL
		if (this.publicBaseUrl) {
			const cleanBase = this.publicBaseUrl.replace(SLASH_END_REGEX, "");
			if (url.startsWith(cleanBase)) {
				return url.slice(cleanBase.length).replace(SLASH_START_REGEX, "");
			}
		}

		// 2. Try with R2 internal format: https://bucket.account.r2.cloudflarestorage.com/key
		const r2Match = R2_INTERNAL_REGEX.exec(url);
		if (r2Match?.[1]) {
			return r2Match[1];
		}

		// 3. Try with r2.dev format: https://pub-xxx.r2.dev/key
		const pubMatch = R2_DEV_REGEX.exec(url);
		if (pubMatch?.[1]) {
			return pubMatch[1];
		}

		return null;
	}

	/**
	 * Deletes a file from the bucket.
	 */
	async deleteFile(key: string): Promise<void> {
		const command = new DeleteObjectCommand({
			Bucket: this.bucket,
			Key: key,
		});

		await this.client.send(command).catch((e) => {
			console.error(`Error deleting file ${key} from R2:`, e);
		});
	}

	/**
	 * Constructs the public URL for a given key.
	 */
	getFileUrl(key: string): string {
		if (this.publicBaseUrl) {
			const base = this.publicBaseUrl.replace(SLASH_END_REGEX, "");
			return `${base}/${key.replace(SLASH_START_REGEX, "")}`;
		}

		// Fallback to R2 internal URL if no public URL provided (might not work if bucket is private)
		return `https://${this.bucket}.${this.client.config.endpoint}/${key}`;
	}

	/**
	 * Helper to generate a unique key for a file to prevent collisions.
	 */
	generateKey(filename: string, prefix = "uploads"): string {
		const timestamp = Date.now();
		const random = Math.random().toString(36).substring(2, 8);

		const parts = filename.split(".");
		const extension = parts.length > 1 ? parts.pop() || "" : "";
		const namePart = parts.join(".") || "file";

		const safeName = namePart.toLowerCase().replace(SAFE_NAME_REGEX, "-");

		const finalExtension = extension.toLowerCase();
		return finalExtension
			? `${prefix}/${timestamp}-${random}-${safeName}.${finalExtension}`
			: `${prefix}/${timestamp}-${random}-${safeName}`;
	}
}
