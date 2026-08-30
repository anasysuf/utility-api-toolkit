import { RateLimitOptions } from "@fastify/rate-limit";
import { FastifyRequest } from "fastify";

export function getRateLimitConfig(): RateLimitOptions {
  const max = Number(process.env.RATE_LIMIT_MAX) || 60;
  const timeWindow = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000;

  return {
    max,
    timeWindow,
    keyGenerator: (req: FastifyRequest) => {
      const apiKey = req.headers["x-api-key"];
      if (typeof apiKey === "string" && apiKey.trim().length > 0) {
        return `apikey:${apiKey.trim()}`;
      }
      return `ip:${req.ip}`;
    },
    errorResponseBuilder: (_req, context) => {
      return {
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: `Rate limit exceeded. Maximum ${context.max} requests allowed per time window.`
        }
      };
    }
  };
}
