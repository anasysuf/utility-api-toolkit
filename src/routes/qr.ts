import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { generateQrCode } from "../lib/qrService.js";
import { validateBody } from "../middleware/validate.js";

export const qrInputSchema = z.object({
  text: z
    .string({ required_error: "text is required" })
    .min(1, "text cannot be empty")
    .max(2000, "text exceeds 2000 characters limit"),
  format: z.enum(["png", "svg", "base64"]).default("png"),
  size: z.number().int().min(50).max(2000).optional().default(300)
});

export type QrInput = z.infer<typeof qrInputSchema>;

export const qrRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.post(
    "/qr/generate",
    {
      preHandler: [validateBody(qrInputSchema)]
    },
    async (request, reply) => {
      const body = request.body as QrInput;
      const result = await generateQrCode(body);

      if (result.format === "base64") {
        return reply.status(200).send({
          success: true,
          data: {
            qr: result.data as string,
            format: "base64",
            size: body.size
          }
        });
      }

      reply.header("Content-Type", result.contentType);
      return reply.status(200).send(result.data);
    }
  );
};
