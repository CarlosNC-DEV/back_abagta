import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "El correo electrónico es requerido",
      })
      .email("El formato del correo electrónico no es válido"),
    name: z
      .string({
        required_error: "El nombre es requerido",
      })
      .min(3, "El nombre debe tener al menos 3 caracteres"),
    password: z
      .string({
        required_error: "La contraseña es requerida",
      })
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "El correo electrónico es requerido",
      })
      .email("El formato del correo electrónico no es válido"),
    password: z.string({
      required_error: "La contraseña es requerida",
    }),
  }),
});

export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "El ID es requerido"
    }).uuid({
      message: "El ID no es un UUID válido"
    }),
  }),
});
