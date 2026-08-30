import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import dotenv from "dotenv";
import Fastify, { FastifyInstance } from "fastify";
import fs from "fs";
import path from "path";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { authMiddleware } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { getRateLimitConfig } from "./middleware/rateLimit.js";
import { imageRoutes } from "./routes/image.js";
import { qrRoutes } from "./routes/qr.js";
import { slugRoutes } from "./routes/slug.js";
import { getPlaygroundHtml } from "./views/playground.js";

dotenv.config();

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: process.env.NODE_ENV !== "test"
  });

  app.setErrorHandler(errorHandler);

  await app.register(cors, {
    origin: true
  });

  await app.register(multipart, {
    limits: {
      fileSize: Number(process.env.MAX_FILE_SIZE_BYTES) || 10 * 1024 * 1024
    }
  });

  await app.register(rateLimit, getRateLimitConfig());

  // Interactive Swagger UI documentation (/docs)
  const openApiPath = path.resolve(process.cwd(), "openapi.yaml");
  if (fs.existsSync(openApiPath)) {
    await app.register(swagger, {
      mode: "static",
      specification: {
        path: openApiPath,
        baseDir: process.cwd()
      }
    });

    await app.register(swaggerUi, {
      routePrefix: "/docs",
      uiConfig: {
        docExpansion: "list",
        deepLinking: false
      }
    });
  }

  // Interactive Web Playground on root route (/)
  app.get("/", async (_req, reply) => {
    reply.type("text/html; charset=utf-8");
    return reply.status(200).send(getPlaygroundHtml());
  });

  // Public health check route
  app.get("/health", async (_req, reply) => {
    return reply.status(200).send({
      status: "ok",
      timestamp: new Date().toISOString()
    });
  });

  // Version 1 API routes with authentication hook
  await app.register(
    async (v1) => {
      v1.addHook("onRequest", authMiddleware);
      await v1.register(slugRoutes);
      await v1.register(qrRoutes);
      await v1.register(imageRoutes);
    },
    { prefix: "/api/v1" }
  );

  return app;
}

async function start() {
  try {
    const app = await buildApp();
    const port = Number(process.env.PORT) || 3000;
    const host = "0.0.0.0";

    await app.listen({ port, host });
    console.log(`Utility API Toolkit running at http://${host}:${port}`);
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

// Start the server when not running in test runner
if (process.env.NODE_ENV !== "test" && !process.env.VITEST) {
  start();
}
