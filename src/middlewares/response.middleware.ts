import { Response } from "express";

/**
 * Respuesta exitosa
 * @param res - El objeto Response de Express
 * @param message - Mensaje descriptivo
 * @param data - Datos a enviar al cliente
 */
export const successResponse = (
  res: Response,
  message: string,
  data: any = null
) => {
  res.status(200).json({
    status: true,
    message,
    data,
  });
  return;
};

/**
 * Respuesta de error
 * @param res - El objeto Response de Express
 * @param message - Mensaje descriptivo del error
 * @param code - Código de estado HTTP (por defecto 500)
 */
export const errorResponse = (
  res: Response,
  message: string,
  code: number = 500
) => {
  res.status(code).json({
    status: false,
    message,
    data: null,
  });
  return;
};

/**
 * Respuesta de error
 * @param res - El objeto Response de Express
 * @param message - Mensaje descriptivo del error
 * @param code - Código de estado HTTP (por defecto 500)
 * @param message - Mensaje Zod
 */
export const errorResponseZod = (
  res: Response,
  message: string,
  code: number = 500,
  errors: any
) => {
  res.status(code).json({
    status: false,
    message,
    data: errors,
  });
  return;
};
