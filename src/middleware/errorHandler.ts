import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

export class ApiError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function errorHandler(
  error: FastifyError | ApiError | Error,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof ApiError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {})
      }
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request data",
        details: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message
        }))
      }
    });
  }

  const fastifyErr = error as FastifyError;
  const statusCode = fastifyErr.statusCode || 500;

  if (statusCode === 429) {
    return reply.status(429).send({
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: fastifyErr.message || "Too many requests, please try again later"
      }
    });
  }

  if (statusCode === 413 || fastifyErr.code === "FST_REQ_FILE_TOO_LARGE") {
    return reply.status(413).send({
      success: false,
      error: {
        code: "FILE_TOO_LARGE",
        message: "Uploaded file exceeds the maximum allowed size of 10MB"
      }
    });
  }

  if (statusCode === 404) {
    return reply.status(404).send({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: fastifyErr.message || "Route not found"
      }
    });
  }

  if (statusCode >= 400 && statusCode < 500) {
    return reply.status(statusCode).send({
      success: false,
      error: {
        code: fastifyErr.code || "BAD_REQUEST",
        message: fastifyErr.message
      }
    });
  }

  return reply.status(500).send({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected internal error occurred"
    }
  });
}
