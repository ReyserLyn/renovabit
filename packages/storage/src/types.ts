export interface R2Config {
	accountId: string;
	accessKeyId: string;
	secretAccessKey: string;
	bucketName: string;
	publicUrl?: string;
}

export interface UploadUrlOptions {
	key: string;
	contentType: string;
	expiresIn?: number;
}

export interface StorageFile {
	key: string;
	url: string;
	size?: number;
	contentType?: string;
}
