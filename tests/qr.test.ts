import { FastifyInstance } from "fastify";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildApp } from "../src/index.js";
import { generateQrCode } from "../src/lib/qrService.js";

describe("qrService unit tests", () => {
  it("should generate a PNG buffer by default", async () => {
    const result = await generateQrCode({ text: "https://example.com" });
    expect(result.format).toBe("png");
    expect(result.contentType).toBe("image/png");
    expect(Buffer.isBuffer(result.data)).toBe(true);
    expect((result.data as Buffer).length).toBeGreaterThan(100);
  });

  it("should generate SVG string when format is svg", async () => {
    const result = await generateQrCode({ text: "https://example.com", format: "svg" });
    expect(result.format).toBe("svg");
    expect(result.contentType).toBe("image/svg+xml");
    expect(typeof result.data).toBe("string");
    expect((result.data as string).includes("<svg")).toBe(true);
  });

  it("should generate Base64 Data URL when format is base64", async () => {
    const result = await generateQrCode({ text: "https://example.com", format: "base64" });
    expect(result.format).toBe("base64");
    expect(typeof result.data).toBe("string");
    expect((result.data as string).startsWith("data:image/png;base64,")).toBe(true);
  });

  it("should throw error if text is empty", async () => {
    await expect(generateQrCode({ text: "" })).rejects.toThrow(
      "Text parameter is required and cannot be empty"
    );
  });

  it("should throw error if text exceeds 2000 characters", async () => {
    const longText = "a".repeat(2001);
    await expect(generateQrCode({ text: longText })).rejects.toThrow(
      "Text length exceeds the maximum limit of 2000 characters"
    );
  });
});

describe("POST /api/v1/qr/generate integration tests", () => {
  let app: FastifyInstance;
  const apiKey = "test-secret-key-12345";

  beforeAll(async () => {
    process.env.API_KEY = apiKey;
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return binary PNG for png format", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/qr/generate",
      headers: {
        "x-api-key": apiKey
      },
      payload: {
        text: "https://github.com",
        format: "png",
        size: 250
      }
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toBe("image/png");
    expect(response.rawPayload.length).toBeGreaterThan(100);
  });

  it("should return JSON with base64 for base64 format", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/qr/generate",
      headers: {
        "x-api-key": apiKey
      },
      payload: {
        text: "https://github.com",
        format: "base64"
      }
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.success).toBe(true);
    expect(body.data.format).toBe("base64");
    expect(body.data.qr.startsWith("data:image/png;base64,")).toBe(true);
  });

  it("should return 400 when invalid format is provided", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/qr/generate",
      headers: {
        "x-api-key": apiKey
      },
      payload: {
        text: "https://github.com",
        format: "unsupported_format"
      }
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.payload);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });
});
