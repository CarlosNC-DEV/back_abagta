import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db";
import { ENV } from "../config";
import {
  successResponse,
  errorResponse,
} from "../middlewares/response.middleware";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.users.findMany();
    successResponse(res, "Usuarios obtenidos exitosamente", users);
  } catch (error) {
    errorResponse(res, "Error al obtener usuarios");
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    const existingUser = await db.users.findUnique({ where: { email } });
    if (existingUser) {
      return errorResponse(res, "El email ya está registrado", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await db.users.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    successResponse(res, "Usuario creado exitosamente", user);
  } catch (error) {
    errorResponse(res, "Error al crear usuario");
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userWithPassword = await db.users.findUnique({ where: { email } });

    if (!userWithPassword) {
      return errorResponse(res, "El correo electrónico es incorrecto", 401);
    }

    const isValidPassword = await bcrypt.compare(
      password,
      userWithPassword.password
    );
    if (!isValidPassword) {
      return errorResponse(res, "La contraseña es incorrecta", 401);
    }

    const token = jwt.sign({ id: userWithPassword.id }, ENV.JWT_SECRET, {
      expiresIn: "10h",
    });

    const user = {
      id: userWithPassword.id,
      email: userWithPassword.email,
      name: userWithPassword.name,
    };

    successResponse(res, "Inicio de sesión exitoso", { user, token });
  } catch (error) {
    errorResponse(res, "Error en el inicio de sesión");
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await db.users.findUnique({ where: { id } });

    if (!user) {
      return errorResponse(res, "Usuario no encontrado", 404);
    }

    successResponse(res, "Usuario obtenido exitosamente", user);
  } catch (error) {
    errorResponse(res, "Error al obtener usuario");
  }
};
