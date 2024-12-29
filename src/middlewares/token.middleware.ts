import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "./response.middleware";

interface JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return errorResponse(
        res,
        "No se proporcionó token de autenticación",
        401
      );
    }

    const token = authHeader.split(" ")[1]; // Obtener token después de 'Bearer'

    if (!token) {
      return errorResponse(res, "Formato de token inválido", 401);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "tu_secret_key"
    ) as JwtPayload;

    // Agregar el ID del usuario al request para uso posterior
    req.userId = decoded.id;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return errorResponse(res, "Token expirado", 401);
    }
    return errorResponse(res, "Token inválido", 401);
  }
};
