export interface ApiResponseSuccess<T> {
  success: true;
  data: T;
}

export interface ApiResponseError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;

export interface SlugOptions {
  text: string;
  lowercase?: boolean;
  separator?: string;
}

export interface SlugResult {
  slug: string;
}

export type QrFormat = "png" | "svg" | "base64";

export interface QrOptions {
  text: string;
  format?: QrFormat;
  size?: number;
}

export interface QrResult {
  format: QrFormat;
  data: Buffer | string;
  contentType: string;
}

export type ImageOutputFormat = "jpeg" | "png" | "webp";

export interface ImageCompressOptions {
  quality?: number;
  format?: ImageOutputFormat;
}

export interface ImageCompressResult {
  buffer: Buffer;
  format: ImageOutputFormat;
  contentType: string;
  originalSize: number;
  compressedSize: number;
  savingsPercentage: number;
}
