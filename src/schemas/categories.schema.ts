import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "El nombre es requerido",
    }),
    duration: z.number({
      required_error: "La duración es requerida",
    }),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "El ID es requerido",
      }).uuid({
        message: "El ID no es un UUID válido",
        }),
  }),
  body: z.object({
    name: z.string().optional(),
    duration: z.number().optional(),
  }),
});
