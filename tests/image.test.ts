import { FastifyInstance } from "fastify";
import sharp from "sharp";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildApp } from "../src/index.js";
import { compressImage, detectImageMimeType } from "../src/lib/imageService.js";

describe("imageService unit tests", () => {
  let sampleJpegBuffer: Buffer;
  let samplePngBuffer: Buffer;

  beforeAll(async () => {
    sampleJpegBuffer = await sharp({
      create: {
        width: 150,
        height: 150,
        channels: 3,
        background: { r: 255, g: 100, b: 50 }
      }
    })
      .jpeg()
      .toBuffer();

    samplePngBuffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 0, g: 150, b: 255, alpha: 1 }
      }
    })
      .png()
      .toBuffer();
  });

  it("should detect correct MIME types via magic bytes", () => {
    expect(detectImageMimeType(sampleJpegBuffer)).toBe("image/jpeg");
    expect(detectImageMimeType(samplePngBuffer)).toBe("image/png");
    expect(detectImageMimeType(Buffer.from("not an image"))).toBeNull();
  });

  it("should compress JPEG image successfully", async () => {
    const result = await compressImage(sampleJpegBuffer, { quality: 70, format: "jpeg" });
    expect(result.format).toBe("jpeg");
    expect(result.contentType).toBe("image/jpeg");
    expect(result.originalSize).toBe(sampleJpegBuffer.length);
    expect(result.compressedSize).toBeGreaterThan(0);
    expect(Buffer.isBuffer(result.buffer)).toBe(true);
  });

  it("should convert and compress image to WebP", async () => {
    const result = await compressImage(sampleJpegBuffer, { quality: 80, format: "webp" });
    expect(result.format).toBe("webp");
    expect(result.contentType).toBe("image/webp");
    expect(result.compressedSize).toBeGreaterThan(0);
  });

  it("should reject non-image or invalid buffers", async () => {
    const fakeBuffer = Buffer.from("Hello Plain Text File");
    await expect(compressImage(fakeBuffer)).rejects.toThrow("Invalid or unsupported image binary");
  });
});

describe("POST /api/v1/image/compress integration tests", () => {
  let app: FastifyInstance;
  const apiKey = "test-secret-key-12345";
  let sampleJpegBuffer: Buffer;

  beforeAll(async () => {
    process.env.API_KEY = apiKey;
    app = await buildApp();
    await app.ready();

    sampleJpegBuffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: { r: 200, g: 50, b: 50 }
      }
    })
      .jpeg({ quality: 100 })
      .toBuffer();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should compress image and return binary output", async () => {
    const boundary = "----TestBoundary123456";
    const payload = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="quality"\r\n\r\n60\r\n`),
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="format"\r\n\r\nwebp\r\n`),
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="photo.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`
      ),
      sampleJpegBuffer,
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/image/compress",
      headers: {
        "content-type": `multipart/form-data; boundary=${boundary}`,
        "x-api-key": apiKey
      },
      payload
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toBe("image/webp");
    expect(response.headers["x-original-size"]).toBeDefined();
    expect(response.headers["x-compressed-size"]).toBeDefined();
    expect(response.rawPayload.length).toBeGreaterThan(0);
  });

  it("should support JSON response when requested via form field", async () => {
    const boundary = "----TestBoundaryJson";
    const payload = Buffer.concat([
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="response"\r\n\r\njson\r\n`
      ),
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="photo.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`
      ),
      sampleJpegBuffer,
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/image/compress",
      headers: {
        "content-type": `multipart/form-data; boundary=${boundary}`,
        "x-api-key": apiKey
      },
      payload
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.success).toBe(true);
    expect(body.data.base64).toBeDefined();
    expect(body.data.originalSize).toBeGreaterThan(0);
  });

  it("should return 400 when request is not multipart/form-data", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/image/compress",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey
      },
      payload: {
        file: "dummy"
      }
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.payload);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("INVALID_CONTENT_TYPE");
  });
});
