import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { generateSlug } from "../lib/slugService.js";
import { validateBody } from "../middleware/validate.js";

export const slugInputSchema = z.object({
  text: z.string({ required_error: "text is required" }).min(1, "text cannot be empty"),
  lowercase: z.boolean().optional().default(true),
  separator: z
    .string()
    .max(5, "separator length cannot exceed 5 characters")
    .optional()
    .default("-")
});

export type SlugInput = z.infer<typeof slugInputSchema>;

export const slugRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.post(
    "/slug",
    {
      preHandler: [validateBody(slugInputSchema)]
    },
    async (request, reply) => {
      const body = request.body as SlugInput;
      const result = generateSlug(body);

      return reply.status(200).send({
        success: true,
        data: result
      });
    }
  );
};
