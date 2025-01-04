import { z } from "zod";

export const createClientSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "El nombre es requerido",
    }),
    phone: z
      .string({
        required_error: "El teléfono es requerido",
      })
      .min(10, {
        message: "El teléfono debe tener al menos 10 dígitos",
      })
      .max(10, {
        message: "El teléfono debe tener máximo 10 dígitos",
      }),
    plate: z.string({
      required_error: "La placa es requerida",
    }),
    date: z.string({
      required_error: "La fecha es requerida",
    }),
    address: z.string({
      required_error: "La dirección es requerida",
    }),
    categoryId: z
      .string({
        required_error: "El ID de categoría es requerido",
      })
      .uuid({
        message: "El ID de categoría no es un UUID válido",
      }),
  }),
});

export const getClientsByCategorySchema = z.object({
  params: z.object({
    id_category: z
      .string({
        required_error: "El ID de categoría es requerido",
      })
      .uuid({
        message: "El ID de categoría no es un UUID válido",
      }),
  }),
});

export const updateClientSchema = z.object({
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
    name: z.string().optional(),
    phone: z
      .string()
      .min(10, {
        message: "El teléfono debe tener al menos 10 dígitos",
      })
      .max(10, {
        message: "El teléfono debe tener máximo 10 dígitos",
      })
      .optional(),
    plate: z.string().optional(),
    date: z.string().optional(),
    address: z.string().optional(),
    status: z.string().optional(),
  }),
});

export const payClientSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "El ID del cliente es requerido",
    }).uuid({
      message: "El ID del cliente no es un UUID válido",
    }),
  }),
});
