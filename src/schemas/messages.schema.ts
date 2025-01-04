import { z } from "zod";

export const createMessageSchema = z.object({
  body: z.object({
    description: z
      .string({
        required_error: "El mensaje es requerido",
      })
      .min(3, "El mensaje debe tener al menos 3 caracteres"),
    order: z
      .number({
        required_error: "El orden es requerido",
      })
      .min(1, "El orden debe ser al menos 1"),
    daysToSend: z.number({
      required_error: "Los días para enviar son requeridos",
    }),
  }),
});

export const updateMessageSchema = z.object({
  params: z.object({
    id: z
      .string({
        required_error: "El ID es requerido",
      })
      .uuid({
        message: "El ID no es un UUID válido",
      }),
  }),
  body: z.object({
    description: z
      .string({
        required_error: "El mensaje es requerido",
      })
      .min(3, "El mensaje debe tener al menos 3 caracteres"),
  }),
});
