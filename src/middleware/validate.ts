import { FastifyRequest } from "fastify";
import { ZodSchema } from "zod";

export function validateBody<T>(schema: ZodSchema<T>) {
  return async (request: FastifyRequest): Promise<void> => {
    request.body = schema.parse(request.body);
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return async (request: FastifyRequest): Promise<void> => {
    request.query = schema.parse(request.query);
  };
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return async (request: FastifyRequest): Promise<void> => {
    request.params = schema.parse(request.params);
  };
}
