import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { compressImage } from "../lib/imageService.js";
import { ApiError } from "../middleware/errorHandler.js";
import { ImageOutputFormat } from "../types/index.js";

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE_BYTES) || 10 * 1024 * 1024; // 10MB

export const imageRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.post("/image/compress", async (request, reply) => {
    if (!request.isMultipart()) {
      throw new ApiError(
        400,
        "INVALID_CONTENT_TYPE",
        "Request must be multipart/form-data with a 'file' field"
      );
    }

    let fileBuffer: Buffer | null = null;
    let fileMimeType = "";
    let quality: number | undefined;
    let targetFormat: ImageOutputFormat | undefined;
    let requestedResponse: string | undefined;

    const parts = request.parts();

    for await (const part of parts) {
      if (part.type === "file") {
        if (part.fieldname === "file") {
          fileMimeType = part.mimetype;
          fileBuffer = await part.toBuffer();
        } else {
          // Drain stream for unused files to prevent memory leak
          await part.toBuffer();
        }
      } else {
        if (part.fieldname === "quality") {
          const parsed = Number(part.value);
          if (isNaN(parsed) || parsed < 1 || parsed > 100) {
            throw new ApiError(
              400,
              "INVALID_QUALITY",
              "Quality must be a number between 1 and 100"
            );
          }
          quality = parsed;
        } else if (part.fieldname === "format") {
          const val = String(part.value).toLowerCase();
          if (val !== "jpeg" && val !== "png" && val !== "webp") {
            throw new ApiError(
              400,
              "INVALID_FORMAT",
              "Format must be one of: 'jpeg', 'png', or 'webp'"
            );
          }
          targetFormat = val as ImageOutputFormat;
        } else if (part.fieldname === "response") {
          requestedResponse = String(part.value).toLowerCase();
        }
      }
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      throw new ApiError(400, "MISSING_FILE", "A 'file' field containing image data is required");
    }

    if (fileBuffer.length > MAX_FILE_SIZE) {
      throw new ApiError(
        413,
        "FILE_TOO_LARGE",
        `Uploaded file size (${fileBuffer.length} bytes) exceeds 10MB limit`
      );
    }

    if (!fileMimeType.startsWith("image/")) {
      throw new ApiError(
        400,
        "INVALID_MIME_TYPE",
        `Only image MIME types are supported, received: ${fileMimeType}`
      );
    }

    let result;
    try {
      result = await compressImage(fileBuffer, { quality, format: targetFormat });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Image processing failed";
      throw new ApiError(400, "IMAGE_PROCESSING_FAILED", message);
    }

    const query = request.query as Record<string, string | undefined>;
    const wantsJson =
      requestedResponse === "json" ||
      query?.response === "json" ||
      (request.headers.accept && request.headers.accept.includes("application/json"));

    if (wantsJson) {
      return reply.status(200).send({
        success: true,
        data: {
          format: result.format,
          contentType: result.contentType,
          originalSize: result.originalSize,
          compressedSize: result.compressedSize,
          savingsPercentage: result.savingsPercentage,
          base64: `data:${result.contentType};base64,${result.buffer.toString("base64")}`
        }
      });
    }

    reply.header("Content-Type", result.contentType);
    reply.header("X-Original-Size", result.originalSize.toString());
    reply.header("X-Compressed-Size", result.compressedSize.toString());
    reply.header("X-Savings-Percentage", `${result.savingsPercentage}%`);

    return reply.status(200).send(result.buffer);
  });
};
