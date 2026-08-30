import sharp from "sharp";
import { ImageCompressOptions, ImageCompressResult, ImageOutputFormat } from "../types/index.js";

const VALID_MAGIC_BYTES: { mime: string; check: (buf: Buffer) => boolean }[] = [
  {
    mime: "image/jpeg",
    check: (buf: Buffer) => buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff
  },
  {
    mime: "image/png",
    check: (buf: Buffer) =>
      buf.length >= 8 &&
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4e &&
      buf[3] === 0x47 &&
      buf[4] === 0x0d &&
      buf[5] === 0x0a &&
      buf[6] === 0x1a &&
      buf[7] === 0x0a
  },
  {
    mime: "image/webp",
    check: (buf: Buffer) =>
      buf.length >= 12 &&
      buf.toString("ascii", 0, 4) === "RIFF" &&
      buf.toString("ascii", 8, 12) === "WEBP"
  }
];

export function detectImageMimeType(buffer: Buffer): string | null {
  for (const item of VALID_MAGIC_BYTES) {
    if (item.check(buffer)) {
      return item.mime;
    }
  }
  return null;
}

export async function compressImage(
  inputBuffer: Buffer,
  options: ImageCompressOptions = {}
): Promise<ImageCompressResult> {
  const originalSize = inputBuffer.length;

  if (!inputBuffer || originalSize === 0) {
    throw new Error("Empty image buffer provided");
  }

  const detectedMime = detectImageMimeType(inputBuffer);
  if (!detectedMime) {
    throw new Error("Invalid or unsupported image binary. Only JPEG, PNG, and WebP are allowed.");
  }

  let metadata: sharp.Metadata;
  try {
    metadata = await sharp(inputBuffer).metadata();
  } catch {
    throw new Error("Corrupt or unreadable image data");
  }

  const targetFormat: ImageOutputFormat =
    options.format ||
    (metadata.format === "jpeg" || metadata.format === "png" || metadata.format === "webp"
      ? (metadata.format as ImageOutputFormat)
      : "webp");

  const quality = Math.min(Math.max(Number(options.quality) || 80, 1), 100);

  let pipeline = sharp(inputBuffer);

  if (targetFormat === "jpeg") {
    pipeline = pipeline.jpeg({ quality, mozjpeg: true });
  } else if (targetFormat === "png") {
    const compressionLevel = Math.round((100 - quality) / 10);
    pipeline = pipeline.png({
      quality,
      compressionLevel: Math.min(Math.max(compressionLevel, 0), 9)
    });
  } else if (targetFormat === "webp") {
    pipeline = pipeline.webp({ quality });
  }

  const compressedBuffer = await pipeline.toBuffer();
  const compressedSize = compressedBuffer.length;
  const savings = ((originalSize - compressedSize) / originalSize) * 100;
  const savingsPercentage = Math.round(savings * 100) / 100;

  const contentTypes: Record<ImageOutputFormat, string> = {
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp"
  };

  return {
    buffer: compressedBuffer,
    format: targetFormat,
    contentType: contentTypes[targetFormat],
    originalSize,
    compressedSize,
    savingsPercentage
  };
}
