import { S3Client } from "@aws-sdk/client-s3";
import type { R2Config } from "./types";

export const createR2Client = (config: R2Config) => {
	return new S3Client({
		region: "auto",
		endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: config.accessKeyId,
			secretAccessKey: config.secretAccessKey,
		},
	});
};
