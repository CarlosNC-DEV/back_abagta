import { Request, Response } from "express";
import db from "../db";
import {
  successResponse,
  errorResponse,
} from "../middlewares/response.middleware";

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await db.categories.findMany({
      where:{ 
        status: "A"
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        _count: {
          select: { clients: true },
        },
      },
    });

    const categoriesWithUsers = categories.map((category) => ({
      id: category.id,
      name: category.name,
      duration: category.duration,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      users: category._count.clients,
    }));

    successResponse(
      res,
      "Categorías obtenidas exitosamente",
      categoriesWithUsers
    );
  } catch (error) {
    errorResponse(res, "Error al obtener categorías");
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, duration } = req.body;
    const category = await db.categories.create({ data: { name, duration } });
    successResponse(res, "Categoría creada exitosamente", category);
  } catch (error) {
    errorResponse(res, "Error al crear categoría");
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, duration } = req.body;
    const category = await db.categories.update({
      where: { id },
      data: { name, duration },
    });
    successResponse(res, "Categoría actualizada exitosamente", category);
  } catch (error) {
    errorResponse(res, "Error al actualizar categoría");
  }
};

export const updateCategoryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await db.categories.update({
      where: { id },
      data: {
        status: "I",
      },
    });
    successResponse(res, "Categoría inhabilitada exitosamente", category);
  } catch (error) {
    errorResponse(res, "Error al inhabilitar categoría");
  }
};
