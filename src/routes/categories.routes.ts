import { Router } from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  updateCategoryStatus
} from "../controllers/categories.controller";
import { validateSchema } from "../middlewares/zod.middleware";
import { verifyToken } from "../middlewares/token.middleware";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/categories.schema";

const router = Router();

router.use(verifyToken);

// Ruta para obtener todas las categorías
router.get("/categories", getAllCategories);
// Ruta para crear una categoría
router.post(
  "/categories/register",
  validateSchema(createCategorySchema),
  createCategory
);
// Ruta para actualizar una categoría
router.put(
  "/categories/:id",
  validateSchema(updateCategorySchema),
  updateCategory
);
// Ruta para inhabilitar una categoría
router.put(
  "/disable/:id",
  validateSchema(updateCategorySchema),
  updateCategoryStatus
);

export default router;
