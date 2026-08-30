import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "./errorHandler.js";

export async function authMiddleware(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const configuredApiKey = process.env.API_KEY;

  // If no API_KEY configured in environment, allow requests in test/development if explicitly disabled
  if (!configuredApiKey) {
    return;
  }

  const apiKeyHeader = request.headers["x-api-key"];

  if (!apiKeyHeader || apiKeyHeader !== configuredApiKey) {
    throw new ApiError(401, "UNAUTHORIZED", "Invalid or missing API key in x-api-key header");
  }
}
