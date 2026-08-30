import { FastifyInstance } from "fastify";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildApp } from "../src/index.js";
import { generateSlug } from "../src/lib/slugService.js";

describe("slugService unit tests", () => {
  it("should convert simple text to lowercase slug with hyphens", () => {
    const result = generateSlug({ text: "Hello World API" });
    expect(result.slug).toBe("hello-world-api");
  });

  it("should support custom separators", () => {
    const result = generateSlug({ text: "Hello World API", separator: "_" });
    expect(result.slug).toBe("hello_world_api");
  });

  it("should respect lowercase false option", () => {
    const result = generateSlug({ text: "Hello World API", lowercase: false });
    expect(result.slug).toBe("Hello-World-API");
  });

  it("should sanitize special characters and whitespace properly", () => {
    const result = generateSlug({ text: "Clean Code & TypeScript Patterns! #1" });
    expect(result.slug).toBe("clean-code-and-typescript-patterns-1");
  });

  it("should throw an error when text is empty or only whitespace", () => {
    expect(() => generateSlug({ text: "   " })).toThrow(
      "Text parameter is required and cannot be empty"
    );
  });
});

describe("POST /api/v1/slug integration tests", () => {
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

  it("should generate a slug successfully with 200 status", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/slug",
      headers: {
        "x-api-key": apiKey
      },
      payload: {
        text: "Building Modular REST APIs with TypeScript",
        separator: "-"
      }
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.success).toBe(true);
    expect(body.data.slug).toBe("building-modular-rest-apis-with-typescript");
  });

  it("should return 400 when text field is missing in request", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/slug",
      headers: {
        "x-api-key": apiKey
      },
      payload: {
        separator: "-"
      }
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.payload);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("should return 401 when x-api-key is invalid", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/slug",
      headers: {
        "x-api-key": "wrong-key"
      },
      payload: {
        text: "Sample text"
      }
    });

    expect(response.statusCode).toBe(401);
    const body = JSON.parse(response.payload);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });
});
